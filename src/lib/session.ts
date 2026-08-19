import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const AUTH_SECRET = process.env.AUTH_SECRET;

if (!AUTH_SECRET) {
  throw new Error("Please define the AUTH_SECRET environment variable.");
}

const key = new TextEncoder().encode(AUTH_SECRET);
const SESSION_COOKIE_NAME = "session_token";

/**
 * Signs a minimal JWT containing only the userId (sub)
 */
export async function encryptSession(userId: string): Promise<string> {
  return await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

/**
 * Verifies the session JWT and returns the payload if valid
 */
export async function decryptSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

/**
 * Retrieves the currently logged in userId from the session token
 */
export async function getSessionUserId(request?: NextRequest): Promise<string | null> {
  let token: string | undefined;

  if (request) {
    token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  }

  if (!token) return null;

  const payload = await decryptSession(token);
  return (payload?.sub as string) || null;
}

/**
 * Sets the session cookie on a given NextResponse object
 */
export async function setSessionCookie(response: NextResponse, userId: string): Promise<void> {
  const token = await encryptSession(userId);
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Deletes the session cookie from a given NextResponse object
 */
export function deleteSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
