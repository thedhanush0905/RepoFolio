import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import { getSessionUserId } from "@/lib/session";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();
    // Retrieve user's portfolios sorted by updatedAt DESC (efficiently queried using our index)
    const portfolios = await Portfolio.find({ userId }).sort({ updatedAt: -1 });

    return NextResponse.json({ success: true, portfolios });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch portfolios: " + err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { name, template, data } = await request.json();

    if (!name || !template || !data) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await connectToDatabase();
    const portfolio = await Portfolio.create({
      userId,
      name,
      template,
      data,
      status: "draft",
    });

    return NextResponse.json({ success: true, portfolio });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to create portfolio: " + err.message }, { status: 500 });
  }
}
