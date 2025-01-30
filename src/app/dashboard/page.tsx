"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getWarehouses } from "../../libs/warehouseService";
import { getCategories } from "../../libs/categoryService";
import { getSuppliers } from "../../libs/supplierService";
import { acquireProducts } from "../../libs/inventoryService";
import {
  getAllMovementHistory,
  getEntryHistory,
  getExitHistory,
  getTopRotatedProducts,
} from "../../libs/movementHistoryService";
import { Warehouse } from "@/types/warehouse";
import { Category } from "@/types/category";
import { Supplier } from "@/types/supplier";
import { MovementHistory } from "@/types/MovementHistory";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Importamos las funciones de xlsx
import { utils, writeFile } from "xlsx";

interface TopRotatedProduct {
  productId: number;
  productName: string;
  entryMovements: number;
  exitMovements: number;
  totalMovements: number;
}

interface Product {
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: number;
  image: string;
}

const WarehousesIndex: React.FC = () => {
  // ===================== Estados generales =====================
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // ===================== Historial de movimientos =====================
  // 1) Estado con los datos crudos (según el endpoint que llamemos)
  const [rawMovementHistory, setRawMovementHistory] = useState<
    MovementHistory[]
  >([]);

  // 2) Estado con los datos filtrados en el front
  const [filteredMovementHistory, setFilteredMovementHistory] = useState<
    MovementHistory[]
  >([]);

  // ===================== Filtro por tipo de movimiento =====================
  const [filterType, setFilterType] = useState<"all" | "entry" | "exit">("all");

  // ===================== Filtros de almacén y producto (SIN fechas) =====================
  const [filterWarehouseId, setFilterWarehouseId] = useState<number | "">("");
  const [filterProductName, setFilterProductName] = useState<string>("");

  // ===================== Paginación =====================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ===================== Estados para adquirir productos =====================
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    categoryId: 0,
    image: "",
  });
  const [supplierId, setSupplierId] = useState<number | "">("");
  const [warehouseId, setWarehouseId] = useState<number | "">("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // ===================== Estados para productos más rotados =====================
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [topRotatedProducts, setTopRotatedProducts] = useState<
    TopRotatedProduct[]
  >([]);

  // ===================== useEffect: quickstart =====================
  const searchParams = useSearchParams();
  const startTutorial = searchParams.get("startTutorial");
  const router = useRouter();

  useEffect(() => {
    if (startTutorial) {
      quickStart();
    }
  }, [startTutorial]);

  // ===================== useEffect: cargar almacenes, categorías, proveedores =====================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [warehouseData, categoryData, supplierData] = await Promise.all([
          getWarehouses(),
          getCategories(),
          getSuppliers(),
        ]);
        setWarehouses(warehouseData);
        setCategories(categoryData);
        setSuppliers(supplierData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // ===================== useEffect: traer datos según el filtro de tipo (all, entry, exit) =====================
  useEffect(() => {
    const fetchMovementHistory = async () => {
      try {
        let data: MovementHistory[] = [];
        if (filterType === "all") data = await getAllMovementHistory();
        else if (filterType === "entry") data = await getEntryHistory();
        else if (filterType === "exit") data = await getExitHistory();

        // Ordenar los datos de más recientes a más antiguos
        data.sort(
          (a, b) =>
            new Date(b.movementDate).getTime() -
            new Date(a.movementDate).getTime()
        );

        // Guardamos en rawMovementHistory
        setRawMovementHistory(data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching movement history:", error);
      }
    };

    fetchMovementHistory();
  }, [filterType]);

  // ===================== useEffect: filtrar en el front-end por almacén y producto (SIN fechas) =====================
  useEffect(() => {
    // Copiamos los datos crudos
    let data = [...rawMovementHistory];

    // 1) Filtrar por almacén
    if (filterWarehouseId !== "") {
      data = data.filter(
        (movement) => movement.warehouseId === Number(filterWarehouseId)
      );
    }

    // 2) Filtrar por nombre de producto
    if (filterProductName.trim() !== "") {
      const lowerSearch = filterProductName.toLowerCase();
      data = data.filter((movement) =>
        movement.productName.toLowerCase().includes(lowerSearch)
      );
    }

    // Finalmente, seteamos el estado filtrado
    setFilteredMovementHistory(data);
    setCurrentPage(1); // opcional: reiniciar paginación cuando cambien filtros
  }, [rawMovementHistory, filterWarehouseId, filterProductName]);

  // ===================== Lógica de paginación (usa filteredMovementHistory) =====================
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMovementHistory.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredMovementHistory.length / itemsPerPage);

  // ===================== Funciones para adquirir productos =====================
  const handleAddProduct = () => {
    if (
      !newProduct.name ||
      !newProduct.description ||
      newProduct.price <= 0 ||
      newProduct.quantity <= 0 ||
      newProduct.categoryId === 0 ||
      !newProduct.image
    ) {
      alert(
        "Por favor, completa todos los campos del producto con datos válidos."
      );
      return;
    }

    setProducts([...products, newProduct]);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      categoryId: 0,
      image: "",
    });
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleAcquireProducts = async () => {
    if (!supplierId || !warehouseId) {
      alert("Por favor, selecciona un proveedor y un almacén.");
      return;
    }

    if (products.length === 0) {
      alert("Por favor, agrega al menos un producto para adquirir.");
      return;
    }

    const acquisitionRequest = {
      supplierId: Number(supplierId),
      warehouseId: Number(warehouseId),
      products,
    };

    try {
      await acquireProducts(acquisitionRequest);
      alert("¡Productos adquiridos exitosamente!");
      setProducts([]);
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error acquiring products:", error);
      alert("Error al adquirir los productos.");
    }
  };

  // ===================== Panel de productos más rotados =====================
  const handleFetchTopRotatedProducts = async () => {
    if (!startDate || !endDate) {
      alert("Por favor, selecciona ambas fechas.");
      return;
    }

    try {
      const products = await getTopRotatedProducts(startDate, endDate);
      setTopRotatedProducts(products);
    } catch (error) {
      console.error("Error fetching top rotated products:", error);
      alert("Error al obtener los productos más rotados.");
    }
  };

  // ===================== Exportar a Excel =====================
  const handleExportToExcel = () => {
    if (topRotatedProducts.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    // Encabezados de las columnas
    const headers = ["Product", "Entries", "Exits", "Total Movements"];

    // Convertimos los datos en un Array of Arrays (AOA)
    const data = topRotatedProducts.map((product) => [
      product.productName,
      product.entryMovements,
      product.exitMovements,
      product.totalMovements,
    ]);

    // Creamos una hoja de trabajo a partir de los datos
    const worksheet = utils.aoa_to_sheet([headers, ...data]);

    // Creamos un libro de trabajo y le agregamos la hoja
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "TopRotatedProducts");

    // Exportamos el archivo
    writeFile(workbook, "TopRotatedProducts.xlsx");
  };

  // ===================== Funciones para el tour virtual =====================
  const quickStart = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: ".example1", // Change this selector to match an actual element
          popover: {
            title: "Bienvenidooo!",
            description:
              "Este es tú sistema de gestión de almacenes. ¡Hagamos un recorrido rápido!",
          },
        },
        {
          element: "#CreateWarehouse", // Create Warehouse button
          popover: {
            title: "Crea tu almacén",
            description:
              "Has clic aquí para crear un nuevo almacén para la gestión de inventario",
            onNextClick: () => {
              localStorage.setItem("tutorialStep", "activado");
              router.push("/dashboard/warehouses/create");
            },
          },
        },
        {
          element: "div.bg-white.p-4", // Top Rotated Products Panel
          popover: {
            title: "Productos de mayor rotación",
            description: "Vea los productos más movidos en sus almacenes.",
          },
        },
      ],
      onDestroyed: () => {
        router.replace("/dashboard");
      },
    });

    driverObj.drive();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const step = localStorage.getItem("tutorialStep");

      if (step === "createWarehouse") {
        // Start the next step of the tutorial
        startNextTutorialStep();
        localStorage.removeItem("tutorialStep"); // Clean up the flag
      }
    }
  }, []);

  const startNextTutorialStep = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "xd", // Top Rotated Products Panel
          popover: {
            title: "Continuemos",
            description: "Sigamos con el tutorial...",
          },
        },
        {
          element: "div.bg-white.p-4", // Top Rotated Products Panel
          popover: {
            title: "Productos de mayor rotación",
            description: "Vea los productos más movidos en sus almacenes.",
          },
        },
        {
          element: "#StartDate", // Date filters for rotated products
          popover: {
            title: "Filtro por fecha",
            description:
              "Elija un rango de fechas para analizar el movimiento del producto. Escoge la fecha de inicio.",
          },
        },
        {
          element: "#EndDate", // Date filters for rotated products
          popover: {
            title: "Filtro por fecha",
            description:
              "Elija un rango de fechas para analizar el movimiento del producto. Escoge la fecha de fin.",
          },
        },
        {
          element: "button.bg-blue-600", // Search button
          popover: {
            title: "Busca tus mejores productos",
            description:
              "Haga clic para obtener resultados de los productos más destacados",
          },
        },
        {
          element: "table.table-auto", // Table displaying top rotated products
          popover: {
            title: "Movimiento de productos",
            description:
              "Esta tabla muestra el movimiento de productos que entran y salen de los almacenes.",
          },
        },
        {
          element: "#FiltradoTipo", // Table displaying top rotated products
          popover: {
            title: "Filtra tus productos",
            description:
              "Selecciona si deseas ver solo entradas, solo salidas de productos o ambos.",
          },
        },
        {
          element: "#FiltroAlmaProd", // Table displaying top rotated products
          popover: {
            title: "Filtra por nombres",
            description:
              "También puedes filtrar buscando el nombre de un almacén o por el nombre del producto.",
          },
        },
        {
          element: "ul.mt-6", // List of warehouses
          popover: {
            title: "Lista de almacenes",
            description:
              "Aquí se enumeran todos sus almacenes. Haga clic en Manage para ver los detalles",
          },
        },
        {
          element: "button.w-full.bg-blue-600", // Acquire Products button
          popover: {
            title: "Adquiera nuevos productos",
            description:
              "Haga clic aquí para agregar productos a sus almacenes",
          },
        },
      ],
      onDestroyed: () => {
        router.replace("/dashboard");
      },
    });

    driverObj.drive();
  };

  // ===================== Render =====================
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProtectedRoute>
        <Header />
        <div className="flex flex-row h-screen bg-gray-100">
          {/* ===================== Lado Izquierdo ===================== */}
          <div className="w-1/3 p-4 border-r border-gray-300 overflow-y-auto">
            <h2 className="text-2xl font-bold text-center mb-4">Warehouses</h2>
            <Link href="dashboard/warehouses/create">
              <button
                id="CreateWarehouse"
                className="mb-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-blue-600 transition w-full"
              >
                Create Warehouse
              </button>
            </Link>

            {/* Panel para productos más rotados */}
            <div className="bg-white p-4 rounded shadow-md mt-6">
              <h3 className="text-lg font-bold mb-4 text-center">
                Top Rotated Products
              </h3>
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block font-bold mb-1">Start Date</label>
                  <input
                    id="StartDate"
                    type="date"
                    className="w-full p-2 border rounded"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">End Date</label>
                  <input
                    id="EndDate"
                    type="date"
                    className="w-full p-2 border rounded"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleFetchTopRotatedProducts}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Search
                </button>
              </div>

              {/* Resultados de productos más rotados */}
              {topRotatedProducts.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-bold mb-2">Results:</h4>

                  <button
                    onClick={handleExportToExcel}
                    className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Exportar a Excel
                  </button>

                  <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200 text-gray-700">
                        <th className="border border-gray-300 px-4 py-2">
                          Product
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                          Entries
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                          Exits
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                          Total Movements
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topRotatedProducts.map((product) => (
                        <tr key={product.productId}>
                          <td className="border border-gray-300 px-4 py-2">
                            {product.productName}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {product.entryMovements}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {product.exitMovements}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {product.totalMovements}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Lista de Almacenes */}
            <ul className="mt-6">
              {warehouses.map((w) => (
                <li
                  key={w.warehouseId}
                  className="border p-4 my-2 rounded bg-gray-50 shadow-md flex justify-between items-center"
                >
                  <span>
                    {w.warehouseName} - {w.address}
                  </span>
                  <Link href={`dashboard/warehouses/${w.warehouseId}`}>
                    <button className="px-2 py-1 bg-teal-600 text-white rounded">
                      Manage
                    </button>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Botón para abrir el popup de adquisición de productos */}
            <div className="mt-6">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Acquire Products
              </button>
            </div>
          </div>

          {/* ===================== Popup para Adquisición de Productos ===================== */}
          {isPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-auto z-50">
              <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-3/4 lg:w-1/2 z-50">
                <h2 className="text-xl font-bold mb-4">Acquire Products</h2>
                <div className="mb-4">
                  <label className="block font-bold mb-1">Supplier</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={supplierId}
                    onChange={(e) =>
                      setSupplierId(Number(e.target.value) || "")
                    }
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option
                        key={supplier.supplierId}
                        value={supplier.supplierId}
                      >
                        {supplier.supplierName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block font-bold mb-1">Warehouse</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={warehouseId}
                    onChange={(e) =>
                      setWarehouseId(Number(e.target.value) || "")
                    }
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses.map((warehouse) => (
                      <option
                        key={warehouse.warehouseId}
                        value={warehouse.warehouseId}
                      >
                        {warehouse.warehouseName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block font-bold mb-1">Category</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={newProduct.categoryId || ""}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        categoryId: Number(e.target.value) || 0,
                      })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option
                        key={category.categoryId}
                        value={category.categoryId}
                      >
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Otros Campos del Producto */}
                <div className="mb-4">
                  <label className="block font-bold mb-1">Product Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-bold mb-1">Description</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-bold mb-1">Price</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-bold mb-1">Quantity</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={newProduct.quantity}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        quantity: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    min="0"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-bold mb-1">Image URL</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newProduct.image}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.value })
                    }
                  />
                </div>
                {/* Botones para Agregar Producto */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleAddProduct}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
                  >
                    Add Product
                  </button>
                </div>
                {/* Lista de Productos Agregados */}
                {products.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">
                      Productos Agregados:
                    </h3>
                    <ul className="max-h-40 overflow-y-auto border p-2 rounded">
                      {products.map((product, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center border-b last:border-b-0 py-2"
                        >
                          <span>
                            <strong>{product.name}</strong> - {product.quantity}{" "}
                            unidades
                          </span>
                          <button
                            onClick={() => handleRemoveProduct(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Botones de Acción */}
                <div className="flex justify-between">
                  <button
                    onClick={handleAcquireProducts}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Acquire
                  </button>
                  <button
                    onClick={() => setIsPopupOpen(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== Lado Derecho: Movement History Dashboard ===================== */}
          <div className="w-2/3 p-4 overflow-y-auto">
            <div className="bg-white p-6 rounded shadow-md">
              <h2 className="text-2xl font-bold text-center mb-4">
                Movement History Dashboard
              </h2>

              {/* ======== Botones de Filtrado por Tipo (sin fechas) ======== */}
              <div
                id="FiltradoTipo"
                className="flex justify-center space-x-4 mb-6"
              >
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-2 rounded ${
                    filterType === "all"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Movements
                </button>
                <button
                  onClick={() => setFilterType("entry")}
                  className={`px-4 py-2 rounded ${
                    filterType === "entry"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Entries
                </button>
                <button
                  onClick={() => setFilterType("exit")}
                  className={`px-4 py-2 rounded ${
                    filterType === "exit"
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Exits
                </button>
              </div>

              {/* ======== Filtros (solo almacén y producto) ======== */}
              <div
                id="FiltroAlmaProd"
                className="p-4 mb-4 bg-gray-50 border border-gray-200 rounded"
              >
                <h3 className="font-bold mb-2">Filtros adicionales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* FILTRO DE ALMACÉN */}
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Almacén
                    </label>
                    <select
                      value={filterWarehouseId}
                      onChange={(e) =>
                        setFilterWarehouseId(Number(e.target.value) || "")
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="">-- Todos --</option>
                      {warehouses.map((w) => (
                        <option key={w.warehouseId} value={w.warehouseId}>
                          {w.warehouseName}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* FILTRO DE PRODUCTO (POR NOMBRE) */}
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Producto
                    </label>
                    <input
                      type="text"
                      value={filterProductName}
                      onChange={(e) => setFilterProductName(e.target.value)}
                      placeholder="Nombre del producto..."
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* ======== Tabla de Historial de Movimientos (filtered) ======== */}
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Product
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Type</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Quantity
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Warehouse
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((movement) => (
                    <tr key={movement.historyId} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(movement.movementDate).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {movement.productName}
                      </td>
                      <td
                        className={`border border-gray-300 px-4 py-2 ${
                          movement.movementType.toLowerCase() === "entry"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {movement.movementType}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {movement.quantity}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {movement.warehouseName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ======== Controles de Paginación ======== */}
              {filteredMovementHistory.length > itemsPerPage && (
                <div className="flex justify-center space-x-2 mt-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-white"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </Suspense>
  );
};

export default WarehousesIndex;
