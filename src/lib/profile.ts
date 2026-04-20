import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AppProfile = Database["public"]["Tables"]["profiles"]["Row"];
type AppProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

const getDisplayName = (user: User) => {
  const metadata = user.user_metadata ?? {};
  const fullName = metadata.full_name || metadata.name;
  const firstName = metadata.first_name;
  const lastName = metadata.last_name;

  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim();
  }

  const joinedName = [firstName, lastName]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .join(" ")
    .trim();

  if (joinedName) {
    return joinedName;
  }

  return user.email?.split("@")[0] ?? null;
};

const getAvatarUrl = (user: User) => {
  const metadata = user.user_metadata ?? {};
  const avatarUrl = metadata.avatar_url || metadata.picture;

  return typeof avatarUrl === "string" && avatarUrl.trim() ? avatarUrl : null;
};

const getProfileSeed = (user: User): AppProfileInsert => ({
  id: user.id,
  email: user.email ?? null,
  full_name: getDisplayName(user),
  phone: null,
  avatar_url: getAvatarUrl(user),
  shipping_address: null,
  updated_at: new Date().toISOString(),
});

export const createFallbackProfile = (user: User): AppProfile => ({
  ...getProfileSeed(user),
  created_at: new Date().toISOString(),
});

export const upsertUserProfile = async (
  user: User,
  updates: Partial<AppProfileInsert> = {},
) => {
  const payload: AppProfileInsert = {
    ...getProfileSeed(user),
    ...updates,
    id: user.id,
    email: updates.email ?? user.email ?? null,
    updated_at: updates.updated_at ?? new Date().toISOString(),
  };

  return supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .maybeSingle();
};

export const loadUserProfile = async (user: User) => {
  const fallbackProfile = createFallbackProfile(user);

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (data) {
    return { profile: data as AppProfile, degraded: false };
  }

  if (error) {
    console.error("Failed to load profile", error);
  }

  const { data: repairedProfile, error: repairError } = await upsertUserProfile(user);

  if (repairedProfile) {
    return { profile: repairedProfile as AppProfile, degraded: false };
  }

  if (repairError) {
    console.error("Failed to restore profile row", repairError);
  }

  return { profile: fallbackProfile, degraded: true };
};
