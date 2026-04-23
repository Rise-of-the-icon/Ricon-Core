export const researchProfileSchema = {
  name: "researchProfile",
  title: "Research Profile",
  type: "document",
  fields: [
    { name: "profileId", title: "Profile ID", type: "string" },
    { name: "researcherId", title: "Researcher ID", type: "string" },
    { name: "researcherName", title: "Researcher Name", type: "string" },
    { name: "researcherEmail", title: "Researcher Email", type: "string" },
    { name: "status", title: "Status", type: "string" },
    { name: "name", title: "Name", type: "object" },
    { name: "dateOfBirth", title: "Date of Birth", type: "object" },
    { name: "careerTimeline", title: "Career Timeline", type: "array", of: [{ type: "object" }] },
    { name: "personalHistory", title: "Personal History", type: "array", of: [{ type: "object" }] },
    { name: "stats", title: "Stats", type: "array", of: [{ type: "object" }] },
    { name: "media", title: "Media", type: "array", of: [{ type: "object" }] },
    { name: "sourceCandidates", title: "Source Candidates", type: "array", of: [{ type: "object" }] },
    { name: "researchPlan", title: "Research Plan", type: "array", of: [{ type: "object" }] },
    { name: "coverageGaps", title: "Coverage Gaps", type: "array", of: [{ type: "object" }] },
    { name: "workflowStep", title: "Workflow Step", type: "string" },
    { name: "sourceGateStatus", title: "Source Gate Status", type: "string" },
    { name: "submittedAt", title: "Submitted At", type: "datetime" },
    { name: "updatedAt", title: "Updated At", type: "datetime" },
    { name: "lastSavedAt", title: "Last Saved At", type: "datetime" },
  ],
};

export const workspaceSchemas = [researchProfileSchema];
