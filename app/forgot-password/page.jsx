import ForgotPasswordPage from "@/src/views/ForgotPasswordPage.jsx";
import PageTracker from "@/src/next/PageTracker.jsx";

export default function ForgotPasswordRoute() {
  return (
    <PageTracker page="forgot-password">
      <ForgotPasswordPage />
    </PageTracker>
  );
}
