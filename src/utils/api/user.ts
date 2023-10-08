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
    const response = await apiWithAuth({
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
    const response = await apiWithAuth({
      method: 'get',
      url: '/job/apply',
      params: data
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getUserAlert = async (data: any) => {
  try {
    const response = await apiWithAuth({
      method: 'get',
      url: '/user/jobAlertConfig',
      params: data
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const setUserAlert = async (data: any) => {
  try {
    const response = await apiWithAuth({
      method: 'get',
      url: '/user/setJobAlertConfig',
      params: data
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const setUserJobStatus = async (data: any) => {
  try {
    const response = await apiWithAuth({
      method: 'get',
      url: '/user/setJobApply',
      params: data
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
