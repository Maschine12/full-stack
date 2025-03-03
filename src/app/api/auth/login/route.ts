import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";  // Usar jose en lugar de jsonwebtoken
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        console.log("Conectando a la base de datos...");
        await connectDB();
        console.log("Base de datos conectada.");

        // Obtener los datos enviados en la solicitud
        const { email, password } = await req.json();
        console.log("Datos recibidos:", { email, password });

        // Validar que se hayan proporcionado ambos campos
        if (!email || !password) {
            console.log("Faltan campos:", { email, password });
            return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 });
        }

        // Buscar usuario en la base de datos
        console.log("Buscando usuario con email:", email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Usuario no encontrado con email:", email);
            return NextResponse.json({ message: "Credenciales incorrectas" }, { status: 401 });
        }

        console.log("Usuario encontrado:", user);

        // Comparar la contraseña proporcionada con el hash almacenado
        console.log("Comparando contraseña...");
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log("Contraseña incorrecta para el usuario:", email);
            return NextResponse.json({ message: "Credenciales incorrectas" }, { status: 401 });
        }

        console.log("Contraseña correcta para el usuario:", email);

        // Generar el token JWT con jose
        console.log("Generando token JWT...");
        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET); // Se codifica la clave secreta
        const token = await new SignJWT({ id: user._id, role: user.role })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(secretKey);

        console.log("Token generado:", token);

        // Preparar la respuesta y establecer la cookie con el token
        const response = NextResponse.json({
            message: "Inicio de sesión exitoso",
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });

        console.log("Configurando cookie de sesión...");
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  // Asegurarse de que esté segura en producción
            maxAge: 3600,  // 1 hora
            path: "/",
        });

        console.log("Respuesta preparada y cookie configurada.");
        return response;

    } catch (error) {
        // Manejo de errores inesperados
        console.error("Error en el proceso de autenticación:", error);
        return NextResponse.json({ message: "Error en el servidor" }, { status: 500 });
    }
}
