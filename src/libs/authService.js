const AUTH_API_URL = "https://localhost:7043/api/Auth"; // Ajusta la URL si es necesario

export async function login(username, password) {
  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to login";
    try {
      const errorResponse = await response.json();
      errorMessage = errorResponse.message || errorMessage;
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  // Almacenar el token en localStorage
  localStorage.setItem("token", data.token);

  return data;
}

// Obtener información del usuario autenticado
export async function getUserProfile() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch(`${AUTH_API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`, // Incluye el token JWT
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
}

// Cerrar sesión
export function logout() {
  localStorage.removeItem("token"); // Eliminar el token de localStorage
}

// Verificar si el usuario está autenticado
export function isAuthenticated() {
  const token = localStorage.getItem("token");
  return !!token; // Retorna true si existe un token, de lo contrario false
}
