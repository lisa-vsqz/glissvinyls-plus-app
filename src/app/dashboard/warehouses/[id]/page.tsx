"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getWarehouseById } from "../../../../libs/warehouseService";
import {
  getTopSellingProductsByWarehouse,
  predictStockNeedsByWarehouse,
} from "../../../../libs/recomendationsService";
import {
  getStockByWarehouse,
  updateStockQuantity,
} from "../../../../libs/stockService";
import { registerSale } from "../../../../libs/salesService";
import Header from "@/components/Header";

const WarehouseDetails: React.FC = () => {
  const params = useParams();
  const id = params.id;

  interface Warehouse {
    warehouseName: string;
    address: string;
    // Add other properties as needed
  }

  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  interface TopSellingProduct {
    name: string;
    description: string;
    totalSold: number;
  }

  const [topSellingProducts, setTopSellingProducts] = useState<
    TopSellingProduct[]
  >([]);
  interface StockRecommendation {
    productName: string;
    description: string;
    predictedQuantity: number;
  }

  const [stockRecommendations, setStockRecommendations] = useState<
    StockRecommendation[]
  >([]);
  const [warehouseStock, setWarehouseStock] = useState<
    {
      productId: number;
      productName: string;
      availableQuantity: number;
      stockId: number;
    }[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<
    { productId: number; productName: string; quantity: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Estado para manejar las cantidades ingresadas para la venta
  const [quantityInputs, setQuantityInputs] = useState<{
    [key: number]: string;
  }>({});

  // Estado para manejar las cantidades ingresadas para aumentar stock
  const [increaseQuantityInputs, setIncreaseQuantityInputs] = useState<{
    [key: number]: string;
  }>({});

  // Función para manejar el cambio en el campo de entrada de cantidad para la venta
  const handleQuantityInputChange = (productId: number, value: string) => {
    setQuantityInputs((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  // Función para manejar el cambio en el campo de entrada de cantidad para aumentar stock
  const handleIncreaseQuantityInputChange = (
    productId: number,
    value: string
  ) => {
    setIncreaseQuantityInputs((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseData = await getWarehouseById(id);
        const topSelling = await getTopSellingProductsByWarehouse(id);
        const recommendations = await predictStockNeedsByWarehouse(id, 12);
        const stock = await getStockByWarehouse(Number(id));

        setWarehouse(warehouseData);
        setTopSellingProducts(topSelling);
        setStockRecommendations(recommendations);
        setWarehouseStock(stock);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRegisterSale = async () => {
    try {
      const saleRequest = {
        clientId: 1,
        warehouseId: id,
        products: selectedProducts.map(({ productId, quantity }) => ({
          productId,
          quantity,
        })),
      };

      await registerSale(saleRequest);
      alert("¡Venta registrada exitosamente!");
      setSelectedProducts([]);

      const updatedStock = await getStockByWarehouse(Number(id));
      setWarehouseStock(updatedStock);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error registering sale:", error.message);
        alert("Error al registrar la venta: " + error.message);
      } else {
        console.error("Error registering sale:", error);
        alert("Error al registrar la venta.");
      }
    }
  };

  const handleAddProductToSale = (productId: number) => {
    const product = warehouseStock.find((item) => item.productId === productId);
    const quantity = parseInt(quantityInputs[productId], 10);

    if (product && quantity > 0) {
      if (quantity > product.availableQuantity) {
        alert(
          `La cantidad excede el stock disponible (${product.availableQuantity}).`
        );
        return;
      }

      setSelectedProducts((prev) => {
        // Verificar si el producto ya está en la lista de seleccionados
        const existingProduct = prev.find(
          (item) => item.productId === productId
        );

        if (existingProduct) {
          // Actualizar la cantidad del producto existente
          return prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Añadir nuevo producto a la lista
          return [
            ...prev,
            {
              productId: product.productId,
              productName: product.productName,
              quantity,
            },
          ];
        }
      });

      // Limpiar el campo de entrada de cantidad
      setQuantityInputs((prev) => ({
        ...prev,
        [productId]: "",
      }));
    } else {
      alert("Por favor, ingrese una cantidad válida.");
    }
  };

  // Función para aumentar el stock
  const handleIncreaseStock = async (stockId: number, productId: number) => {
    const quantityToIncrease = parseInt(increaseQuantityInputs[productId], 10);

    if (isNaN(quantityToIncrease) || quantityToIncrease <= 0) {
      alert("Por favor, ingrese una cantidad válida para aumentar el stock.");
      return;
    }

    try {
      const currentStockItem = warehouseStock.find(
        (item) => item.stockId === stockId
      );

      if (!currentStockItem) {
        alert("Error: No se encontró el item de stock actual.");
        return;
      }

      const newQuantity =
        currentStockItem.availableQuantity + quantityToIncrease;

      // Llamar al servicio para actualizar el stock
      await updateStockQuantity(stockId, newQuantity);

      alert("¡Stock actualizado exitosamente!");

      // Actualizar el stock en el estado
      const updatedStock = await getStockByWarehouse(Number(id));
      setWarehouseStock(updatedStock);

      // Limpiar el campo de entrada
      setIncreaseQuantityInputs((prev) => ({
        ...prev,
        [productId]: "",
      }));
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating stock quantity:", error.message);
        alert("Error al actualizar el stock: " + error.message);
      } else {
        console.error("Error updating stock quantity:", error);
        alert("Error al actualizar el stock.");
      }
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <ProtectedRoute>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
        <h2 className="text-3xl text-black font-bold mb-6">
          Detalles del Almacén
        </h2>

        <div className="grid grid-cols-3 gap-4 w-full max-w-7xl">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl text-black font-bold mb-4">Detalles</h3>
            <p>
              <strong>Nombre:</strong> {warehouse?.warehouseName}
            </p>
            <p>
              <strong>Dirección:</strong> {warehouse?.address}
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl text-black font-bold mb-4">
              Productos Más Vendidos
            </h3>
            {topSellingProducts.length > 0 ? (
              <ul className="list-disc pl-6">
                {topSellingProducts.map((product, index) => (
                  <li key={index}>
                    {product.name} - {product.description} (Total Vendido:{" "}
                    {product.totalSold})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No se encontraron productos más vendidos para este almacén.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl text-black font-bold mb-4">
              Recomendaciones de Stock
            </h3>
            {stockRecommendations.length > 0 ? (
              <ul className="list-disc pl-6">
                {stockRecommendations.map((recommendation, index) => (
                  <li key={index}>
                    {recommendation.productName} - {recommendation.description}{" "}
                    (Cantidad Predicha: {recommendation.predictedQuantity})
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                No se encontraron recomendaciones de stock para este almacén.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow-md w-full max-w-7xl mt-8">
          <h3 className="text-xl text-black font-bold mb-4">
            Detalles de Stock
          </h3>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">
                  Nombre del Producto
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Cantidad Disponible
                </th>
                <th className="border border-gray-300 px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {warehouseStock.length > 0 ? (
                warehouseStock.map((stockItem, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">
                      {stockItem.productName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {stockItem.availableQuantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex items-center">
                      {/* Input para cantidad de venta */}
                      <input
                        type="number"
                        min="1"
                        max={stockItem.availableQuantity}
                        value={quantityInputs[stockItem.productId] || ""}
                        onChange={(e) =>
                          handleQuantityInputChange(
                            stockItem.productId,
                            e.target.value
                          )
                        }
                        className="w-16 border border-gray-300 rounded px-1 py-1 mr-2"
                        placeholder="Venta"
                      />
                      <button
                        onClick={() =>
                          handleAddProductToSale(stockItem.productId)
                        }
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition mr-2"
                      >
                        Añadir a la Venta
                      </button>
                      {/* Input para aumentar stock */}
                      <input
                        type="number"
                        min="1"
                        value={
                          increaseQuantityInputs[stockItem.productId] || ""
                        }
                        onChange={(e) =>
                          handleIncreaseQuantityInputChange(
                            stockItem.productId,
                            e.target.value
                          )
                        }
                        className="w-16 border border-gray-300 rounded px-1 py-1 mr-2"
                        placeholder="Aumentar"
                      />
                      <button
                        onClick={() =>
                          handleIncreaseStock(
                            stockItem.stockId,
                            stockItem.productId
                          )
                        }
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                      >
                        Aumentar Stock
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center border border-gray-300 px-4 py-2"
                  >
                    No se encontró stock para este almacén.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded shadow-md w-full max-w-7xl mt-8">
          <h3 className="text-xl text-black font-bold mb-4">
            Productos Seleccionados
          </h3>
          {selectedProducts.length > 0 ? (
            <ul className="list-disc pl-6">
              {selectedProducts.map((product, index) => (
                <li key={index}>
                  {product.productName} - Cantidad: {product.quantity}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay productos seleccionados para la venta.</p>
          )}
          {selectedProducts.length > 0 && (
            <button
              onClick={handleRegisterSale}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mt-4"
            >
              Registrar Venta
            </button>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default WarehouseDetails;
