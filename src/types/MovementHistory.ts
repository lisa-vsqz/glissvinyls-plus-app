export interface MovementHistory {
  historyId: number;
  productId: number;
  productName: string;
  movementDate: string; // ISO 8601 date string (e.g., "2024-11-26T12:00:00Z")
  movementType: "Entry" | "Exit"; // Restricción para tipo de movimiento
  quantity: number;
  warehouseId: number;
  warehouseName: string;
}
