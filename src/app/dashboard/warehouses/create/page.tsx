"use client";

import React, { useState, useEffect } from "react";
import {
  createWarehouse,
  getWarehouses,
} from "../../../../libs/warehouseService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Header from "@/components/Header";
import { Warehouse } from "@/types/warehouse";
import { driver } from "driver.js";

// Asume que Warehouse es un tipo que tienes definido así:
// interface Warehouse {
//   warehouseId: number;
//   warehouseName: string;
//   address: string;
// }

const CreateWarehouse: React.FC = () => {
  const [warehouseName, setWarehouseName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Para almacenar la lista de almacenes existentes
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const router = useRouter();

  const isTutorialActive = localStorage.getItem("tutorialStep") === "activado";

  const startTutorial = () => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ["next", "previous"],
      steps: [
        {
          element: "xd", // Top Rotated Products Panel
          popover: {
            title: "Agrega un nuevo almacén",
            description: "Aquí puedes agregar un nuevo almacén",
          },
        },
        {
          element: "#CreateWarehouseForm",
          popover: {
            title: "Datos de tu almacén",
            description: "Ingresa los datos de tu nuevo almacén",
          },
        },
        {
          element: "#CreateWarehouse",
          popover: {
            title: "Crear almacén",
            description: "Has clic aquí para crear un nuevo almacén",
            onNextClick: () => {
              localStorage.setItem("tutorialStep", "createWarehouse");
              router.push("/dashboard"); // Navigate back to the dashboard
            },
          },
        },
        {
          element: "jiji",
          popover: {},
        },
      ],
      onDestroyed: () => {},
    });

    driverObj.drive();
  };

  // Al montar el componente, traemos la lista de almacenes
  useEffect(() => {
    async function fetchWarehouses() {
      try {
        const data = await getWarehouses();
        setWarehouses(data);
      } catch (err) {
        console.error("Error al obtener los almacenes:", err);
      }
    }
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (isTutorialActive) {
      startTutorial();
    }
  }, [isTutorialActive]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas en frontend
    if (!warehouseName.trim() || !address.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    // 1. Verificamos si el nombre ya existe en la lista de almacenes
    const nombreDuplicado = warehouses.some(
      (wh) =>
        wh.warehouseName.toLowerCase() === warehouseName.trim().toLowerCase()
    );

    if (nombreDuplicado) {
      setError("Ya existe un almacén con este nombre. Por favor, elige otro.");
      return;
    }

    // 2. Si el nombre no está duplicado, construimos el objeto
    const newWarehouse = {
      warehouseName: warehouseName.trim(),
      address: address.trim(),
    };

    try {
      await createWarehouse(newWarehouse);
      alert("¡Almacén creado exitosamente!");
      // Redirige a la lista de almacenes (o a donde tú prefieras)
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error al crear el almacén.");
      } else {
        setError("Error al crear el almacén.");
      }
      console.error("Fallo al crear el almacén:", err);
    }
  };

  return (
    <ProtectedRoute>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
        <h2 className="text-3xl text-black font-bold mb-6">
          Crear Nuevo Almacén
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form
          id="CreateWarehouseForm"
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
        >
          <div>
            <input
              type="text"
              value={warehouseName}
              onChange={(e) => setWarehouseName(e.target.value)}
              placeholder="Nombre del Almacén"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Dirección"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            id="CreateWarehouse"
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Crear Almacén
          </button>
        </form>

        <Link href="/dashboard" className="mt-4">
          <button className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition">
            Volver
          </button>
        </Link>
      </div>
    </ProtectedRoute>
  );
};

export default CreateWarehouse;
