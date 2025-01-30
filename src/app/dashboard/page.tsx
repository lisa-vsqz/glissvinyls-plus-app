// WarehousesIndex.tsx
"use client";
import { Suspense } from "react";
import DashboardContent from "../../components/DashboardContent";

const WarehousesIndex: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
};

export default WarehousesIndex;
