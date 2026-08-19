import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    });

    const response = NextResponse.json({ success: true, user: { name: newUser.name, email: newUser.email } });
    await setSessionCookie(response, newUser._id.toString());
    
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: "Signup failed: " + err.message }, { status: 500 });
  }
}
