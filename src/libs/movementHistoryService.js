import { MOVEMENT_HISTORY_API_URL } from "../config/config";

export async function getAllMovementHistory() {
  const response = await fetch(`${MOVEMENT_HISTORY_API_URL}`);
  if (!response.ok) {
    throw new Error("Failed to fetch all movement history");
  }
  return response.json();
}

// Obtener historial de movimientos de un almacén específico
export async function getMovementHistoryByWarehouse(warehouseId) {
  const response = await fetch(
    `${MOVEMENT_HISTORY_API_URL}/ByWarehouse/${warehouseId}`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch movement history for warehouse ${warehouseId}`
    );
  }
  return response.json();
}

// Obtener historial de entradas
export async function getEntryHistory() {
  const response = await fetch(`${MOVEMENT_HISTORY_API_URL}/Entry`);
  if (!response.ok) {
    throw new Error("Failed to fetch entry history");
  }
  return response.json();
}

// Obtener historial de salidas
export async function getExitHistory() {
  const response = await fetch(`${MOVEMENT_HISTORY_API_URL}/Exit`);
  if (!response.ok) {
    throw new Error("Failed to fetch exit history");
  }
  return response.json();
}

// Obtener historial de entradas por almacén
export async function getEntryHistoryByWarehouse(warehouseId) {
  const response = await fetch(
    `${MOVEMENT_HISTORY_API_URL}/ByWarehouse/${warehouseId}/Entry`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch entry history for warehouse ${warehouseId}`
    );
  }
  return response.json();
}

// Obtener historial de salidas por almacén
export async function getExitHistoryByWarehouse(warehouseId) {
  const response = await fetch(
    `${MOVEMENT_HISTORY_API_URL}/ByWarehouse/${warehouseId}/Exit`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch exit history for warehouse ${warehouseId}`
    );
  }
  return response.json();
}

// Obtener productos con mayor rotación en un rango de fechas
export async function getTopRotatedProducts(startDate, endDate) {
  const response = await fetch(
    `${MOVEMENT_HISTORY_API_URL}/TopRotatedProducts?startDate=${startDate}&endDate=${endDate}`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch top rotated products between ${startDate} and ${endDate}`
    );
  }
  return response.json();
}
