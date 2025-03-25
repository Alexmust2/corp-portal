import { axiosInstance } from "@/plugins/axios.plugin";
import { IApiId, IApiResponse } from "@/types/interfaces";
import { INotification, INotificationCreate, INotificationGetTags, INotificationRead, INotificationUnread } from "@/types/notification.interface";

const BASE_URL = '/api/notifications'

const request = (method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any) =>
    axiosInstance[method](url, data).then(response => response.data)

export const notificationApi = {
    getAll: async (): Promise<INotification> =>
        request('get', `${BASE_URL}`)
            .then(response => response.notificationsList),

    getTags: async (): Promise<INotificationGetTags> =>
        request('get', `${BASE_URL}/tags`)
            .then(response => response.tags),

    subscribe: async (data: any): Promise<IApiResponse> =>
        request('post', `${BASE_URL}/subscribe`, data),

    notify: async (data: any): Promise<IApiResponse> =>
        request('post', `${BASE_URL}/notify`, data),

    unsubscribe: async (data: any): Promise<IApiResponse> =>
        request('put', `${BASE_URL}/unsubscribe`, data),

    getUnread: async (): Promise<INotificationUnread> =>
        request('get', `${BASE_URL}/unreaded`),

    create: async (data: INotificationCreate): Promise<IApiResponse> =>
        request('post', `${BASE_URL}/create`, data),

    read: async (notificationIds: string[]): Promise<IApiResponse> =>
        request('put', `${BASE_URL}/read`, notificationIds),

    readAll: async (): Promise<IApiResponse> =>
        request('put', `${BASE_URL}/read/all`)
} 