import axiosInstance from './axiosInstance';

export const createDonorProfile  = (data)   => axiosInstance.post('/donor/profile', data);
export const updateDonorProfile  = (data)   => axiosInstance.put('/donor/profile', data);
export const getMyDonorProfile   = ()       => axiosInstance.get('/donor/profile');
export const searchDonors        = (params) => axiosInstance.get('/donor/search', { params });
export const getDonorEligibility = ()       => axiosInstance.get('/donor/eligibility');
export const recordDonation      = (data)   => axiosInstance.post('/donor/donation-history', data);
export const getDonationHistory  = ()       => axiosInstance.get('/donor/donation-history');
export const createDonorOffer    = (data)   => axiosInstance.post('/donor/offer', data);
export const getMyOffers         = ()       => axiosInstance.get('/donor/offers');
export const withdrawOffer       = (id)     => axiosInstance.put(`/donor/offers/${id}/withdraw`);
export const getOpenOffers       = ()       => axiosInstance.get('/donor/offers/open');