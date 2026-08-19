import { cookies } from "next/headers";

export async function getGitHubClientToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("gh_token")?.value;
}

export interface GitHubUser {
  login: string;
  avatarUrl: string;
  name: string;
}

export async function getAuthenticatedGitHubUser(token: string): Promise<GitHubUser | null> {
  try {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "repofolio-app",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return {
      login: data.login,
      avatarUrl: data.avatar_url,
      name: data.name || data.login,
    };
  } catch {
    return null;
  }
}
