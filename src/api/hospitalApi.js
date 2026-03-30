import axiosInstance from './axiosInstance';

export const getDashboardStats  = ()   => axiosInstance.get('/admin/dashboard');
export const getAllUsers         = ()   => axiosInstance.get('/admin/users');
export const deactivateUser     = (id) => axiosInstance.put(`/admin/users/${id}/deactivate`);
export const verifyHospital     = (id) => axiosInstance.put(`/admin/hospitals/${id}/verify`);
export const getAllRequests      = (status) => axiosInstance.get('/admin/requests', { params: { status } });
export const completeOffer      = (id) => axiosInstance.put(`/admin/offers/${id}/complete`);
export const getMyInventory = () => {
  return axiosInstance.get("/hospital/inventory");
};

export const updateInventory = (data) => {
  return axiosInstance.post("/hospital/inventory", data);
};