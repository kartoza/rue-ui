import axios, { type AxiosRequestConfig } from 'axios';

const API_URL: string = import.meta.env.VITE_API_URL;

/**
 * Get authorization headers with Bearer token
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Create axios config with authorization headers
 */
const createConfig = (config?: AxiosRequestConfig): AxiosRequestConfig => {
  return {
    ...config,
    headers: {
      ...getAuthHeaders(),
      ...config?.headers,
    },
  };
};

/**
 * GET request with authorization
 */
export const get = async <T = unknown,>(endpoint: string): Promise<T> => {
  try {
    const response = await axios.get(API_URL + endpoint, createConfig());
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as { detail?: string };
      throw new Error(data.detail || JSON.stringify(data));
    }
    throw new Error('Unknown error');
  }
};

/**
 * POST request with authorization
 */
export const post = async <T = unknown,>(endpoint: string, data?: unknown): Promise<T> => {
  try {
    const response = await axios.post(API_URL + endpoint, data, createConfig());
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as { detail?: string };
      throw new Error(data.detail || JSON.stringify(data));
    }
    throw new Error('Unknown error');
  }
};

/**
 * PUT request with authorization
 */
export const put = async <T = unknown,>(endpoint: string, data?: unknown): Promise<T> => {
  try {
    const response = await axios.put(API_URL + endpoint, data, createConfig());
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as { detail?: string };
      throw new Error(data.detail || JSON.stringify(data));
    }
    throw new Error('Unknown error');
  }
};

/**
 * DELETE request with authorization
 */
export const del = async <T = unknown,>(endpoint: string): Promise<T> => {
  try {
    const response = await axios.delete(API_URL + endpoint, createConfig());
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as { detail?: string };
      throw new Error(data.detail || JSON.stringify(data));
    }
    throw new Error('Unknown error');
  }
};

/**
 * PATCH request with authorization
 */
export const patch = async <T = unknown,>(endpoint: string, data?: unknown): Promise<T> => {
  try {
    const response = await axios.patch(API_URL + endpoint, data, createConfig());
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as { detail?: string };
      throw new Error(data.detail || JSON.stringify(data));
    }
    throw new Error('Unknown error');
  }
};
