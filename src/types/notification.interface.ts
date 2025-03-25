import { IApiId, IApiStatus } from "./interfaces"

// ЗАПРОСЫ
export interface INotificationCreate extends Pick<INotification, 'title' | 'message' | 'link' | 'status' | 'tag' | 'icon'> {
    recipients: string[]
}

export interface INotificationRead {
    notificationIds: string[]
    userId: IApiId
}


// ОТВЕТЫ
export interface INotification {
    id: number
    title: string
    message: string
    link: string
    tag: string
    created_at: string
    status: "info" | "success" | "warning" | "error" | "default"
    icon: string
    read_status: boolean
}

export interface INotificationGetTags {
    tags: string[]
}

export interface INotificationUnread extends IApiStatus {
    unreadCount: number
}