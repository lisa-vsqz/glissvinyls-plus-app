"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById, updateProduct } from "../../../../libs/productService";
import { Product } from "@/types/product";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState<Product>({
    productId: "",
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: "",
    categoryId: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const fetchedProduct = await getProductById(id);
          setProduct(fetchedProduct);
        } catch (error) {
          console.error("Failed to fetch product:", error);
        }
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateProduct(product.productId, product);
      alert("Product updated successfully!");
      router.push("/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert(`Failed to update product: ${(error as Error).message}`);
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
