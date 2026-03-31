import axiosInstance from "./axiosInstance";

export const getDashboardStats = () => axiosInstance.get("/admin/dashboard");
export const getAllUsers        = () => axiosInstance.get("/admin/users");

// Fixed: Added status parameter
export const getAllRequests = (status) => {
    return axiosInstance.get("/admin/requests", { params: { status } });
};

export const verifyHospital = (id)   => axiosInstance.put(`/admin/hospitals/${id}/verify`);
export const deactivateUser = (id)   => axiosInstance.put(`/admin/users/${id}/deactivate`);
export const completeOffer  = (id)   => axiosInstance.put(`/admin/offers/${id}/complete`);