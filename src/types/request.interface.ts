
// ЗАПРОСЫ
export type IRequestCreate = Omit<IRequest, 'id' | 'created_at'>

export type IRequestStatus = 'pending' | 'approved'

// ОТВЕТЫ
export interface IRequest {
    id: number
    user_id: number
    data: {
        type: string
        items: string
        priority: string
    }
    type: string
    status: IRequestStatus
    created_at: string
}