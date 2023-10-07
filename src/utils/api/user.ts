import { apiClient,apiWithAuth } from '../apiClient';

export const loginGoogle = async (data: any) => {
  try {
    const response = await apiClient.post('/login/loginGoogle', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const setJobFeedback = async (data: any) => {
  try {
    const response = await apiClient({
      method: 'post',
      url: '/job/feedback',
      params: data
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const setApplyJob = async (data: any) => {
  try {
    const response = await apiClient({
      method: 'get',
      url: '/job/apply',
      params: data
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
