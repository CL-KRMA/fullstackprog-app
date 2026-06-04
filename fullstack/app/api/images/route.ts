import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/mysql";
import { isAuthenticated, createUnauthorizedResponse } from "@/lib/auth";

type DatabaseMetadata = Record<string, unknown>[];

interface ExecuteResult {
  insertId?: number;
  affectedRows?: number;
}

export async function GET() {
  const connection = await pool.getConnection();
  try {
    const [images] = await connection.execute("SELECT * FROM images ORDER BY createdAt DESC");
    return NextResponse.json(images);
  } catch (error) {
    console.error("Erreur MySQL :", error);
    return NextResponse.json({ error: "Erreur serveur lors de la récupération des images" }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function POST(req: NextRequest) {
  // Vérifier l'authentification
  if (!isAuthenticated(req)) {
    return createUnauthorizedResponse("Vous devez être connecté pour ajouter une image");
  }

  const connection = await pool.getConnection();
  try {
    const body = await req.json();
    const { name, description, imageUrl } = body;

    if (!name || !description || !imageUrl) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const [result] = await connection.execute(
      "INSERT INTO images (name, description, imageUrl, createdAt) VALUES (?, ?, ?, NOW())",
      [name, description, imageUrl]
    ) as Promise<[ExecuteResult, DatabaseMetadata]>;

    const insertedId = result.insertId;

    return NextResponse.json({ message: "Image ajoutée", id: insertedId });
  } catch (error) {
    console.error("Erreur MySQL :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    connection.release();
  }
}
