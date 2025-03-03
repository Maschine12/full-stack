import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    try {
        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secretKey);

        const newToken = await new SignJWT({ id: payload.id, role: payload.role })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(secretKey);

        (await cookies()).set("token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600,
            path: "/",
        });

        return NextResponse.json({ message: "Token refrescado" });
    } catch (error) {
        return NextResponse.json({
            message: "Token inválido",
            error: error instanceof Error ? error.message : String(error)
        }, { status: 401 });
    }

}
