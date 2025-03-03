"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    console.log("🟡 Renderizando Dashboard...");
    console.log("🔹 Estado inicial -> isAuthenticated:", isAuthenticated, "User:", user);

    useEffect(() => {
        console.log("🟢 useEffect ejecutado -> isAuthenticated:", isAuthenticated);

        if (!isAuthenticated) {
            console.log("🔴 Usuario no autenticado, redirigiendo a /login...");
            router.push("/login");
        } else {
            console.log("✅ Usuario autenticado:", user);
            setLoading(false);
        }
    }, [isAuthenticated, router, user]);

    if (loading) {
        console.log("⌛ Mostrando pantalla de carga...");
        return <p className="text-xl">Cargando...</p>;
    }

    console.log("✅ Mostrando Dashboard con usuario:", user);

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold">
                Bienvenido, {user?.email || "Usuario"}
            </h2>
            <p className="text-xl">Tu rol: {user?.role || "Desconocido"}</p>
            <button
                onClick={() => {
                    console.log("🔴 Clic en cerrar sesión");
                    logout();
                }}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
                Cerrar sesión
            </button>
        </div>
    );
};

export default Dashboard;
