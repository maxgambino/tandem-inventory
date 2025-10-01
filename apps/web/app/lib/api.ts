// apps/web/app/lib/api.ts
import axios, { AxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

export async function apiFetcher<T = any>(url: string, options: AxiosRequestConfig = {}) {
  const res = await API({ url, method: options.method || "GET", ...options });
  return res.data;
}

export default API;
