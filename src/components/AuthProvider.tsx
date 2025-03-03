"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
        console.log("Token detectado en el cliente:", token);

        if (token) {
            fetch("/api/auth/me", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Datos de /me:", data);
                    if (data.user) {
                        setUser(data.user);
                        setIsAuthenticated(true);
                    }
                })
                .catch((err) => {
                    console.error("Error en /me:", err);
                    setIsAuthenticated(false);
                });
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        console.log("Datos recibidos en login:", data);

        if (response.ok) {
            setUser(data.user);
            setIsAuthenticated(true);

            // Esperar un pequeño tiempo para que el token en la cookie esté disponible
            setTimeout(() => {
                if (data.user.role === "cliente") {
                    router.push("/dashboard");
                } else if (data.user.role === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/perfil");w
                }
            }, 100);
        } else {
            alert(data.message || "Error en el inicio de sesión");
        }
    };

    const logout = () => {
        fetch("/api/auth/logout", {
            method: "POST",
        }).then(() => {
            setUser(null);
            setIsAuthenticated(false);
            router.push("/login");
        });
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};
