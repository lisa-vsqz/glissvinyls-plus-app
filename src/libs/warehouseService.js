// services/warehouseService.js

import { WAREHOUSE_API_URL } from "../config/config";

// Manejo genérico de respuestas HTTP
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `Error: ${response.status}`;
    try {
      const errorResponse = await response.json();
      errorMessage = errorResponse.message || errorMessage;
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }
  // Devuelve el JSON solo si el estado no es 204 (No Content)
  return response.status !== 204 ? response.json() : null;
}

// services/warehouseService.js

export async function getWarehouses() {
  try {
    const response = await fetch(WAREHOUSE_API_URL);
    const data = await handleResponse(response);
    return data.warehouses || []; // Return the 'warehouses' array directly
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    throw error;
  }
}

// Crear un nuevo almacén
export async function createWarehouse(warehouse) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(WAREHOUSE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(warehouse),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error creating warehouse:", error);
    throw error;
  }
}

// Obtener un almacén por ID
// services/warehouseService.js
export async function getWarehouseById(id) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${WAREHOUSE_API_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Include if required
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized error
        throw new Error("Unauthorized access. Please log in again.");
      } else {
        // Handle other errors
        let errorMessage = `Error fetching warehouse with ID ${id}`;
        try {
          const errorResponse = await response.json();
          errorMessage = errorResponse.message || errorMessage;
        } catch (error) {
          console.error("Error parsing error response:", error);
        }
        throw new Error(errorMessage);
      }
    }
    const data = await response.json();
    return data.warehouse; // Adjusted to return the warehouse object
  } catch (error) {
    console.error(`Error fetching warehouse with ID ${id}:`, error);
    throw error;
  }
}

// Actualizar un almacén por ID
export async function updateWarehouse(id, warehouseData) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${WAREHOUSE_API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(warehouseData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error updating warehouse with ID ${id}:`, error);
    throw error;
  }
}

// Eliminar un almacén por ID
export async function deleteWarehouse(id) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${WAREHOUSE_API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error deleting warehouse with ID ${id}:`, error);
    throw error;
  }
}
