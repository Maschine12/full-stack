// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    // Rutas protegidas (ajustar según sea necesario)
    const authRoutes = ["/dashboard", "/admin", "/perfil"];
    const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

    // Si la ruta requiere autenticación y no hay token, redirigir a login
    if (isAuthRoute && !token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Verificar el token si existe
    if (token) {
        try {
            // Usamos jose para verificar el token
            const secretKey = new TextEncoder().encode(process.env.JWT_SECRET); // Codificar la clave secreta
            const { payload } = await jwtVerify(token, secretKey); // Verificar el token

            // Redirigir usuarios según su rol
            if (req.nextUrl.pathname.startsWith("/admin") && payload.role !== "admin") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }

            if (req.nextUrl.pathname.startsWith("/trabajador") && payload.role !== "trabajador") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        } catch (error) {
            const errorMessage = encodeURIComponent(error instanceof Error ? error.message : "Ocurrió un error inesperado");
            return NextResponse.redirect(new URL(`/login?error=${errorMessage}`, req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/trabajador/:path*", "/perfil"],
    runtime: 'nodejs',
};
