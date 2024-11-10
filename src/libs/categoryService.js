const API_URL = "https://localhost:7043/api/Categories";

// Get all categories
export async function getCategories() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

// Get a category by ID
export async function getCategoryById(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Token for Admin
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }
  return response.json();
}

// Create a new category (Admin only)
export async function createCategory(category) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Token for Admin
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create category";
    try {
      const errorResponse = await response.json();
      errorMessage = errorResponse.message || errorMessage;
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function updateCategory(id, categoryData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    // Manejo de errores
  }

  // No intentes llamar a response.json() ya que no hay contenido
  return;
}

// Delete a category by ID (Admin only)
export async function deleteCategory(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to delete category";
    try {
      const errorResponse = await response.json();
      errorMessage = errorResponse.message || errorMessage;
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }
}
