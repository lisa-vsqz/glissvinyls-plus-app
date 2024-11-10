const API_URL = "https://localhost:7043/api/Suppliers";

// Get all suppliers
export async function getSuppliers() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch suppliers");
  }
  return response.json();
}

// Get a supplier by ID (Admin only)
export async function getSupplierById(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Token for Admin
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch supplier");
  }
  return response.json();
}

// Create a new supplier (Admin only)
export async function createSupplier(supplier) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Token for Admin
    },
    body: JSON.stringify(supplier),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create supplier";
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

// Update a supplier by ID (Admin only)
export async function updateSupplier(id, supplierData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(supplierData),
  });

  if (!response.ok) {
    let errorMessage = "Failed to update supplier";
    try {
      const errorResponse = await response.json();
      errorMessage = errorResponse.message || errorMessage;
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }

  // No intentes llamar a response.json() ya que no hay contenido
  return;
}

// Delete a supplier by ID (Admin only)
export async function deleteSupplier(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to delete supplier";
    try {
      const errorResponse = await response.json();
      errorMessage = errorResponse.message || errorMessage;
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }
}
