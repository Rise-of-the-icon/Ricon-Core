import LeadCapturePage from "@/src/views/LeadCapturePage.jsx";
import PageTracker from "@/src/next/PageTracker.jsx";

export default function ApiAccessRoute() {
  return (
    <PageTracker page="api-access">
      <LeadCapturePage
        eyebrow="Developer access"
        title="Get API Access"
        description="Request access to the RICON developer beta. Tell us which resources you need and how you plan to use verified biographical data."
        formTitle="Developer intake"
        submitLabel="Request API access"
        audienceLabel="Describe your application, the endpoints you need, and whether you need sandbox or production access."
        acknowledgement="Thanks. Your API access request is in review and we will respond with onboarding details."
      />
    </PageTracker>
  );
}
