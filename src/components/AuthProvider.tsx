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
        const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
        if (token) {
            fetch("/api/auth/me", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.user) {
                        setUser(data.user);
                        setIsAuthenticated(true);
                    }
                })
                .catch(() => {
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
        if (response.ok) {
            setUser(data.user);
            setIsAuthenticated(true);
            router.push("/dashboard"); // Redirigir después del login
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
            router.push("/login"); // Redirigir después del logout
        });
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
