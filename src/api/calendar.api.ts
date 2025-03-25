import { axiosInstance } from "@/plugins/axios.plugin";
import { ICalendar, ICalendarEvent } from "@/types/calendar.interface";
import { IApiId, IApiResponse } from "@/types/interfaces";

const BASE_URL = '/api/calendar/events'

const request = (method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any) =>
    axiosInstance[method](url, data).then(response => response.data)

export const calendarApi = {
    getAll: async (): Promise<ICalendar[]> =>
        request('get', BASE_URL),

    create: async (event: ICalendarEvent): Promise<ICalendar> =>
        request('post', BASE_URL, event)
            .then(response => response.event),

    update: async (id: IApiId, event: ICalendarEvent): Promise<IApiResponse> =>
        request('put', `${BASE_URL}/${id}`, event),

    delete: async (id: IApiId): Promise<IApiResponse> =>
        request('delete', `${BASE_URL}/${id}`),
}
