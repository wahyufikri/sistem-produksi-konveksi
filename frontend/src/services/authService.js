import api from "./api";

const login = async (email, password) => {
    const response = await api.post("/login", {
        email,
        password,
    });

    return response.data;
};

const logout = async () => {
    const response = await api.post("/logout");

    return response.data;
};

const getMe = async () => {
    const response = await api.get("/me");

    return response.data;
};

export default {
    login,
    logout,
    getMe,
};