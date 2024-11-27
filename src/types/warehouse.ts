// types/warehouse.ts

export interface Warehouse {
  warehouseId: number;
  warehouseName: string;
  address: string;
}

export interface AcquisitionProduct {
  Name: string;
  Description: string;
  Price: number;
  Quantity: number;
  CategoryId: number;
  Image: string;
}

export interface AcquisitionRequest {
  SupplierId: number;
  WarehouseId: number;
  Products: AcquisitionProduct[];
}

export interface AcquisitionResponse {
  Success: boolean;
  Message: string;
}
