import { RECOMMENDATIONS_API_URL } from "../config/config";

// Obtener productos más vendidos
export async function getTopSellingProducts() {
  const response = await fetch(
    `${RECOMMENDATIONS_API_URL}/top-selling-products`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch top-selling products");
  }
  return response.json();
}

// Obtener predicción de necesidades de inventario (general)
export async function predictStockNeeds(months = 3) {
  const response = await fetch(
    `${RECOMMENDATIONS_API_URL}/predict-stock-needs?months=${months}`
  );
  if (!response.ok) {
    let errorMessage = "Failed to predict stock needs";
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

// Obtener productos más vendidos por almacén
export async function getTopSellingProductsByWarehouse(warehouseId) {
  const response = await fetch(
    `${RECOMMENDATIONS_API_URL}/top-selling-products-by-warehouse/${warehouseId}`
  );
  if (!response.ok) {
    let errorMessage = "Failed to fetch top-selling products by warehouse";
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

// Obtener predicción de necesidades de inventario por almacén
export async function predictStockNeedsByWarehouse(warehouseId, months = 3) {
  const response = await fetch(
    `${RECOMMENDATIONS_API_URL}/predict-stock-needs-by-warehouse/${warehouseId}?months=${months}`
  );
  if (!response.ok) {
    let errorMessage = "Failed to predict stock needs by warehouse";
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
