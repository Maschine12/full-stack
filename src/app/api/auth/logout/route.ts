import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: NextRequest) {
    const response = NextResponse.json({ message: "Sesión cerrada correctamente" });

    // Eliminar la cookie del token
    response.cookies.set({
        name: "token",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0, // Expira inmediatamente
        path: "/",
    });

    return response;
}
