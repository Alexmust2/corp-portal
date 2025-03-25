import { axiosInstance } from "@/plugins/axios.plugin";
import { IApiResponse } from "@/types/interfaces";

const NOTIFICATION_SETTINGS_URL = '/api/notifications/settings'
const USER_SETTINGS_URL = '/api/user/settings'

const request = (method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any) =>
    axiosInstance[method](url, data).then(response => response.data)

export const settingsApi = {
    getNotificationSettingsByType: async (type: string): Promise<any> =>
        request('get', `${NOTIFICATION_SETTINGS_URL}/${type}`),

    updateNotificationSettings: async (data: any): Promise<IApiResponse> =>
        request('put', NOTIFICATION_SETTINGS_URL, data),

    updateUserSettings: async (data: any): Promise<IApiResponse> =>
        request('put', USER_SETTINGS_URL, data),
}
