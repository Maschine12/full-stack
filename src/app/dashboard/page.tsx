"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Dashboard = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router])

    return (
        <div>
            <h2 className="text-xl">Bienvenido, {user?.email}</h2>
            <p className="text-xl" >Tu rol: {user?.role}</p>
            <button onClick={logout}>Cerrar sesión</button>
        </div>
    );
};

export default Dashboard;
