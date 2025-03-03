import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1] || req.cookies.get("token")?.value;
    const protectedRoutes = ["/dashboard", "/admin", "/perfil"];

    if (!token && protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        if (token) {
            const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jwtVerify(token, secretKey);

            if (req.nextUrl.pathname.startsWith("/dashboard") && payload.role !== "cliente") {
                return NextResponse.redirect(new URL("/perfil", req.url));
            }
            if (req.nextUrl.pathname.startsWith("/admin") && payload.role !== "admin") {
                return NextResponse.redirect(new URL("/perfil", req.url));
            }
        }
    } catch {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.delete("token");
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/perfil/:path*"],
};
