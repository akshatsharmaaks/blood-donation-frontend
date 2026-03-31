import axiosInstance from './axiosInstance';

export const registerHospital = (data) => axiosInstance.post('/hospital/register', data);
export const getMyHospital     = ()     => axiosInstance.get('/hospital/profile');
export const getAllHospitals   = ()     => axiosInstance.get('/hospital/all'); // Missing export added
export const getReceiverRequests = ()   => axiosInstance.get('/hospital/receiver-requests');
export const fulfillRequest      = (id) => axiosInstance.put(`/hospital/receiver-requests/${id}/fulfill`);
export const getMyInventory = () => axiosInstance.get("/hospital/inventory");
export const updateInventory = (data) => axiosInstance.post("/hospital/inventory", data);