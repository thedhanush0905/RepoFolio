import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getSessionUserId } from "@/lib/session";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json(
        { authenticated: false },
        { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
      );
    }

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          githubConnected: !!user.githubToken,
          githubUsername: user.githubUsername || null,
        },
      },
      { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      {
        status: 500,
        headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
      }
    );
  }
}
