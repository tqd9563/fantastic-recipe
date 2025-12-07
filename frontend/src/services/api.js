import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getRecipes = async (skip = 0, limit = 100) => {
  const response = await api.get(`/recipes?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const getRecipe = async (id) => {
  const response = await api.get(`/recipes/${id}`);
  return response.data;
};

export const createRecipe = async (formData) => {
  const response = await api.post('/recipes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateRecipe = async (id, formData) => {
  const response = await api.put(`/recipes/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteRecipe = async (id) => {
  const response = await api.delete(`/recipes/${id}`);
  return response.data;
};

export const getPlans = async (startDate, endDate) => {
  const response = await api.get(`/plans?start_date=${startDate}&end_date=${endDate}`);
  return response.data;
};

export const createPlan = async (planData) => {
  const response = await api.post('/plans', planData);
  return response.data;
};

export const deletePlan = async (id) => {
  const response = await api.delete(`/plans/${id}`);
  return response.data;
};

export const generatePlan = async (days = 7) => {
  const response = await api.post(`/plans/generate?days=${days}`);
  return response.data;
};

export default api;

