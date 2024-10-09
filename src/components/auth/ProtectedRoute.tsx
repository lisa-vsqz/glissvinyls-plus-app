"use client";
// components/ProtectedRoute.js
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../libs/authService"; // Ajusta la ruta según tu estructura

import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated()) {
      // Redirigir a la página 404 si no está autenticado
      router.push("/404");
    }
  }, [router]);

  // Si el usuario está autenticado, renderizar los hijos
  return isAuthenticated() ? children : null;
};

export default ProtectedRoute;
