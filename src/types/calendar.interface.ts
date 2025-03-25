// ЗАПРОСЫ
export interface ICalendarEvent extends IBaseCalendar {
    time: {
        start: string
        end: string
    }
    room: {
        id: number,
        name: string,
        color: string
    }
}

// ОВЕТЫ
export interface ICalendar extends IBaseCalendar {
    id: number
    start_time: string
    end_time: string
    room: number
}

interface IBaseCalendar {
    title: string
    user_ids: number[]
    description: string

    creator_id: number
}