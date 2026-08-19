import { cookies } from "next/headers";
import { getSessionUserId } from "./session";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import { decrypt } from "./encryption";

export async function getGitHubClientToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("gh_token")?.value;
  if (cookieToken) return cookieToken;

  const userId = await getSessionUserId();
  if (!userId) return undefined;

  await connectToDatabase();
  const user = await User.findById(userId);
  if (user && user.githubToken) {
    try {
      return decrypt(user.githubToken);
    } catch {
      return undefined;
    }
  }

  return undefined;
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
