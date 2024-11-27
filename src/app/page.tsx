"use client";
import { getProducts } from "../libs/productService"; // Asegúrate de importar las funciones necesarias
import { useState, useEffect } from "react";
import { Product } from "@/types/product"; // Asegúrate de que la ruta sea correcta
import Header from "@/components/Header";

const Index: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // Definir el tipo del estado como un arreglo de Product

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts(); // Cambia getUsers a getProducts
        setProducts(data); // Asegúrate de que `data` sea del tipo correcto
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
        <h2 className="text-3xl text-black font-bold mb-6">List of Products</h2>
        <ul className="w-full max-w-md">
          {products.map((p) => (
            <li
              key={p.productId}
              className="border p-4 my-2 rounded bg-white shadow-md flex justify-between items-center"
            >
              <span>
                {p.name} - ${p.price}{" "}
                {/* Cambia los campos según tu modelo de producto */}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Index;
