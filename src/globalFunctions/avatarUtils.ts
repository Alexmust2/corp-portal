import { IUserResponse } from "@/types/user.interface";

export function getAvatarProps(user: IUserResponse | any) {
    return {
        userId: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        photo_path: user.photo || (user.avatar ? user.avatar.file_path : null) || user.file_path,
        activity_status: user.activity_status || (user.activity ? user.activity.status : null)
    }
}