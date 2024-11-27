"use client";
import React, { useState, useEffect } from "react";
import { createProduct } from "../../../libs/productService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getCategories } from "../../../libs/categoryService"; // Importa la función para obtener categorías
import { Category } from "@/types/category";

export default function CreateProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">(""); // Estado para CategoryId
  const [categories, setCategories] = useState<Category[]>([]); // Estado para almacenar las categorías
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Obtener las categorías al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(); // Función para obtener las categorías desde la API
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar que se ha seleccionado una categoría
    if (categoryId === "") {
      setError("Please select a category");
      return;
    }

    const newProduct = {
      name,
      description,
      price,
      stock,
      image,
      categoryId: Number(categoryId), // Convertir a número
    };

    try {
      await createProduct(newProduct);
      alert("Product created successfully!");
      router.push("/products");
    } catch (error) {
      setError((error as Error).message);
      console.error("Failed to create product:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
        <h2 className="text-3xl text-black font-bold mb-6">
          Crear Nuevo Producto
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
        >
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del Producto"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del Producto"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="Precio"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
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
              min="0"
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="URL de la Imagen"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <select
              value={categoryId}
              onChange={(e) =>
                setCategoryId(
                  e.target.value !== "" ? Number(e.target.value) : ""
                )
              }
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Selecciona una Categoría
              </option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Crear Producto
          </button>
        </form>
        <Link href="/products" className="mt-4">
          <button className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition">
            Volver a la Lista de Productos
          </button>
        </Link>
      </div>
    </ProtectedRoute>
  );
}
