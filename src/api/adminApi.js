import axiosInstance from "./axiosInstance";

export const getDashboardStats = () => {
    return axiosInstance.get("/admin/dashboard");
};

export const getAllUsers = () => {
    return axiosInstance.get("/admin/users");
};

export const getAllRequests = () => {
    return axiosInstance.get("/admin/requests");
};

export const verifyHospital = (id) => {
    return axiosInstance.put(`/admin/hospitals/${id}/verify`);
};