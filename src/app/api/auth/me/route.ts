import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    await connectDB();

    // Obtener el token de la cookie
    const token = (await cookies()).get("token")?.value;
    console.log("🟡 Token recibido en /me:", token);

    if (!token) {
        console.log("🔴 No hay token en la cookie");
        return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    try {
        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secretKey);
        console.log("🟢 Token decodificado con éxito:", payload);

        const user = await User.findById(payload.id).select("-password");
        console.log("🔍 Usuario encontrado en la BD:", user);

        if (!user) {
            console.log("🔴 Usuario no encontrado en la BD");
            return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("🚨 Error verificando token en /me:", error);
        return NextResponse.json({
            message: "Token inválido",
            error: error instanceof Error ? error.message : String(error)
        }, { status: 401 });
    }
}
