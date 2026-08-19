import { NextResponse } from "next/server";
import { deleteSessionCookie } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ success: true });
  deleteSessionCookie(response);
  // Also clear any legacy github cookie if set
  response.cookies.set("gh_token", "", { path: "/", maxAge: 0 });
  return response;
}
