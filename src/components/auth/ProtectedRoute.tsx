"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../libs/authService"; // Ajusta la ruta
import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      setIsAuth(auth);

      if (!auth) {
        router.push("/404");
      }
    };

    checkAuth();
  }, [router]);

  // Mientras se verifica la autenticación, no renderizar nada
  if (isAuth === null) return null;

  // Renderizar hijos si está autenticado
  return isAuth ? <>{children}</> : null;
};

export default ProtectedRoute;
