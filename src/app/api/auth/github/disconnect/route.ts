import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getSessionUserId } from "@/lib/session";

export async function POST() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();
    await User.findByIdAndUpdate(userId, {
      $unset: { githubToken: "", githubUsername: "" },
    });

    const response = NextResponse.json({ success: true });
    // Also clear legacy cookie if present
    response.cookies.set("gh_token", "", { path: "/", maxAge: 0 });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: "Disconnect failed: " + err.message }, { status: 500 });
  }
}
