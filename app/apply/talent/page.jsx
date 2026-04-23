import LeadCapturePage from "@/src/views/LeadCapturePage.jsx";
import PageTracker from "@/src/next/PageTracker.jsx";

export default function TalentApplyRoute() {
  return (
    <PageTracker page="talent-apply">
      <LeadCapturePage
        eyebrow="Talent beta wait-list"
        title="Apply as Talent"
        description="Register your interest in joining the RICON verification workflow. We will use your details to coordinate onboarding, biography intake, and review access."
        formTitle="Talent registration"
        submitLabel="Join the beta wait-list"
        audienceLabel="Tell us who you are, which profile you need, and whether you are representing yourself or a team."
        acknowledgement="Thanks. Your talent application has been recorded and we will follow up with next-step onboarding details."
      />
    </PageTracker>
  );
}
