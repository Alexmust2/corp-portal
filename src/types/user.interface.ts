import { IApiResponse } from "./interfaces";
import { IPermissionWithAllowDeny } from "./permission.interface";
import { IRole } from "./role.interface";

// get all
export interface IUserResponse extends IUser { }

// get by ids
export interface IUserGetByIds {
    usersIds: number[]
}
export interface IUserGetByIdResponse extends IUser {
    password: string
}

// update photo
export interface IUserUpdatePhotoResponse extends IApiResponse {
    photo_path: string
}

// update password
export type IUserUpdatePassword = string

// update profile
export interface IUserUpdateProfile {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    photo_path?: string;
}

export interface IUserUpdateProfileResponse extends IApiResponse {
    user: Omit<IUserGetByIdResponse, 'roles' | 'permissions'>
}


// atach role
export interface IUserRoleResponse extends IApiResponse {
    data: {
        userId: string
        roleId: number
        created: boolean
        userRole: {
            user_id: number
            role_id: number
        }
    }
}

interface IUser {
    id: number;
    full_name: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    phone_number: string;
    email: string | null;
    department: string | null;
    avatar: { id: number, file_path: string } | null,
    color: string | null;
    activity: {
        status: boolean,
        updated_at: string,
        deleted_at: string | null
    } | null,
    roles: IRole;
    // TODO : change to IPermission
    permissions: IPermissionWithAllowDeny[];
}