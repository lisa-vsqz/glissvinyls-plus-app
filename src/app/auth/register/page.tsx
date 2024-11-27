// pages/register.tsx

"use client";

import React, { useState } from "react";
import { register } from "../../../libs/authService"; // Asegúrate de que la ruta sea correcta
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Register = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("User"); // Valor predeterminado: "User"
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleToggleRole = () => {
    setRole((prevRole) => (prevRole === "User" ? "Admin" : "User"));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    // Validaciones básicas
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !username.trim() ||
      !password.trim()
    ) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    // Validación de formato de email (opcional pero recomendado)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, introduce un email válido.");
      return;
    }

    const newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      username: username.trim(),
      password: password.trim(),
      role, // "User" o "Admin"
    };

    try {
      setIsLoading(true);
      await register(newUser);
      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      router.push("/auth/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error al registrar el usuario.");
      } else {
        setError("Error al registrar el usuario.");
      }
      console.error("Failed to register:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <Image
            src="/img/hero-bg.jpg"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            alt="Register"
          />
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <Image
              src="/img/vinilo-smile.png"
              width={100}
              height={100}
              alt="Logo"
              className="mx-auto mb-8"
            />
            <h1 className="text-2xl font-bold">Register</h1>

            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Toggle Switch para Seleccionar Rol */}
              <div className="flex items-center">
                <label className="mr-4 text-sm font-medium">Role:</label>
                <label
                  htmlFor="role-toggle"
                  className="flex items-center cursor-pointer"
                >
                  {/* Toggle */}
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="role-toggle"
                      className="sr-only"
                      checked={role === "Admin"}
                      onChange={handleToggleRole}
                    />
                    <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                    <div
                      className={`absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition-transform ${
                        role === "Admin"
                          ? "transform translate-x-full bg-green-500"
                          : ""
                      }`}
                    ></div>
                  </div>
                  <div className="ml-3 text-sm font-medium text-gray-700">
                    {role}
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className={`w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 transition ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Register;
