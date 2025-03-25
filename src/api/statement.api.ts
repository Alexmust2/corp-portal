import { axiosInstance } from "@/plugins/axios.plugin";
import { IApiId, IApiResponse } from "@/types/interfaces";
import { IRequest, IRequestCreate, IRequestStatus } from "@/types/request.interface";

const BASE_URL = '/api/statements'

const request = (method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any) =>
  axiosInstance[method](url, data).then(response => response.data)

// Заявки
export const statementApi = {
  getAllStatements: async (): Promise<IRequest[]> =>
    request('get', BASE_URL).then(response => response.parsedData),

  getUserStatements: async (id: IApiId): Promise<IRequest[]> =>
    request('get', `${BASE_URL}/${id}`)
      .then(response => response.requests),

  create: async (data: IRequestCreate): Promise<IApiResponse> =>
    request('post', BASE_URL, data),

  updateStatementStatus: async (id: IApiId, status: IRequestStatus, comment: string): Promise<IApiResponse> =>
    request('put', `${BASE_URL}/${id}/status`, { status, comment }),

  delete: async (id: IApiId): Promise<IApiResponse> =>
    request('delete', `${BASE_URL}/${id}`),
  
  update: async (id: IApiId, data: IRequestCreate): Promise<IApiResponse> =>
    request('put', `${BASE_URL}/${id}`, data),
}