import type { ClaimMeta, FieldClaim, ResearchProfile } from "./types";

export interface VerificationIssue {
  message: string;
  path: string;
  severity: "blocking" | "warning";
}

function isCitationComplete(citation: ClaimMeta["citation"]) {
  return Boolean(
    citation.url.trim() &&
      citation.publicationName.trim() &&
      citation.dateAccessed.trim(),
  );
}

function sourceCount(claim: ClaimMeta) {
  const primary = isCitationComplete(claim.citation) ? 1 : 0;
  const extra = claim.additionalSources.filter(isCitationComplete).length;
  return primary + extra;
}

function validateClaim(claim: ClaimMeta, path: string): VerificationIssue[] {
  const issues: VerificationIssue[] = [];
  const count = sourceCount(claim);

  if (count === 0) {
    issues.push({
      path,
      severity: "blocking",
      message: "Insufficient verification: no sources attached.",
    });
  } else if (count < 2) {
    issues.push({
      path,
      severity: "blocking",
      message: "Insufficient verification: minimum 2 sources per claim.",
    });
  }

  if (claim.reliabilityScore <= 2) {
    issues.push({
      path,
      severity: "warning",
      message: "Low-quality source confidence detected.",
    });
  }

  return issues;
}

export function validateProfileVerification(profile: ResearchProfile) {
  const issues: VerificationIssue[] = [];
  const validateFieldIfPresent = (field: FieldClaim<string>, path: string) => {
    if (field.value.trim()) {
      issues.push(...validateClaim(field.claim, path));
    }
  };

  issues.push(...validateClaim(profile.name.claim, "name"));
  validateFieldIfPresent(profile.legalName, "legalName");
  validateFieldIfPresent(profile.aliases, "aliases");
  issues.push(...validateClaim(profile.dateOfBirth.claim, "dateOfBirth"));
  validateFieldIfPresent(profile.placeOfBirth, "placeOfBirth");
  validateFieldIfPresent(profile.nationality, "nationality");
  validateFieldIfPresent(profile.heritage, "heritage");
  validateFieldIfPresent(profile.heightWeight, "heightWeight");
  validateFieldIfPresent(profile.profileImage, "profileImage");
  validateFieldIfPresent(profile.slug, "slug");
  validateFieldIfPresent(profile.biographyExcerpt, "biographyExcerpt");

  profile.careerTimeline.forEach((item, index) => {
    issues.push(...validateClaim(item.claim, `careerTimeline[${index}]`));
  });
  profile.personalHistory.forEach((item, index) => {
    issues.push(...validateClaim(item.claim, `personalHistory[${index}]`));
  });
  profile.stats.forEach((item, index) => {
    issues.push(...validateClaim(item.claim, `stats[${index}]`));
  });
  profile.achievements.forEach((item, index) => {
    issues.push(...validateClaim(item.claim, `achievements[${index}]`));
  });
  profile.quotes.forEach((item, index) => {
    if (item.quoteText.trim()) {
      issues.push(...validateClaim(item.claim, `quotes[${index}]`));
    }
  });
  profile.media.forEach((item, index) => {
    issues.push(...validateClaim(item.claim, `media[${index}]`));
  });
  Object.entries(profile.brandIdentity).forEach(([key, field]) => {
    validateFieldIfPresent(field, `brandIdentity.${key}`);
  });

  return {
    issues,
    blockingIssues: issues.filter((issue) => issue.severity === "blocking"),
    warningIssues: issues.filter((issue) => issue.severity === "warning"),
    isValidForSubmission: issues.every((issue) => issue.severity !== "blocking"),
  };
}

export function getClaimVerificationStatus(claim: ClaimMeta) {
  const count = sourceCount(claim);
  return {
    sourceCount: count,
    hasInsufficientVerification: count < 2,
    hasLowQualitySources: claim.reliabilityScore <= 2,
  };
}
