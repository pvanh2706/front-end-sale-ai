import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/common'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

/**
 * Wrap an axios call in ApiResponse<T> shape.
 * Usage:
 *   const result = await get<User[]>('/users')
 *   if (result.isSuccess) console.log(result.data)
 */
export async function get<T>(url: string, params?: object): Promise<ApiResponse<T>> {
  try {
    const { data } = await api.get<T>(url, { params })
    return { isSuccess: true, data }
  } catch (e: unknown) {
    return { isSuccess: false, error: getErrorMessage(e) }
  }
}

export async function post<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
  try {
    const { data } = await api.post<T>(url, body)
    return { isSuccess: true, data }
  } catch (e: unknown) {
    return { isSuccess: false, error: getErrorMessage(e) }
  }
}

export async function put<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
  try {
    const { data } = await api.put<T>(url, body)
    return { isSuccess: true, data }
  } catch (e: unknown) {
    return { isSuccess: false, error: getErrorMessage(e) }
  }
}

export async function del<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const { data } = await api.delete<T>(url)
    return { isSuccess: true, data }
  } catch (e: unknown) {
    return { isSuccess: false, error: getErrorMessage(e) }
  }
}

function getErrorMessage(e: unknown): string {
  if (axios.isAxiosError(e)) {
    return (e.response?.data as { message?: string })?.message ?? e.message
  }
  return 'Unknown error'
}

export default api
