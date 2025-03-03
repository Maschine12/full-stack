import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
    await connectDB();
    const {email, password, role } = await req.json();

    // Validación básica
    if (!email || !password || !role) {
        return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // Comprobar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ message: "El correo ya está registrado" }, { status: 400 });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({
        email,
        password: hashedPassword,
        role,
    });

    try {
        await newUser.save();

        // Crear token JWT
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
        });

        const response = NextResponse.json({
            message: "Registro exitoso",
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
        });

        // Configurar la cookie
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600, // 1 hora
            path: "/",
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { message: "Error al registrar usuario", error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }

}
