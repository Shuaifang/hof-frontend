import { apiClient, apiWithAuth } from '../apiClient';

export const fetchIndexData = async () => {
  try {
    const response = await apiClient.get('/index/indexWeb');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchIntro = async (data: any) => {
  try {
    const response = await apiClient.get('/index/tutorIntro', {
      params: data
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const fetchConfig = async () => {
  try {
    const response = await apiClient.get('/index/skeletonConfig');
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchJobsListData = async (data: any) => {
  try {
    const response = await apiWithAuth({
      url: '/user/jobList',
      method: 'get',
      params: data
    });
    return response;
  } catch (error) {
    throw error;
  }
};
