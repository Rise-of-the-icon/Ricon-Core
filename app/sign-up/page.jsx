import SignUpPage from "@/src/views/SignUpPage.jsx";
import PageTracker from "@/src/next/PageTracker.jsx";

export default function SignUpRoute() {
  return (
    <PageTracker page="sign-up">
      <SignUpPage />
    </PageTracker>
  );
}
