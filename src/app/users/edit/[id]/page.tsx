"use client"; // Asegúrate de que este archivo sea un componente de cliente
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importa desde 'next/navigation' en Next.js 13 y superior
import { getUserById, updateUser } from "../../../../libs/userService"; // Asegúrate de que la ruta sea correcta
import { User } from "@/types/user"; // Importa la interfaz User desde el archivo de tipos

export default function EditUser({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    id: "", // Asegúrate de incluir el campo 'id' en el estado inicial
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (params.id) {
        try {
          const fetchedUser = await getUserById(params.id); // Asegúrate de que la función obtenga el usuario por ID
          setUser(fetchedUser);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };

    fetchUser();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Intentar actualizar el usuario
      await updateUser(user.id, user);

      // Si no se lanza ninguna excepción, se considera exitoso
      alert("User updated successfully!"); // Alerta de éxito
      router.push("/users"); // Redirigir a la lista de usuarios después de la actualización
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user."); // Alerta de error
      router.push("/users");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <h2 className="text-3xl text-black font-bold mb-6">Edit User</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <input
          type="text"
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          placeholder="First Name"
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          placeholder="Last Name"
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Password"
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Update User
        </button>
      </form>
    </div>
  );
}
