import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/mysql";
import { verifyPassword, generateToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  const connection = await pool.getConnection();
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username et password requis" },
        { status: 400 }
      );
    }

    // Chercher l'utilisateur dans la base de données
    const [users] = await connection.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if ((users as any[]).length === 0) {
      return NextResponse.json(
        { error: "Utilisateur ou password invalide" },
        { status: 401 }
      );
    }

    const user = (users as any[])[0];

    // Vérifier le password
    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Utilisateur ou password invalide" },
        { status: 401 }
      );
    }

    // Générer un JWT token
    const token = generateToken(user.id.toString(), user.username);

    const response = NextResponse.json(
      { message: "Connecté avec succès", token, userId: user.id },
      { status: 200 }
    );

    // Stocker le token dans un cookie HTTP-only
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return response;
  } catch (error) {
    console.error("Erreur login:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    connection.release();
  }
}
