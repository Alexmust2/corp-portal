import { axiosInstance } from "@/plugins/axios.plugin";
import { IApiId, IApiResponse } from "@/types/interfaces";

import { IPermission, IPermissionCreate, IPermissionCreateResponse } from "@/types/permission.interface";

const BASE_URL = '/api/permissions'

const request = (method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any) =>
    axiosInstance[method](url, data).then(response => response.data)

export const permissionApi = {
    // Получить список всех разрешений
    getAll: async (): Promise<IPermission[]> =>
        request('get', BASE_URL)
            .then(response => response.permissions),

    // Создать новое разрешение
    create: async (name: string, description: string): Promise<IPermissionCreateResponse> => {
        const data: IPermissionCreate = { name, description }
        return request('post', BASE_URL, data)
    },

    // Удалить разрешение
    delete: async (id: IApiId): Promise<IApiResponse> =>
        request('delete', `${BASE_URL}/${id}`)
} 