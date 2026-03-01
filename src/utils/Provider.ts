import { Axios } from '@/lib/api';
import { userLogout } from '@/lib/auth';
import { useAuthStore } from '@/store/AuthStore';
import { ResponseType } from '@/types/types';
import type {
  AxiosError,
  ResponseType as AxiosResponseType,
} from 'axios';

const requestSubmit = async <T = unknown>({
  method,
  requestedUrl,
  controller,
  formData,
  contentType = 'application/json',
  params,
  accept,
  responseType = 'json',
}: {
  method: string;
  requestedUrl: string;
  controller: AbortController;
  formData?: FormData | Record<string, unknown>;
  contentType?: string;
  params?: Record<string, unknown>;
  responseType?: AxiosResponseType;
  accept?: string;
}): Promise<ResponseType<T>> => {
  const signal = controller.signal;

  try {
    // Token for authorization
    const token = localStorage.getItem("token") 
    || useAuthStore.getState().authData?.token || null;

    const config = {
      params,
      headers: {
        'Content-Type': contentType,
        ...(accept && { Accept: accept }),
        ...(token && { Authorization: `Bearer ${token}` })
      },
      signal,
      responseType,
    };

    let res;

    switch (method.toLowerCase()) {
      case 'get':
        res = await Axios.get(requestedUrl, config);
        break;
      case 'post':
        res = await Axios.post(requestedUrl, formData, config);
        break;
      case 'put':
        res = await Axios.put(requestedUrl, formData, config);
        break;
      case 'delete':
        res = await Axios.delete(requestedUrl, config);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return {
      status: res?.status || 200,
      data: res?.data as T,
      err: null as unknown as AxiosError,
      headers: res?.headers,
    };
  } catch (err) {
    if (err.response?.data?.message === "Access Denied") {
      userLogout();
      return null;
    }
    return {
      status: 400,
      data: null as unknown as T,
      err: err as AxiosError,
    };
  }
};

export { requestSubmit };
