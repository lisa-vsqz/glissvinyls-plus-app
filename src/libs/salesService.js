import { SALES_API_URL } from "../config/config";

export async function registerSale(saleRequest) {
  const response = await fetch(`${SALES_API_URL}/register-sale`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Incluye el token si es necesario
    },
    body: JSON.stringify(saleRequest),
  });

  if (!response.ok) {
    let errorMessage = "Failed to register sale";
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
