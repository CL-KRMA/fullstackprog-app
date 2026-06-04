import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    // Vérifier et décoder le JWT
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json(
      { authenticated: true, userId: decoded.userId, username: decoded.username },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
