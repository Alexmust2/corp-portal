import { axiosInstance } from "@/plugins/axios.plugin";
import { IApiResponse } from "@/types/interfaces";
import { ISubscribeCreate, ISubscribeGet, ISubscribeNotify } from "@/types/subscribe.interface";

const request = (method: 'get' | 'post' | 'put', url: string, data?: any) =>
    axiosInstance[method](url, data).then(response => response.data)

export const subscribeApi = {
    getSubcribers: async (): Promise<ISubscribeGet> =>
        request('get', '/api/subscribers')
            .then(response => response.subscribers),

    subscribe: async (data: ISubscribeCreate): Promise<IApiResponse> =>
        request('post', '/api/subscribe', data),

    notifiy: async (data: ISubscribeNotify): Promise<IApiResponse> =>
        request('post', '/api/notify', data),

    // unsubscribe: async () => { }
}