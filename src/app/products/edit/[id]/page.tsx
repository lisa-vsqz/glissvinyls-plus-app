"use client"; // Asegúrate de que este archivo sea un componente de cliente
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importa desde 'next/navigation' en Next.js 13 y superior
import { getProductById, updateProduct } from "../../../../libs/productService"; // Asegúrate de que la ruta sea correcta
import { Product } from "@/types/product"; // Importa la interfaz Product desde el archivo de tipos
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product>({
    id: "", // Asegúrate de incluir el campo 'id' en el estado inicial
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (params.id) {
        try {
          const fetchedProduct = await getProductById(params.id); // Asegúrate de que la función obtenga el producto por ID
          setProduct(fetchedProduct);
        } catch (error) {
          console.error("Failed to fetch product:", error);
        }
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Intentar actualizar el producto
      await updateProduct(product.id, product);

      // Si no se lanza ninguna excepción, se considera exitoso
      alert("Product updated successfully!"); // Alerta de éxito
      router.push("/products"); // Redirigir a la lista de productos después de la actualización
    } catch (error) {
      console.error("Failed to update product:", error);
      // Mostrar un mensaje de error más detallado
      alert(`Failed to update product: ${(error as Error).message}`); // Alerta de error
      router.push("/products");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
        <h2 className="text-3xl text-black font-bold mb-6">Edit Product</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
        >
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            placeholder="Product Name"
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            placeholder="Product Description"
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: Number(e.target.value) })
            }
            placeholder="Price"
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            value={product.stock}
            onChange={(e) =>
              setProduct({ ...product, stock: Number(e.target.value) })
            }
            placeholder="Stock"
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            value={product.image}
            onChange={(e) => setProduct({ ...product, image: e.target.value })}
            placeholder="Image URL"
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Update Product
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
