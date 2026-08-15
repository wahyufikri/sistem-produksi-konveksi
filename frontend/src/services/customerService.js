import api from "./api";

const getCustomers = async (params = {}) => {
    const response = await api.get("/customers", {
        params,
    });

    return response.data;
};

const getCustomer = async (id) => {
    const response = await api.get(`/customers/${id}`);

    return response.data;
};

const createCustomer = async (data) => {
    const response = await api.post("/customers", data);

    return response.data;
};

const updateCustomer = async (id, data) => {
    const response = await api.put(
        `/customers/${id}`,
        data
    );

    return response.data;
};

const deleteCustomer = async (id) => {
    const response = await api.delete(
        `/customers/${id}`
    );

    return response.data;
};

export default {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};