import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        authService
            .getMe()
            .then((response) => {
                setUser(response.data);
            })
            .catch(() => {
                localStorage.removeItem("token");
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const login = async (email, password) => {
        const response = await authService.login(
            email,
            password
        );

        localStorage.setItem(
            "token",
            response.token
        );

        setUser(response.user);

        return response;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error(error);
        }

        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}