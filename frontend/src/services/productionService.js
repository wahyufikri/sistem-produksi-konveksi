import api from "./api";

const getProductionOrders = async (params = {}) => {
    const response = await api.get("/production/orders", {
        params,
    });

    return response.data;
};

const getProductionDetail = async (orderItemId) => {
    const response = await api.get(
        `/production/order-items/${orderItemId}`
    );

    return response.data;
};

const updateProductionProgress = async (
    orderItemId,
    data
) => {
    const response = await api.put(
        `/production/order-items/${orderItemId}`,
        data
    );

    return response.data;
};

const getProductionHistory = async (orderItemId) => {
    const response = await api.get(
        `/production/order-items/${orderItemId}/history`
    );

    return response.data;
};

const reworkProduction = async (
    orderItemId,
    data
) => {
    const response = await api.post(
        `/production/order-items/${orderItemId}/rework`,
        data
    );

    return response.data;
};

const processRework = async (
    orderItemId,
    data
) => {
    const response = await api.post(
        `/production/order-items/${orderItemId}/rework/process`,
        data
    );

    return response.data;
};

export default {
    getProductionOrders,
    getProductionDetail,
    updateProductionProgress,
    getProductionHistory,
    reworkProduction,
    processRework,
};