import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "Credenciales incorrectas" }, { status: 401 });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ message: "Credenciales incorrectas" }, { status: 401 });
        }

        // Generar token JWT
        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({ id: user._id.toString(), role: user.role })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(secretKey);

        return NextResponse.json({
            message: "Inicio de sesión exitoso",
            token,
            user: { id: user._id.toString(), email: user.email, role: user.role },
        });

    } catch (error) {
        console.error("Error en el login:", error);
        return NextResponse.json({ message: "Error en el servidor" }, { status: 500 });
    }
}
