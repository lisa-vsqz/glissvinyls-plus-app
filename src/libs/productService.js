const API_URL = "https://glissvinyls-plus-web-api.azurewebsites.net/Products";

// Obtener todos los productos
export async function getProducts() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

// Obtener un producto por ID
export async function getProductById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
}

export async function createProduct(product) {
  const token = localStorage.getItem("token"); // Obtener el token de localStorage

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Incluir el token en las cabeceras
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create product";
    try {
      const errorResponse = await response.json();
      errorMessage = errorResponse.message || errorMessage;
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }

  return response.json(); // Retornar el producto creado
}

export async function updateProduct(id, productData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Incluye el token JWT si es necesario
    },
    body: JSON.stringify(productData), // Enviamos los datos como JSON
  });

  // Verifica si la respuesta no es exitosa
  if (!response.ok) {
    let errorMessage = "Failed to update product";
    try {
      const errorResponse = await response.json(); // Intenta obtener el cuerpo del error
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

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Incluye el token JWT si es necesario
    },
  });

  // Verifica si la respuesta no es exitosa
  if (!response.ok) {
    // Intenta leer el cuerpo de error
    let errorMessage = "Failed to delete product";
    try {
      const errorResponse = await response.json();
      errorMessage = errorResponse.message || errorMessage;
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }

  // Si la respuesta es 204, no hay cuerpo para analizar
  if (response.status === 204) {
    return; // Devuelve undefined, ya que no hay contenido
  }

  // Si la respuesta es otro código, como 200, devuelve el JSON (aunque no debería ser común en DELETE)
  return response.json();
}
