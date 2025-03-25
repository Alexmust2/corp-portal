import { IApiResponse, IApiStatus } from "./interfaces"
import { IUserResponse } from "./user.interface"

// ЗАПРОСЫ
export interface IAuthLogin {
    phone: string
    password: string,
}

export type AuthTokenProps = string | null;

export interface IAuthToken {
    token: AuthTokenProps,
};

export interface IAuthRequestOtp {
    phone: string,
    step: 'restore' | 'register'
}

export interface IAuthVerifyOtp {
    phone: string
    otp: string
}

// ОТВЕТЫ

export interface IAuthLoginResponse extends IApiResponse {
    token: AuthTokenProps,
    user: IUserResponse
}
export interface IAuthVerifyOtpResponse extends IApiStatus {
    token: AuthTokenProps
    user: IUserResponse
}