import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/mysql";
import { isAuthenticated, createUnauthorizedResponse } from "@/lib/auth";

type DatabaseMetadata = Record<string, unknown>[];

interface ExecuteResult {
  insertId?: number;
  affectedRows?: number;
}

// 🔹 Modifier une image
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  // ✅ Vérifier l'authentification
  if (!isAuthenticated(req)) {
    return createUnauthorizedResponse("Vous devez être connecté pour modifier une image");
  }

  const connection = await pool.getConnection();
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { name, description, imageUrl } = body;

    const [result] = (await connection.execute(
      "UPDATE images SET name = ?, description = ?, imageUrl = ? WHERE id = ?",
      [name, description, imageUrl, id]
    )) as [ExecuteResult, DatabaseMetadata];

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Image non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ message: "Image modifiée avec succès" });
  } catch (error) {
    console.error("Erreur PUT:", error);
    return NextResponse.json({ error: "Erreur lors de la modification de l'image" }, { status: 500 });
  } finally {
    connection.release();
  }
}

// 🔹 Supprimer une image
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  // ✅ Vérifier l'authentification
  if (!isAuthenticated(req)) {
    return createUnauthorizedResponse("Vous devez être connecté pour supprimer une image");
  }

  const connection = await pool.getConnection();
  try {
    const { id } = await context.params;

    const [result] = (await connection.execute(
      "DELETE FROM images WHERE id = ?",
      [id]
    )) as [ExecuteResult, DatabaseMetadata];

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Image non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ message: "Image supprimée avec succès" });
  } catch (error) {
    console.error("Erreur DELETE:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    connection.release();
  }
}
