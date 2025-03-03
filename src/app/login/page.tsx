"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await api.post("/api/auth/login", { email, password });
            router.push("/dashboard");
        } catch (err: unknown) {
            let errorMessage = "Error en la autenticación";
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === "object" && err !== null && "response" in err) {
                const errorResponse = err as { response?: { data?: { message?: string } } };
                errorMessage = errorResponse.response?.data?.message || errorMessage;
            }
            setError(errorMessage);
        }
    };
    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center">Iniciar sesión</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
                <button type="submit">Iniciar sesión</button>
            </form>
        </div>
    );
};

export default Login;
