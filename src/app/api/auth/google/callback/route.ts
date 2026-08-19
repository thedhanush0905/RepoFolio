import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { setSessionCookie } from "@/lib/session";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const savedState = request.cookies.get("google_oauth_state")?.value;

  // CSRF validation check
  if (!state || !savedState || state !== savedState) {
    return NextResponse.json({ error: "Invalid OAuth state." }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: "Authorization code missing." }, { status: 400 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  try {
    // 1. Exchange auth code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId || "",
        client_secret: clientSecret || "",
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri || "",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.json(
        { error: tokenData.error_description || tokenData.error },
        { status: 400 }
      );
    }

    const { access_token } = tokenData;

    // 2. Fetch the verified Google profile
    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userinfoResponse.ok) {
      return NextResponse.json({ error: "Failed to retrieve Google profile info." }, { status: 400 });
    }

    const googleUser = await userinfoResponse.json();
    const { sub: googleId, email, name, picture } = googleUser;

    if (!email) {
      return NextResponse.json({ error: "Google account does not expose email address." }, { status: 400 });
    }

    await connectToDatabase();

    // 3. Find or create user
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user already exists by email and link the account
      user = await User.findOne({ email: email.toLowerCase().trim() });
      if (user) {
        user.googleId = googleId;
        if (!user.avatarUrl) {
          user.avatarUrl = picture;
        }
        await user.save();
      } else {
        // Create new Google user
        user = await User.create({
          name: name || "Google User",
          email: email.toLowerCase().trim(),
          googleId,
          avatarUrl: picture,
        });
      }
    }

    // Redirect to dashboard
    const response = NextResponse.redirect(new URL("/dashboard", request.url));

    // Clear Google OAuth state cookie
    response.cookies.set("google_oauth_state", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    // Set Repofolio session cookie
    await setSessionCookie(response, user._id.toString());

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: "Google login failed: " + err.message }, { status: 500 });
  }
}
