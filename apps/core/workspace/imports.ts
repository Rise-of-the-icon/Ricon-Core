import type {
  ResearchModule,
  SourceCandidate,
  SourceCandidateProvider,
} from "./types";

interface ImportSearchInput {
  provider: SourceCandidateProvider;
  query: string;
}

export interface ImportSearchResult {
  candidates: SourceCandidate[];
  error?: string;
}

interface WikipediaSearchPage {
  id?: number;
  key?: string;
  title?: string;
  excerpt?: string;
  description?: string;
}

interface BalldontliePlayer {
  id?: number;
  first_name?: string;
  last_name?: string;
  position?: string;
  height?: string;
  weight?: string;
  jersey_number?: string;
  college?: string;
  country?: string;
  draft_year?: number;
  draft_round?: number;
  draft_number?: number;
  team?: {
    full_name?: string;
    abbreviation?: string;
  };
}

function nowIso() {
  return new Date().toISOString();
}

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function wikipediaTitleFromQuery(query: string) {
  try {
    const url = new URL(query);
    if (!url.hostname.endsWith("wikipedia.org")) {
      return null;
    }

    const title = url.pathname.split("/wiki/")[1];
    return title ? decodeURIComponent(title).replace(/_/g, " ") : null;
  } catch {
    return null;
  }
}

function fallbackWikipediaCandidate(query: string): SourceCandidate {
  const title = wikipediaTitleFromQuery(query) ?? query.trim();
  return normalizeWikipediaCandidate({
    key: title.replace(/\s+/g, "_"),
    title,
    description: "Fallback discovery candidate. Use only to locate primary, authorized, or official sources.",
  });
}

function candidateId(provider: SourceCandidateProvider, externalId: string | number | undefined) {
  return `${provider}-${externalId ?? crypto.randomUUID()}`;
}

export function normalizeWikipediaCandidate(page: WikipediaSearchPage): SourceCandidate {
  const title = page.title || page.key || "Wikipedia result";
  const key = page.key || title.replace(/\s+/g, "_");

  return {
    id: candidateId("wikipedia", page.id ?? key),
    provider: "wikipedia",
    title,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(key).replace(/%20/g, "_")}`,
    publicationName: "Wikipedia",
    fetchedAt: nowIso(),
    suggestedModule: "biography",
    status: "blocked_for_claims",
    warning: "Discovery only. Wikipedia is blocked by source standards and cannot be used as a claim citation.",
    notes: stripHtml(page.description || page.excerpt || "Use this only to identify primary or authorized sources."),
    metadata: {
      pageId: page.id ?? null,
      key,
      description: stripHtml(page.description || ""),
    },
  };
}

export function normalizeBalldontliePlayerCandidate(player: BalldontliePlayer): SourceCandidate {
  const firstName = player.first_name ?? "";
  const lastName = player.last_name ?? "";
  const title = `${firstName} ${lastName}`.trim() || "balldontlie player";
  const team = player.team?.full_name ?? player.team?.abbreviation ?? "";
  const suggestedModule: ResearchModule =
    player.draft_year || player.draft_round || player.draft_number ? "career_timeline" : "statistics";

  return {
    id: candidateId("balldontlie", player.id),
    provider: "balldontlie",
    title,
    url: player.id
      ? `https://www.balldontlie.io/api/nba/players/${player.id}`
      : "https://www.balldontlie.io/",
    publicationName: "balldontlie",
    fetchedAt: nowIso(),
    suggestedModule,
    status: "needs_review",
    warning: "Discovery only. Review against official league/team records before using as a citation.",
    notes: [
      player.position ? `Position: ${player.position}` : "",
      team ? `Team: ${team}` : "",
      player.height ? `Height: ${player.height}` : "",
      player.weight ? `Weight: ${player.weight}` : "",
      player.draft_year ? `Draft: ${player.draft_year}` : "",
    ]
      .filter(Boolean)
      .join(" · "),
    metadata: {
      playerId: player.id ?? null,
      position: player.position ?? null,
      height: player.height ?? null,
      weight: player.weight ?? null,
      jerseyNumber: player.jersey_number ?? null,
      college: player.college ?? null,
      country: player.country ?? null,
      draftYear: player.draft_year ?? null,
      draftRound: player.draft_round ?? null,
      draftNumber: player.draft_number ?? null,
      team,
    },
  };
}

async function searchWikipedia(query: string): Promise<ImportSearchResult> {
  const title = wikipediaTitleFromQuery(query);
  const searchQuery = title ?? query;
  const url = new URL("https://en.wikipedia.org/w/rest.php/v1/search/page");
  url.searchParams.set("q", searchQuery);
  url.searchParams.set("limit", "8");

  try {
    const response = await fetch(url, {
      headers: {
        "Api-User-Agent": "RICON Research Workspace (research@ricon.local)",
      },
    });

    if (!response.ok) {
      return {
        candidates: [fallbackWikipediaCandidate(searchQuery)],
        error: "Wikipedia search is unavailable, so a discovery-only candidate was created from the query.",
      };
    }

    const payload = (await response.json()) as { pages?: WikipediaSearchPage[] };
    const candidates = (payload.pages ?? []).map(normalizeWikipediaCandidate);

    return {
      candidates: candidates.length > 0 ? candidates : [fallbackWikipediaCandidate(searchQuery)],
    };
  } catch {
    return {
      candidates: [fallbackWikipediaCandidate(searchQuery)],
      error: "Wikipedia search is unavailable, so a discovery-only candidate was created from the query.",
    };
  }
}

async function searchBalldontlie(query: string): Promise<ImportSearchResult> {
  const apiKey = process.env.BALLDONTLIE_API_KEY;

  if (!apiKey) {
    return {
      candidates: [],
      error: "BALLDONTLIE_API_KEY is not configured. Manual source entry is still available.",
    };
  }

  const url = new URL("https://api.balldontlie.io/v1/players");
  url.searchParams.set("search", query);
  url.searchParams.set("per_page", "8");

  const response = await fetch(url, {
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) {
    return {
      candidates: [],
      error: "balldontlie discovery search is unavailable right now.",
    };
  }

  const payload = (await response.json()) as { data?: BalldontliePlayer[] };
  return {
    candidates: (payload.data ?? []).map(normalizeBalldontliePlayerCandidate),
  };
}

export async function searchImportCandidates({
  provider,
  query,
}: ImportSearchInput): Promise<ImportSearchResult> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      candidates: [],
      error: "Enter a name or source URL to search.",
    };
  }

  if (provider === "wikipedia") {
    return searchWikipedia(trimmedQuery);
  }

  if (provider === "balldontlie") {
    return searchBalldontlie(trimmedQuery);
  }

  return {
    candidates: [],
    error: "Manual sources can be added directly in the source map.",
  };
}
