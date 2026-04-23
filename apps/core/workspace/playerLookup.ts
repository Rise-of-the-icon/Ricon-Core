/**
 * Structured player lookup — combines balldontlie (NBA structured data) and
 * Wikipedia/Wikidata (biography, image, DOB) into a single result that can
 * auto-populate the Identity step.
 *
 * Each field in the result carries its own source URL so attribution survives
 * into the ClaimMeta when the researcher applies the match.
 */

export type LookupProvider = "balldontlie" | "wikipedia";

export interface AttributedField {
  value: string;
  source: string; // URL the value came from
  provider: LookupProvider;
}

export interface PlayerLookupMatch {
  /** Stable id for React keying */
  id: string;
  name: string;
  /** Short summary for the result row (e.g. "American NBA guard · Dallas Mavericks") */
  subtitle: string;
  /** Thumbnail used in the search dropdown */
  thumbnail?: string;
  /** Which providers contributed to this match */
  providers: LookupProvider[];
  /** Structured fields — every entry is optional */
  fields: {
    name?: AttributedField;
    legalName?: AttributedField;
    dateOfBirth?: AttributedField;
    placeOfBirth?: AttributedField;
    nationality?: AttributedField;
    heightWeight?: AttributedField;
    profileImage?: AttributedField;
    biographyExcerpt?: AttributedField;
  };
}

/* --------------------------- balldontlie ----------------------------- */

interface BalldontliePlayer {
  id: number;
  first_name: string;
  last_name: string;
  position?: string;
  height?: string; // "6-4"
  weight?: string; // "205"
  jersey_number?: string;
  college?: string;
  country?: string;
  draft_year?: number;
  team?: { full_name?: string; abbreviation?: string };
}

function balldontliePlayerUrl(id: number) {
  return `https://www.balldontlie.io/api/nba/players/${id}`;
}

function formatHeightWeight(height?: string, weight?: string): string {
  if (!height && !weight) return "";
  const parts: string[] = [];
  if (height) {
    const [ft, inch] = height.split("-");
    if (ft && inch) parts.push(`${ft}'${inch}"`);
    else parts.push(height);
  }
  if (weight) parts.push(`${weight} lb`);
  return parts.join(" · ");
}

async function searchBalldontlie(query: string): Promise<PlayerLookupMatch[]> {
  const apiKey = process.env.BALLDONTLIE_API_KEY;
  if (!apiKey) return [];

  const url = new URL("https://api.balldontlie.io/v1/players");
  url.searchParams.set("search", query);
  url.searchParams.set("per_page", "6");

  try {
    const res = await fetch(url, { headers: { Authorization: apiKey } });
    if (!res.ok) return [];
    const payload = (await res.json()) as { data?: BalldontliePlayer[] };
    return (payload.data ?? []).map((p): PlayerLookupMatch => {
      const name = `${p.first_name} ${p.last_name}`.trim();
      const source = balldontliePlayerUrl(p.id);
      const team = p.team?.full_name ?? p.team?.abbreviation ?? "";
      const subtitle = [p.position && `NBA ${p.position}`, team].filter(Boolean).join(" · ");
      return {
        id: `bdl-${p.id}`,
        name,
        subtitle: subtitle || "NBA player",
        providers: ["balldontlie"],
        fields: {
          name: { value: name, source, provider: "balldontlie" },
          heightWeight: formatHeightWeight(p.height, p.weight)
            ? { value: formatHeightWeight(p.height, p.weight), source, provider: "balldontlie" }
            : undefined,
          nationality: p.country
            ? { value: p.country, source, provider: "balldontlie" }
            : undefined,
        },
      };
    });
  } catch {
    return [];
  }
}

/* --------------------------- wikipedia ------------------------------ */

interface WikipediaSummary {
  type?: string;
  title?: string;
  description?: string;
  extract?: string;
  thumbnail?: { source?: string };
  originalimage?: { source?: string };
  content_urls?: { desktop?: { page?: string } };
  wikibase_item?: string; // Q-id
}

async function fetchWikipediaSummary(title: string): Promise<WikipediaSummary | null> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title).replace(/%20/g, "_")}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "RICON Onboarding (research@ricon.local)",
      },
      // 6s cache for repeat queries in dev
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as WikipediaSummary;
  } catch {
    return null;
  }
}

async function searchWikipediaTitles(query: string): Promise<string[]> {
  const url = new URL("https://en.wikipedia.org/w/rest.php/v1/search/page");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "5");
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "RICON Onboarding (research@ricon.local)" },
    });
    if (!res.ok) return [];
    const payload = (await res.json()) as {
      pages?: Array<{ key?: string; title?: string }>;
    };
    return (payload.pages ?? [])
      .map((p) => p.key || p.title || "")
      .filter(Boolean);
  } catch {
    return [];
  }
}

/* --------------------------- wikidata ------------------------------- */

interface WikidataClaimValue {
  mainsnak?: {
    datavalue?: {
      value?: unknown;
      type?: string;
    };
  };
}

interface WikidataEntity {
  labels?: Record<string, { value?: string }>;
  claims?: Record<string, WikidataClaimValue[]>;
}

function getTimeClaim(entity: WikidataEntity, prop: string): string | null {
  const claim = entity.claims?.[prop]?.[0]?.mainsnak?.datavalue?.value as
    | { time?: string }
    | undefined;
  if (!claim?.time) return null;
  // Format: "+1973-03-23T00:00:00Z"
  const match = claim.time.match(/^[+-](\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function getEntityIdClaim(entity: WikidataEntity, prop: string): string | null {
  const claim = entity.claims?.[prop]?.[0]?.mainsnak?.datavalue?.value as
    | { id?: string }
    | undefined;
  return claim?.id ?? null;
}

function getStringClaim(entity: WikidataEntity, prop: string): string | null {
  const v = entity.claims?.[prop]?.[0]?.mainsnak?.datavalue?.value;
  if (typeof v === "string") return v;
  return null;
}

async function fetchWikidataEntity(qid: string): Promise<WikidataEntity | null> {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "RICON Onboarding (research@ricon.local)" },
    });
    if (!res.ok) return null;
    const payload = (await res.json()) as { entities?: Record<string, WikidataEntity> };
    return payload.entities?.[qid] ?? null;
  } catch {
    return null;
  }
}

async function fetchWikidataLabels(qids: string[]): Promise<Record<string, string>> {
  if (qids.length === 0) return {};
  const url = new URL("https://www.wikidata.org/w/api.php");
  url.searchParams.set("action", "wbgetentities");
  url.searchParams.set("ids", qids.join("|"));
  url.searchParams.set("props", "labels");
  url.searchParams.set("languages", "en");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "RICON Onboarding (research@ricon.local)" },
    });
    if (!res.ok) return {};
    const payload = (await res.json()) as {
      entities?: Record<string, { labels?: { en?: { value?: string } } }>;
    };
    const out: Record<string, string> = {};
    for (const id of qids) {
      const v = payload.entities?.[id]?.labels?.en?.value;
      if (v) out[id] = v;
    }
    return out;
  } catch {
    return {};
  }
}

/* --------------------------- merge ---------------------------------- */

async function buildWikipediaMatch(title: string): Promise<PlayerLookupMatch | null> {
  const summary = await fetchWikipediaSummary(title);
  if (!summary || summary.type === "disambiguation") return null;

  const pageUrl =
    summary.content_urls?.desktop?.page ??
    `https://en.wikipedia.org/wiki/${encodeURIComponent(title).replace(/%20/g, "_")}`;

  const fields: PlayerLookupMatch["fields"] = {};

  if (summary.title) {
    fields.name = { value: summary.title, source: pageUrl, provider: "wikipedia" };
  }
  if (summary.extract) {
    // Trim to first 2 sentences for the profile preview.
    const firstTwo = summary.extract.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ");
    fields.biographyExcerpt = { value: firstTwo, source: pageUrl, provider: "wikipedia" };
  }
  const image = summary.originalimage?.source ?? summary.thumbnail?.source;
  if (image) {
    fields.profileImage = { value: image, source: pageUrl, provider: "wikipedia" };
  }

  // Wikidata enrichment — DOB, place of birth, citizenship
  if (summary.wikibase_item) {
    const qid = summary.wikibase_item;
    const entity = await fetchWikidataEntity(qid);
    if (entity) {
      const dob = getTimeClaim(entity, "P569");
      if (dob) {
        fields.dateOfBirth = {
          value: dob,
          source: `https://www.wikidata.org/wiki/${qid}`,
          provider: "wikipedia",
        };
      }
      const pobQid = getEntityIdClaim(entity, "P19");
      const citQid = getEntityIdClaim(entity, "P27");
      const labels = await fetchWikidataLabels([pobQid, citQid].filter(Boolean) as string[]);
      if (pobQid && labels[pobQid]) {
        fields.placeOfBirth = {
          value: labels[pobQid]!,
          source: `https://www.wikidata.org/wiki/${qid}`,
          provider: "wikipedia",
        };
      }
      if (citQid && labels[citQid]) {
        fields.nationality ??= {
          value: labels[citQid]!,
          source: `https://www.wikidata.org/wiki/${qid}`,
          provider: "wikipedia",
        };
      }
      const legal = getStringClaim(entity, "P1559");
      if (legal) {
        fields.legalName = {
          value: legal,
          source: `https://www.wikidata.org/wiki/${qid}`,
          provider: "wikipedia",
        };
      }
    }
  }

  const name = fields.name?.value ?? title;
  return {
    id: `wiki-${title}`,
    name,
    subtitle: summary.description || "Wikipedia article",
    thumbnail: summary.thumbnail?.source,
    providers: ["wikipedia"],
    fields,
  };
}

/** Merge a balldontlie match with a wikipedia match when the names align. */
function mergeMatches(primary: PlayerLookupMatch, extra: PlayerLookupMatch): PlayerLookupMatch {
  const fields = { ...primary.fields };
  for (const key of Object.keys(extra.fields) as Array<keyof PlayerLookupMatch["fields"]>) {
    if (!fields[key]) fields[key] = extra.fields[key];
  }
  return {
    ...primary,
    providers: Array.from(new Set([...primary.providers, ...extra.providers])),
    thumbnail: primary.thumbnail ?? extra.thumbnail,
    subtitle: primary.subtitle || extra.subtitle,
    fields,
  };
}

function sameName(a: string, b: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z\s]/g, "").trim();
  return norm(a) === norm(b);
}

/* --------------------------- entry ---------------------------------- */

export async function lookupPlayer(query: string): Promise<PlayerLookupMatch[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const [bdlMatches, wikiTitles] = await Promise.all([
    searchBalldontlie(q),
    searchWikipediaTitles(q),
  ]);

  // Build Wikipedia matches in parallel (limit to 3 for latency)
  const wikiMatches = (
    await Promise.all(wikiTitles.slice(0, 3).map(buildWikipediaMatch))
  ).filter((m): m is PlayerLookupMatch => m !== null);

  // Merge Wikipedia detail into matching balldontlie rows
  const merged: PlayerLookupMatch[] = bdlMatches.map((bdl) => {
    const wiki = wikiMatches.find((w) => sameName(w.name, bdl.name));
    return wiki ? mergeMatches(bdl, wiki) : bdl;
  });

  // Add wiki-only matches that didn't merge
  for (const wiki of wikiMatches) {
    if (!merged.some((m) => sameName(m.name, wiki.name))) merged.push(wiki);
  }

  return merged.slice(0, 8);
}
