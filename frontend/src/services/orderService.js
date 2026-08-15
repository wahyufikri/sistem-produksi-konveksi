import api from "./api";

const getOrders = async (params = {}) => {
    const response = await api.get("/orders", {
        params,
    });

    return response.data;
};

const getOrder = async (id) => {
    const response = await api.get(`/orders/${id}`);

    return response.data;
};

const createOrder = async (data) => {
    const response = await api.post("/orders", data);

    return response.data;
};

const updateOrder = async (id, data) => {
    const response = await api.put(
        `/orders/${id}`,
        data
    );

    return response.data;
};

const deleteOrder = async (id) => {
    const response = await api.delete(
        `/orders/${id}`
    );

    return response.data;
};

export default {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
};