"use client";
import { getProducts, deleteProduct } from "../../libs/productService"; // Asegúrate de importar deleteProduct
import { useState, useEffect } from "react";
import { Product } from "@/types/product"; // Asegúrate de que la ruta sea correcta
import Link from "next/link"; // Importar el componente Link de Next.js
import { useRouter } from "next/navigation"; // Importar useRouter para redireccionar
import { logout } from "../../libs/authService"; // Importar la función logout
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const Index: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // Definir el tipo del estado como un arreglo de Product
  const router = useRouter(); // Inicializar el router

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts(); // Obtener productos
        setProducts(data); // Asegúrate de que `data` sea del tipo correcto
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id); // Llamar a la función para eliminar el producto
      setProducts(products.filter((product) => product.id !== id)); // Actualizar la lista de productos
      alert("Product deleted successfully!"); // Mostrar alerta de eliminación exitosa
    } catch (error) {
      console.error("Error deleting product:", error);
      // Mostrar un mensaje de error más detallado
      alert(`Failed to delete product: ${(error as Error).message}`); // Mostrar alerta si falla la eliminación
    }
  };

  const handleLogout = () => {
    logout(); // Llama a la función logout
    router.replace("/"); // Redirige al usuario a la página de inicio de sesión
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
        <h2 className="text-3xl text-black font-bold mb-6">List of Products</h2>

        {/* Botón de cerrar sesión */}
        <button
          onClick={handleLogout}
          className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>

        <Link href="/products/create">
          <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Create Product
          </button>
        </Link>

        <ul className="w-full max-w-md">
          {products.map((p) => (
            <li
              key={p.id}
              className="border p-4 my-2 rounded bg-white shadow-md flex justify-between items-center"
            >
              <span>
                {p.name} - ${p.price}{" "}
                {/* Asegúrate de que los campos coincidan con tu modelo de producto */}
              </span>
              <div className="flex space-x-2">
                {/* Botón de editar */}
                <Link href={`/products/edit/${p.id}`}>
                  <button className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                    Edit
                  </button>
                </Link>

                {/* Botón de eliminar */}
                <button
                  onClick={() => handleDeleteProduct(p.id)} // Llamar a la función handleDeleteProduct
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ProtectedRoute>
  );
};

export default Index;
