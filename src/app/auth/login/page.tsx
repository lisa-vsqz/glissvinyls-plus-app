"use client";
import { useState } from "react";
import { login } from "../../../libs/authService"; // Asegúrate de que la ruta sea correcta
import { useRouter } from "next/navigation";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    try {
      await login(username, password); // Llamamos la función login con username y password
      router.push("/products"); // Redirige al dashboard o a la ruta deseada
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          {/* Aquí va tu código para la imagen y la bienvenida */}
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <h1 className="text-2xl font-bold">Login</h1>

            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white"
              >
                Log In
              </button>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Login;
