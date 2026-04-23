import { createClient } from "@sanity/client";

import { hasSanityEnv } from "./env";
import { normalizeResearchProfile } from "./normalize";
import type { ResearchProfile } from "./types";

function getSanityClient() {
  if (!hasSanityEnv()) {
    return null;
  }

  return createClient({
    projectId: process.env.SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET!,
    apiVersion: "2026-04-03",
    token: process.env.SANITY_API_TOKEN!,
    useCdn: false,
  });
}

function documentId(profileId: string) {
  return `researchProfile.${profileId}`;
}

function toSanityDocument(profile: ResearchProfile) {
  return {
    _id: documentId(profile.id),
    _type: "researchProfile",
    profileId: profile.id,
    researcherId: profile.researcherId,
    researcherEmail: profile.researcherEmail,
    researcherName: profile.researcherName,
    status: profile.status,
    name: profile.name,
    legalName: profile.legalName,
    aliases: profile.aliases,
    dateOfBirth: profile.dateOfBirth,
    placeOfBirth: profile.placeOfBirth,
    nationality: profile.nationality,
    heritage: profile.heritage,
    heightWeight: profile.heightWeight,
    profileImage: profile.profileImage,
    slug: profile.slug,
    biographyExcerpt: profile.biographyExcerpt,
    careerTimeline: profile.careerTimeline.map((item) => ({
      ...item,
      _key: item.id,
    })),
    personalHistory: profile.personalHistory.map((item) => ({
      ...item,
      _key: item.id,
    })),
    stats: profile.stats.map((item) => ({
      ...item,
      _key: item.id,
    })),
    achievements: profile.achievements.map((item) => ({
      ...item,
      _key: item.id,
    })),
    quotes: profile.quotes.map((item) => ({
      ...item,
      _key: item.id,
    })),
    media: profile.media.map((item) => ({
      ...item,
      _key: item.id,
    })),
    brandIdentity: profile.brandIdentity,
    sourceCandidates: profile.sourceCandidates,
    researchPlan: profile.researchPlan,
    coverageGaps: profile.coverageGaps,
    workflowStep: profile.workflowStep,
    sourceGateStatus: profile.sourceGateStatus,
    submittedAt: profile.submittedAt,
    updatedAt: profile.updatedAt,
    lastSavedAt: profile.lastSavedAt,
  };
}

export async function readProfileFromSanity(profileId: string) {
  const client = getSanityClient();

  if (!client) {
    return null;
  }

  const profile = await client.fetch<ResearchProfile | null>(
    `*[_type == "researchProfile" && profileId == $profileId][0]{
      "id": profileId,
      researcherId,
      researcherEmail,
      researcherName,
      name,
      legalName,
      aliases,
      dateOfBirth,
      placeOfBirth,
      nationality,
      heritage,
      heightWeight,
      profileImage,
      slug,
      biographyExcerpt,
      careerTimeline[]{
        "id": coalesce(id, _key),
        title,
        date,
        eventType,
        teamOrganization,
        leagueCompetition,
        description,
        linkedMediaUrl,
        talentApproved,
        claim
      },
      personalHistory[]{
        "id": coalesce(id, _key),
        heading,
        body,
        claim
      },
      stats[]{
        "id": coalesce(id, _key),
        sport,
        label,
        value,
        category,
        dataSource,
        claim
      },
      achievements[]{
        "id": coalesce(id, _key),
        awardName,
        awardingBody,
        year,
        category,
        description,
        talentApproved,
        claim
      },
      quotes[]{
        "id": coalesce(id, _key),
        quoteText,
        context,
        category,
        talentApproved,
        claim
      },
      media[]{
        "id": coalesce(id, _key),
        kind,
        title,
        url,
        usageRights,
        talentApproved,
        claim
      },
      brandIdentity,
      sourceCandidates,
      researchPlan,
      coverageGaps,
      workflowStep,
      sourceGateStatus,
      status,
      submittedAt,
      updatedAt,
      lastSavedAt
    }`,
    { profileId },
  );

  return normalizeResearchProfile(profile);
}

export async function writeProfileToSanity(profile: ResearchProfile) {
  const client = getSanityClient();

  if (!client) {
    return;
  }

  await client.createOrReplace(toSanityDocument(profile));
}
