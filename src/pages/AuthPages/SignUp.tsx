import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Create account — AegisHub"
        description="Create your free AegisHub health accessibility account."
      />
      <AuthLayout
        image="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=1200&q=85&fit=crop&auto=format"
        quote="Join AegisHub and break down communication barriers in healthcare."
        quoteAuthor="AegisHub"
      >
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
