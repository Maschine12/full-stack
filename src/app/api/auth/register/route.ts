import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
    await connectDB();
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
        return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ message: "El correo ya está registrado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword, role });

    try {
        await newUser.save();

        // Crear token JWT
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
        });

        return NextResponse.json({
            message: "Registro exitoso",
            token,  // El frontend debe almacenar este token
            user: { id: newUser._id, email: newUser.email, role: newUser.role },
        });
    } catch (error) {
        return NextResponse.json({ message: "Error al registrar usuario" }, { status: 500 });
    }
}
