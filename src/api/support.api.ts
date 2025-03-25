import { axiosInstance } from "@/plugins/axios.plugin";
import { IApiResponse } from "@/types/interfaces";

const BASE_URL = '/api/support';

const request = (method: 'post' | 'get', url: string, data?: any) =>
  axiosInstance[method](url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(response => response.data);

export const supportApi = {
  send: async (data: FormData): Promise<IApiResponse> =>
    request('post', `${BASE_URL}/send`, data),

  getTickets: async (): Promise<IApiResponse> =>
    request('get', `${BASE_URL}/tickets`)
};