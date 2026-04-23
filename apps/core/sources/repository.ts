import { getAllMockProfiles } from "@/apps/core/workspace/mock-store";
import { readAllProfilesFromSupabase } from "@/apps/core/workspace/supabase";
import { hasWorkspaceSupabaseEnv } from "@/apps/core/workspace/env";
import type { ClaimMeta, ResearchProfile } from "@/apps/core/workspace/types";

export interface SourceUsage {
  profileId: string;
  profileName: string;
  fieldPath: string;
}

export interface SourceRecord {
  id: string;
  url: string;
  publication: string;
  type: ClaimMeta["citation"]["sourceType"];
  reliabilityScore: number;
  duplicateCount: number;
  brokenLink: boolean | null;
  usages: SourceUsage[];
}

function normalizeUrl(url: string) {
  return url.trim().toLowerCase();
}

function pushSource(
  usageMap: Map<string, Omit<SourceRecord, "duplicateCount" | "brokenLink">>,
  profile: ResearchProfile,
  fieldPath: string,
  claim: ClaimMeta,
) {
  const normalized = normalizeUrl(claim.citation.url);
  if (!normalized) {
    return;
  }

  const existing = usageMap.get(normalized);
  const usage: SourceUsage = {
    profileId: profile.id,
    profileName: profile.name.value || "Unnamed profile",
    fieldPath,
  };

  if (!existing) {
    usageMap.set(normalized, {
      id: normalized,
      url: claim.citation.url,
      publication: claim.citation.publicationName || "Unknown publication",
      type: claim.citation.sourceType,
      reliabilityScore: claim.reliabilityScore,
      usages: [usage],
    });
    return;
  }

  existing.usages.push(usage);
  existing.reliabilityScore = Math.round((existing.reliabilityScore + claim.reliabilityScore) / 2);
}

function collectProfileSources(profile: ResearchProfile) {
  const usageMap = new Map<string, Omit<SourceRecord, "duplicateCount" | "brokenLink">>();

  pushSource(usageMap, profile, "name", profile.name.claim);
  pushSource(usageMap, profile, "dateOfBirth", profile.dateOfBirth.claim);

  profile.careerTimeline.forEach((item, index) => {
    pushSource(usageMap, profile, `careerTimeline[${index}]`, item.claim);
  });
  profile.personalHistory.forEach((item, index) => {
    pushSource(usageMap, profile, `personalHistory[${index}]`, item.claim);
  });
  profile.stats.forEach((item, index) => {
    pushSource(usageMap, profile, `stats[${index}]`, item.claim);
  });
  profile.media.forEach((item, index) => {
    pushSource(usageMap, profile, `media[${index}]`, item.claim);
  });

  return [...usageMap.values()];
}

async function checkUrlStatus(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const headResponse = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store",
    });

    if (headResponse.ok) {
      return false;
    }

    const getResponse = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store",
    });
    return !getResponse.ok;
  } catch {
    return true;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getSourceCitationDatabase(options?: { checkBrokenLinks?: boolean }) {
  const profiles = hasWorkspaceSupabaseEnv()
    ? await readAllProfilesFromSupabase()
    : getAllMockProfiles();

  const rawSources = profiles.flatMap((profile) => collectProfileSources(profile));
  const grouped = new Map<string, SourceRecord>();

  for (const source of rawSources) {
    const existing = grouped.get(source.id);
    if (!existing) {
      grouped.set(source.id, {
        ...source,
        duplicateCount: source.usages.length,
        brokenLink: null,
      });
      continue;
    }

    existing.usages.push(...source.usages);
    existing.duplicateCount += source.usages.length;
    existing.reliabilityScore = Math.round((existing.reliabilityScore + source.reliabilityScore) / 2);
  }

  const sources = [...grouped.values()].sort((left, right) =>
    right.usages.length - left.usages.length,
  );

  if (options?.checkBrokenLinks) {
    await Promise.all(
      sources.map(async (source) => {
        source.brokenLink = await checkUrlStatus(source.url);
      }),
    );
  }

  return sources;
}
