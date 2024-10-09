import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token"); // Obtener el token desde la cookie

  if (request.nextUrl.pathname.startsWith("/products") && !token) {
    return NextResponse.redirect(new URL("/404", request.url)); // Redirigir si no hay token
  }

  return NextResponse.next();
}
