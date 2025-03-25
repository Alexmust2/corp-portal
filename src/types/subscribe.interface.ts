import { IApiResponse } from "./interfaces"

export interface ISubscribeGet extends IApiResponse { }

export interface ISubscribeCreate extends Omit<ISubscribe, 'id'> { }

export interface ISubscribeNotify {
    title: string
    message: string
    targetUserId: number[]
}




interface ISubscribe {
    id: number
    user_id: number
    device_type: number
    subscription: {
        endpoint: string
        keys: {
            p256dh: string
            auth: string
        }
    }
}