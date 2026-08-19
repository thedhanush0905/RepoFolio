import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // Set expiration in past to force deletion
  cookieStore.set("session_token", "", { path: "/", maxAge: 0 });
  cookieStore.set("gh_token", "", { path: "/", maxAge: 0 });
  
  return NextResponse.json({ success: true });
}
