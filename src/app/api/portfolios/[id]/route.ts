import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import { getSessionUserId } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();
    const portfolio = await Portfolio.findById(id);

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found." }, { status: 404 });
    }

    // Authorization check
    if (portfolio.userId.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    return NextResponse.json({ success: true, portfolio });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch portfolio: " + err.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { name, template, data, status, repoUrl, repoFullName } = await request.json();

    await connectToDatabase();
    const portfolio = await Portfolio.findById(id);

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found." }, { status: 404 });
    }

    // Authorization check
    if (portfolio.userId.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    // Update fields if provided
    if (name !== undefined) portfolio.name = name;
    if (template !== undefined) portfolio.template = template;
    if (data !== undefined) portfolio.data = data;
    if (status !== undefined) portfolio.status = status;
    if (repoUrl !== undefined) portfolio.repoUrl = repoUrl;
    if (repoFullName !== undefined) portfolio.repoFullName = repoFullName;

    await portfolio.save();

    return NextResponse.json({ success: true, portfolio });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update portfolio: " + err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();
    const portfolio = await Portfolio.findById(id);

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found." }, { status: 404 });
    }

    // Authorization check
    if (portfolio.userId.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    await Portfolio.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Portfolio deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete portfolio: " + err.message }, { status: 500 });
  }
}
