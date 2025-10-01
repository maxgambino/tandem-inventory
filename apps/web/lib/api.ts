import axios, { AxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function apiFetcher<T = any>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response = await API({
      url,
      method: options.method || "GET",
      ...options,
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error?.response || error.message);
    throw error;
  }
}

export default API;