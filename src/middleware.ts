import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1] || req.cookies.get("token")?.value;

    console.log("Token recibido en middleware:", token);

    const authRoutes = ["/dashboard", "/admin", "/perfil"];
    const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

    if (isAuthRoute && !token) {
        console.log("No hay token, redirigiendo a login...");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token) {
        try {
            const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jwtVerify(token, secretKey);
            console.log("Token válido, payload:", payload);

            if (req.nextUrl.pathname.startsWith("/admin") && payload.role !== "cliente") {
                console.log("No es admin, redirigiendo a dashboard...");
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }

            if (req.nextUrl.pathname.startsWith("/dashboard") && payload.role === "admin") {
                console.log("Un trabajador no puede acceder a dashboard, redirigiendo a perfil...");
                return NextResponse.redirect(new URL("/perfil", req.url));
            }

        } catch (error) {
            console.error("Error verificando token:", error);
            const response = NextResponse.redirect(new URL("/login", req.url));
            response.cookies.delete("token");
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/perfil/:path*"],
};
