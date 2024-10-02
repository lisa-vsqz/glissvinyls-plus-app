"use client";
import { getUsers, deleteUser } from "../../libs/userService"; // Asegúrate de importar deleteUser
import { useState, useEffect } from "react";
import { User } from "@/types/user"; // Asegúrate de que la ruta sea correcta
import Link from "next/link"; // Importar el componente Link de Next.js

const Index: React.FC<{ user: User }> = () => {
  const [users, setUsers] = useState<User[]>([]); // Definir el tipo del estado como un arreglo de User

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsers();
        setUsers(data); // Asegúrate de que `data` sea del tipo correcto
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id); // Llamamos a la función deleteUser
      setUsers(users.filter((user) => user.id !== id)); // Actualiza el estado para eliminar el usuario
      alert("User deleted successfully!"); // Mostrar alerta de usuario borrado
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user."); // Mostrar alerta si falla la eliminación
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <h2 className="text-3xl text-black font-bold mb-6">List of Users</h2>
      <Link href="/users/create">
        <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Create User
        </button>
      </Link>
      <ul className="w-full max-w-md">
        {users.map((u) => (
          <li
            key={u.id}
            className="border p-4 my-2 rounded bg-white shadow-md flex justify-between items-center"
          >
            <span>
              {u.firstName} {u.lastName}
            </span>
            <div className="flex space-x-2">
              <Link href={`/users/edit/${u.id}`}>
                <button className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                  Edit
                </button>
              </Link>

              <button
                onClick={() => handleDeleteUser(u.id)} // Llamar a la función handleDeleteUser
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
