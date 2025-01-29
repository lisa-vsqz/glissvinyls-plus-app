"use client";
import { useState, useEffect } from "react";
import { login } from "../../../libs/authService"; // Asegúrate de que la ruta sea correcta
import { useRouter } from "next/navigation";
import Image from "next/image";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Contador de intentos fallidos
  const [failedAttempts, setFailedAttempts] = useState<number>(0);

  // Momento en que se levantará el bloqueo (en milisegundos desde la época)
  const [lockUntil, setLockUntil] = useState<number | null>(null);

  const router = useRouter();

  // Opcional: Si quieres mostrar un temporizador de cuánto tiempo falta para poder volver a intentar
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Efecto que actualiza cada segundo el tiempo que falta (si estás bloqueado)
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (lockUntil && Date.now() < lockUntil) {
      interval = setInterval(() => {
        const remaining = lockUntil - Date.now();
        if (remaining <= 0) {
          setTimeLeft(0);
          setLockUntil(null);
          clearInterval(interval);
        } else {
          setTimeLeft(Math.ceil(remaining / 1000)); // En segundos
        }
      }, 1000);
    } else {
      setTimeLeft(0);
    }

    return () => clearInterval(interval);
  }, [lockUntil]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    // Si el usuario está bloqueado, no permitas el intento
    if (lockUntil && Date.now() < lockUntil) {
      setError(
        `Has excedido el número de intentos. Inténtalo de nuevo en ${timeLeft} seg.`
      );
      return;
    }

    // Intentar hacer login
    try {
      await login(username, password);
      // Si el login es exitoso, reiniciamos contadores
      setFailedAttempts(0);
      setLockUntil(null);

      router.push("/dashboard");
    } catch (err: unknown) {
      // Si falla el login
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }

      // Incrementar intentos fallidos
      setFailedAttempts((prev) => {
        const newVal = prev + 1;

        // Si llega a 3 intentos, bloquear por 1 minuto
        if (newVal >= 3) {
          setLockUntil(Date.now() + 60_000); // 60,000 ms = 1 minuto
        }

        return newVal;
      });
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
            alt="Login"
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
            <h1 className="text-2xl font-bold">Login</h1>

            {error && <p className="text-red-500">{error}</p>}
            <p>Failed attempts: {failedAttempts}</p>
            {lockUntil && Date.now() < lockUntil && (
              <p className="text-red-500">
                Bloqueado por intentos fallidos. Reintenta en {timeLeft} seg.
              </p>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                  disabled={!!(lockUntil && Date.now() < lockUntil)}
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
                  disabled={!!(lockUntil && Date.now() < lockUntil)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white"
                disabled={!!(lockUntil && Date.now() < lockUntil)}
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
