import { axiosInstance } from "@/plugins/axios.plugin";
import { IArticleWithSummary, IArticleCreateResponse, IArticleData, IArticleMetadata, IArticleWithContent } from "@/types/article.interface";
import { IApiId, IApiResponse } from "@/types/interfaces";

const BASE_URL = '/api/articles'

const request = (method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any) =>
  axiosInstance[method](url, data).then(response => response.data)

export const articleApi = {
  getAll: async (): Promise<IArticleWithSummary[]> =>
    request('get', BASE_URL),

  getById: async (id: IApiId): Promise<IArticleWithContent> =>
    request('get', `${BASE_URL}/${id}`),

  getCategoriesAndTags: async (): Promise<IArticleMetadata> =>
    request('get', `${BASE_URL}/metadata`),

  create: async (data: IArticleData): Promise<IArticleCreateResponse> =>
    request('post', BASE_URL, data),

  update: async (id: IApiId, data: IArticleData): Promise<IArticleWithSummary> =>
    request('put', `${BASE_URL}/${id}`, data),

  like: async (id: IApiId): Promise<IApiResponse> =>
    request('post', `${BASE_URL}/${id}/like`),

  delete: async (id: IApiId): Promise<IApiResponse> =>
    request('delete', `${BASE_URL}/${id}`)
}