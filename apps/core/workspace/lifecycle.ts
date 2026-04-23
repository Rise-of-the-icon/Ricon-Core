import type { ProfileStatus, ResearchProfile } from "./types";

export function applyLifecycleState(
  profile: ResearchProfile,
  status: ProfileStatus,
): ResearchProfile {
  return {
    ...profile,
    achievements: profile.achievements.map((item) => ({ ...item, state: status })),
    aliases: { ...profile.aliases, state: status },
    biographyExcerpt: { ...profile.biographyExcerpt, state: status },
    brandIdentity: {
      approvedColorPalette: { ...profile.brandIdentity.approvedColorPalette, state: status },
      approvedTaglines: { ...profile.brandIdentity.approvedTaglines, state: status },
      brandGuidelinesUrl: { ...profile.brandIdentity.brandGuidelinesUrl, state: status },
      digitalSignatureUrl: { ...profile.brandIdentity.digitalSignatureUrl, state: status },
      merchandiseCategoriesApproved: {
        ...profile.brandIdentity.merchandiseCategoriesApproved,
        state: status,
      },
      nilAgreementReference: { ...profile.brandIdentity.nilAgreementReference, state: status },
      personalLogoUrl: { ...profile.brandIdentity.personalLogoUrl, state: status },
    },
    careerTimeline: profile.careerTimeline.map((item) => ({ ...item, state: status })),
    dateOfBirth: { ...profile.dateOfBirth, state: status },
    heightWeight: { ...profile.heightWeight, state: status },
    heritage: { ...profile.heritage, state: status },
    legalName: { ...profile.legalName, state: status },
    media: profile.media.map((item) => ({ ...item, state: status })),
    name: { ...profile.name, state: status },
    nationality: { ...profile.nationality, state: status },
    personalHistory: profile.personalHistory.map((item) => ({ ...item, state: status })),
    placeOfBirth: { ...profile.placeOfBirth, state: status },
    profileImage: { ...profile.profileImage, state: status },
    quotes: profile.quotes.map((item) => ({ ...item, state: status })),
    slug: { ...profile.slug, state: status },
    stats: profile.stats.map((item) => ({ ...item, state: status })),
    status,
  };
}
