import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AuthForm from "@/components/auth/AuthForm";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/AuthContext";
import { getSafeNextPath } from "@/lib/auth";

interface AuthPageProps {
  requireAdmin?: boolean;
}

const AuthPage = ({ requireAdmin = false }: AuthPageProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const nextPath = getSafeNextPath(searchParams.get("next"));

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    if (requireAdmin && !isAdmin) {
      navigate("/account", { replace: true });
      return;
    }

    navigate(nextPath || (isAdmin ? "/admin" : "/account"), { replace: true });
  }, [isAdmin, loading, navigate, nextPath, requireAdmin, user]);

  return (
    <div className="min-h-screen bg-secondary/30">
      <Header />
      <main className="container mx-auto flex min-h-[calc(100vh-220px)] items-center justify-center px-4 py-12">
        {loading ? (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Checking your session...
          </div>
        ) : (
          <div className="w-full max-w-[420px] overflow-hidden rounded-lg border border-border bg-background shadow-sm">
            <AuthForm requireAdmin={requireAdmin} nextPath={nextPath} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AuthPage;
