import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.passwordHash) {
      // Safe error message
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isMatch = await bcryptjs.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
    await setSessionCookie(response, user._id.toString());
    
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: "Login failed: " + err.message }, { status: 500 });
  }
}
