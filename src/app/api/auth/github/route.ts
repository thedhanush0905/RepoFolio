import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI;

  if (!clientId) {
    return NextResponse.json(
      { error: "GITHUB_CLIENT_ID is not configured." },
      { status: 500 }
    );
  }

  // Generate unique cryptographically secure state variable for CSRF protection
  const state = crypto.randomUUID();

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri || ""
  )}&state=${state}&scope=repo,user`;

  const cookieStore = await cookies();
  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });

  return NextResponse.redirect(githubAuthUrl);
}
