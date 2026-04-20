import { supabase } from "@/integrations/supabase/client";

type OAuthProvider = "google" | "apple";

interface PostAuthDestinationOptions {
  fallbackPath?: string | null;
  requireAdmin?: boolean;
}

export const getSafeNextPath = (nextPath: string | null | undefined) => {
  if (!nextPath || !nextPath.startsWith("/")) {
    return null;
  }

  return nextPath;
};

export const hasAdminRole = async (userId: string | null | undefined) => {
  if (!userId) {
    return false;
  }

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (error) {
    console.error("Failed to load admin role", error);
    return false;
  }

  return Boolean(data);
};

export const getPostAuthDestination = async (
  userId: string | null | undefined,
  options: PostAuthDestinationOptions = {},
) => {
  const isAdmin = await hasAdminRole(userId);

  if (options.requireAdmin && !isAdmin) {
    throw new Error("This account does not have admin access.");
  }

  return options.fallbackPath || (isAdmin ? "/admin" : "/account");
};

export const getOAuthRedirectUrl = (params?: Record<string, string | undefined>) => {
  const url = new URL("/auth/callback", window.location.origin);

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

export const signInWithOAuth = async (provider: OAuthProvider, redirectTo: string) => {
  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });
};
