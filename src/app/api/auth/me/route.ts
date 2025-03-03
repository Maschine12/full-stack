import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";  // Usar jose en lugar de jsonwebtoken
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
    await connectDB();

    // Obtener el token desde las cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    try {
        // Verificar token con jose
        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);  // Codificar la clave secreta
        const { payload } = await jwtVerify(token, secretKey);
        const user = await User.findById(payload.id).select("-password");

        if (!user) {
            return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json(
            { message: "Token inválido", error: error instanceof Error ? error.message : String(error) },
            { status: 401 }
        );
    }
}
