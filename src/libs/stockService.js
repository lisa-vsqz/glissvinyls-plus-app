import { STOCK_API_URL } from "../config/config";

/**
 * Fetch all stocks.
 * @returns {Promise<Array>} Array of stocks.
 */
export async function getAllStocks() {
  const response = await fetch(`${STOCK_API_URL}`);
  if (!response.ok) {
    throw new Error("Failed to fetch all stocks.");
  }
  return response.json();
}

/**
 * Fetch stock details by ID.
 * @param {number} stockId - The ID of the stock to fetch.
 * @returns {Promise<Object>} The stock details.
 */
export async function getStockById(stockId) {
  const response = await fetch(`${STOCK_API_URL}/${stockId}`);
  if (!response.ok) {
    let errorMessage = "Failed to fetch stock details.";
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

/**
 * Create a new stock.
 * @param {Object} stockData - The data for the new stock.
 * @returns {Promise<Object>} The created stock.
 */
export async function createStock(stockData) {
  const response = await fetch(`${STOCK_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stockData),
  });
  if (!response.ok) {
    let errorMessage = "Failed to create stock.";
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

/**
 * Update an existing stock by ID.
 * @param {number} stockId - The ID of the stock to update.
 * @param {Object} stockData - The new data for the stock.
 * @returns {Promise<void>}
 */
export async function updateStock(stockId, stockData) {
  const response = await fetch(`${STOCK_API_URL}/${stockId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stockData),
  });
  if (!response.ok) {
    let errorMessage = "Failed to update stock.";
    try {
      const errorResponse = await response.json();
      errorMessage = errorResponse.message || errorMessage;
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }
}

/**
 * Update the AvailableQuantity for a stock by ID.
 * @param {number} stockId - The ID of the stock to update.
 * @param {number} availableQuantity - The new available quantity.
 * @returns {Promise<void>}
 */
export async function updateStockQuantity(stockId, availableQuantity) {
  const response = await fetch(`${STOCK_API_URL}/${stockId}/quantity`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(availableQuantity),
  });
  if (!response.ok) {
    let errorMessage = "Failed to update stock quantity.";
    try {
      const errorResponse = await response.json();
      errorMessage = errorResponse.message || errorMessage;
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }
}

/**
 * Delete a stock by ID.
 * @param {number} stockId - The ID of the stock to delete.
 * @returns {Promise<void>}
 */
export async function deleteStock(stockId) {
  const response = await fetch(`${STOCK_API_URL}/${stockId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    let errorMessage = "Failed to delete stock.";
    try {
      const errorResponse = await response.json();
      errorMessage = errorResponse.message || errorMessage;
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }
}

/**
 * Fetch stock by warehouse ID.
 * @param {number} warehouseId - The ID of the warehouse to fetch stock for.
 * @returns {Promise<Array>} Array of stock items for the warehouse.
 */
export async function getStockByWarehouse(warehouseId) {
  const response = await fetch(`${STOCK_API_URL}/warehouse/${warehouseId}`);
  if (!response.ok) {
    let errorMessage = "Failed to fetch stock by warehouse.";
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
