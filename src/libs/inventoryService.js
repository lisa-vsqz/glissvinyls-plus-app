import { ACQUISITION_API_URL } from "../config/config";

// Realizar adquisición de productos
export async function acquireProducts(acquisitionRequest) {
  try {
    const response = await fetch(`${ACQUISITION_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(acquisitionRequest),
    });

    if (!response.ok) {
      let errorMessage = "Failed to acquire products.";
      try {
        const errorResponse = await response.json();
        errorMessage = errorResponse.message || errorMessage;
      } catch (error) {
        console.error("Error parsing error response:", error);
      }
      throw new Error(errorMessage);
    }

    return response.json(); // Retorna la respuesta en formato JSON
  } catch (error) {
    console.error("Error in acquireProducts:", error.message);
    throw error;
  }
}
