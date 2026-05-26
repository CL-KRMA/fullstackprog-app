"use client";

import React, { useEffect, useState } from "react";
import ImageDetail, { Image } from "./ImageDetail";

const ImageList: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  // Récupérer les images depuis l'API Next.js
  useEffect(() => {
    fetch("/api/images")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erreur API: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Image[]) => setImages(data))
      .catch((err) => {
        console.error("Erreur lors du chargement des images :", err);
        setImages([]);
      });
  }, []);

  // Mettre à jour une image
  const handleUpdate = async (id: string, editData: Omit<Image, "_id">) => {
    const response = await fetch(`/api/images/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    if (response.ok) {
      const updated = await response.json();
      setImages((prev) =>
        prev.map((img) => (img._id === id ? { ...img, ...editData } : img))
      );
      setSelectedImage(null);
      alert("Image modifiée avec succès!");
    } else if (response.status === 401) {
      alert("⛔ Vous devez être connecté pour modifier une image");
    } else {
      alert("Erreur lors de la modification de l'image");
    }
  };

  // Supprimer une image
  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image?")) {
      return;
    }

    const response = await fetch(`/api/images/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setImages((prev) => prev.filter((img) => img._id !== id));
      setSelectedImage(null);
      alert("Image supprimée avec succès!");
    } else if (response.status === 401) {
      alert("⛔ Vous devez être connecté pour supprimer une image");
    } else {
      alert("Erreur lors de la suppression de l'image");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h2>Liste des images</h2>

      {!selectedImage ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {images.map((img) => (
            <div
              key={img._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => setSelectedImage(img)}
            >
              <h3>{img.name}</h3>
              <img
                src={img.imageUrl}
                alt={img.name}
                style={{ width: "100%", borderRadius: "6px" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <ImageDetail
          image={selectedImage}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onCancel={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default ImageList;
