import { API_BASE_URL } from "../config/config";

// Obtener todos los usuarios
export async function getUsers() {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

// Obtener un usuario por ID
export async function getUserById(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}

// Crear un nuevo usuario
export async function createUser(userData) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData), // Enviamos los datos como JSON
  });
  if (!response.ok) {
    throw new Error("Failed to create user");
  }
  return response.json();
}

// Actualizar un usuario por ID
export async function updateUser(id, userData) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData), // Enviamos los datos como JSON
  });

  // Verifica si la respuesta no es exitosa
  if (!response.ok) {
    let errorMessage = "Failed to update user";
    try {
      const errorResponse = await response.json(); // Extrae el cuerpo de la respuesta
      errorMessage = errorResponse.message || errorMessage; // Usa el mensaje de error si existe
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }

  // Si la respuesta es 204, no hay cuerpo para analizar
  if (response.status === 204) {
    return; // Devuelve undefined, ya que no hay contenido
  }

  return response.json(); // En otros casos, devuelve el JSON
}

// Eliminar un usuario por ID
// export async function deleteUser(id) {
//   const response = await fetch(`${API_URL}/${id}`, {
//     method: "DELETE",
//   });
//   if (!response.ok) {
//     throw new Error("Failed to delete user");
//   }
//   return response.json();
// }

// Eliminar un usuario por ID
export async function deleteUser(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  // Si la respuesta es 204, no hay cuerpo para analizar
  if (response.status === 204) {
    return; // Devuelve undefined, ya que no hay contenido
  }

  return response.json(); // En otros casos, devuelve el JSON
}
