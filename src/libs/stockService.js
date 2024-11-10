const API_URL = "https://localhost:7043/api/Stocks";

// Get all stocks
export async function getStocks() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch stocks");
  }
  return response.json();
}

// Get a stock by ID (Admin only)
export async function getStockById(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Token for Admin
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch stock");
  }
  return response.json();
}

// Create a new stock (Admin only)
export async function createStock(stock) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Token for Admin
    },
    body: JSON.stringify(stock),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create stock";
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

// Update a stock by ID (Admin only)
export async function updateStock(id, stockData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(stockData),
  });

  if (!response.ok) {
    // Manejo de errores
  }

  return; // No intentes parsear response.json()
}

// Delete a stock by ID (Admin only)
export async function deleteStock(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to delete stock";
    try {
      const errorResponse = await response.json();
      errorMessage = errorResponse.message || errorMessage;
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }
}
