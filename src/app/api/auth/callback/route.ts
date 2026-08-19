import { NextRequest, NextResponse } from "next/server";

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

    // Redirect user back to the builder page
    const response = NextResponse.redirect(new URL("/create", request.url));

    // Set secure HTTP-only access token session cookie
    response.cookies.set("gh_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Delete the OAuth state cookie from the same response
    response.cookies.set("oauth_state", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: "Token exchange failed: " + err.message }, { status: 500 });
  }
}
