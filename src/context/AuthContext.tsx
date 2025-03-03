"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

// Definir tipos de usuario y contexto
interface User {
    id: string;
    name: string;
    email: string;
    role: "cliente" | "trabajador" | "admin";
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Componente del contexto de autenticación
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        console.log("🟡 Verificando sesión en /me...");
        fetch("/api/auth/me", {
            credentials: "include", // Asegura que las cookies sean enviadas
        })
            .then(async (response) => {
                if (!response.ok) {
                    console.warn("🔴 No autorizado o sesión expirada");
                    setIsAuthenticated(false);
                    return;
                }
                const data = await response.json();
                console.log("🟢 Usuario autenticado:", data.user);
                setUser(data.user);
                setIsAuthenticated(true);
            })
            .catch((error) => {
                console.error("🚨 Error en /me:", error);
                setIsAuthenticated(false);
            });
    }, []);

    const login = async (email: string, password: string) => {
        console.log("🔵 Iniciando sesión...");
        const response = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
            console.log("🟢 Login exitoso:", data.user);
            setUser(data.user);
            setIsAuthenticated(true);
            router.push("/dashboard"); // Redirigir después del login
        } else {
            console.warn("🔴 Error en login:", data.message);
            alert(data.message || "Error en el inicio de sesión");
        }
    };

    const logout = async () => {
        console.log("🔴 Cerrando sesión...");
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        console.log("✅ Logout exitoso");
        setUser(null);
        setIsAuthenticated(false);
        router.push("/login"); // Redirigir después del logout
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};
