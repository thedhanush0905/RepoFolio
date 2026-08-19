import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getSessionUserId } from "@/lib/session";
import { encrypt } from "@/lib/encryption";
import { getAuthenticatedGitHubUser } from "@/lib/github-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const savedState = request.cookies.get("oauth_state")?.value;

  // CSRF validation check
  if (!state || !savedState || state !== savedState) {
    return NextResponse.json({ error: "Invalid OAuth state." }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: "Authorization code missing." }, { status: 400 });
  }

  const userId = await getSessionUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri = process.env.GITHUB_REDIRECT_URI;

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error_description || tokenData.error }, { status: 400 });
    }

    const accessToken = tokenData.access_token;
    if (!accessToken) {
      return NextResponse.json({ error: "Access token not returned from GitHub." }, { status: 400 });
    }

    // Fetch GitHub details to get the username/login
    const githubUser = await getAuthenticatedGitHubUser(accessToken);
    if (!githubUser) {
      return NextResponse.json({ error: "Failed to authenticate GitHub connection." }, { status: 401 });
    }

    await connectToDatabase();
    
    // Encrypt the token and save it to the current user
    const encryptedToken = encrypt(accessToken);
    await User.findByIdAndUpdate(userId, {
      githubToken: encryptedToken,
      githubUsername: githubUser.login,
    });

    // Redirect user back to the builder page
    const response = NextResponse.redirect(new URL("/create", request.url));

    // Clear the OAuth state cookie
    response.cookies.set("oauth_state", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    // For backward compatibility, also keep the cookie for the current session
    response.cookies.set("gh_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: "Token exchange failed: " + err.message }, { status: 500 });
  }
}
