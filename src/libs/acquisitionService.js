import { ACQUISITION_API_URL } from "../config/config";

export async function acquireProducts(acquisitionRequest) {
  const response = await fetch(`${ACQUISITION_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Incluye el token si es necesario
    },
    body: JSON.stringify(acquisitionRequest),
  });

  if (!response.ok) {
    let errorMessage = "Failed to acquire products";
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
