import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "repofolio-app",
      },
    });

    if (!userResponse.ok) {
      // Token is likely invalid or expired, clear it
      cookieStore.delete("gh_token");
      return NextResponse.json({ authenticated: false });
    }

    const userData = await userResponse.json();
    return NextResponse.json({
      authenticated: true,
      user: {
        login: userData.login,
        avatarUrl: userData.avatar_url,
        name: userData.name,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}
