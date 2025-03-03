"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) router.push("/login");
    }, [user, router]);

    if (!user) return <p className="text-xl">Cargando...</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold">Bienvenido, {user.email}</h2>
            <p className="text-xl">Tu rol: {user.role}</p>
            <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                Cerrar sesión
            </button>
        </div>
    );
};

export default Dashboard;
