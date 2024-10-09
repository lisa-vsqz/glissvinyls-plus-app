"use client";
import React, { useState } from "react";
import { createProduct } from "../../../libs/productService"; // Asegúrate de importar la función del servicio para crear productos
import { useRouter } from "next/navigation"; // Importa useRouter de Next.js
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CreateProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState("");
  const router = useRouter(); // Inicializa el hook useRouter
  const [error, setError] = useState<string | null>(null); // Manejar errores

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newProduct = {
      name,
      description,
      price,
      stock,
      image,
    };
    try {
      await createProduct(newProduct); // Llamamos a la función createProduct
      alert("Product created successfully!");
      // Redirigir a la lista de productos después de crear el producto
      router.push("/products"); // Redirección a /products
    } catch (error) {
      setError(error.message); // Mostrar error si falla
      console.error("Failed to create product:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
        <h2 className="text-3xl text-black font-bold mb-6">
          Create New Product
        </h2>
        {error && <p className="text-red-500">{error}</p>}{" "}
        {/* Mostrar error si existe */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
        >
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product Name"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product Description"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="Price"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              placeholder="Stock"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Image URL"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Create Product
          </button>
        </form>
        <Link href="/products" className="mt-4">
          <button className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition">
            Back to Products List
          </button>
        </Link>
      </div>
    </ProtectedRoute>
  );
}
