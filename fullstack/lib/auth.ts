import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./jwt";

export function isAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return false;

  const decoded = verifyToken(token);
  return !!decoded;
}

export function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get("auth-token")?.value || null;
}

export function getUserFromToken(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return null;

  return verifyToken(token);
}

export function createUnauthorizedResponse(message: string = "Non authentifié") {
  return NextResponse.json({ error: message }, { status: 401 });
}
