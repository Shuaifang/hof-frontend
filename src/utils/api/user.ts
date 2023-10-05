import apiClient from '../apiClient';

export const loginGoogle = async (data: any) => {
  try {
    const response = await apiClient.post('/login/loginGoogle', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
