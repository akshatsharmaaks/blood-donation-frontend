import axiosInstance from './axiosInstance';

export const createBloodRequest  = (data) => axiosInstance.post('/receiver/request', data);
export const getMyRequests       = ()     => axiosInstance.get('/receiver/requests');
export const getRequestById      = (id)   => axiosInstance.get(`/receiver/requests/${id}`);
export const cancelRequest       = (id)   => axiosInstance.put(`/receiver/requests/${id}/cancel`);
export const getMatchedDonors    = (id)   => axiosInstance.get(`/receiver/requests/${id}/matched-donors`);
export const getOffersForRequest = (id)   => axiosInstance.get(`/receiver/requests/${id}/offers`);
export const acceptOffer         = (id)   => axiosInstance.put(`/receiver/offers/${id}/accept`);
export const rejectOffer         = (id)   => axiosInstance.put(`/receiver/offers/${id}/reject`);