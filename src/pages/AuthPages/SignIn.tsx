import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign in — AegisHub"
        description="Sign in to your AegisHub health accessibility account."
      />
      <AuthLayout
        image="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=85&fit=crop&auto=format"
        quote="Sign in and continue making healthcare more accessible."
        quoteAuthor="AegisHub"
      >
        <SignInForm />
      </AuthLayout>
    </>
  );
}
