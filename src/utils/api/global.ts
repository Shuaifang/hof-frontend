import apiClient from '../apiClient';

export const fetchIndexData = async () => {
  try {
    const response = await apiClient.get('/index/indexWeb');
    return response.data;
  } catch (error) {
    throw error;
  }
};
