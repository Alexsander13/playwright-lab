import type { User } from "@supabase/supabase-js";

export function profileFromAuthUser(user: User) {
  const metadata = user.user_metadata as Record<string, unknown>;
  const githubUsername = [metadata.user_name, metadata.preferred_username].find(
    (value) => typeof value === "string",
  );
  const avatarUrl = metadata.avatar_url;

  return {
    id: user.id,
    github_username:
      typeof githubUsername === "string" ? githubUsername : null,
    avatar_url: typeof avatarUrl === "string" ? avatarUrl : null,
    updated_at: new Date().toISOString(),
  };
}