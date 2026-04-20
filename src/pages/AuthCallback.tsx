import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getPostAuthDestination, getSafeNextPath } from "@/lib/auth";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const url = new URL(window.location.href);
    const requireAdmin = url.searchParams.get("admin") === "1";
    const nextPath = getSafeNextPath(url.searchParams.get("next"));

    const redirectByRole = async (userId: string) => {
      try {
        const destination = await getPostAuthDestination(userId, {
          fallbackPath: nextPath,
          requireAdmin,
        });

        if (!mounted) {
          return;
        }

        navigate(destination, { replace: true });
      } catch (error) {
        await supabase.auth.signOut();

        if (!mounted) {
          return;
        }

        toast.error(error instanceof Error ? error.message : "Sign-in failed. Please try again.");
        navigate(requireAdmin ? "/admin/login" : "/login", { replace: true });
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setTimeout(() => redirectByRole(session.user.id), 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        redirectByRole(session.user.id);
      } else {
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: s } }) => {
            if (!mounted) {
              return;
            }

            if (s?.user) {
              redirectByRole(s.user.id);
            } else {
              toast.error("Sign-in failed. Please try again.");
              navigate(requireAdmin ? "/admin/login" : "/login", { replace: true });
            }
          });
        }, 1500);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Completing sign-in...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
