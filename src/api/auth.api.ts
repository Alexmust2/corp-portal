import { axiosInstance } from "@/plugins/axios.plugin"
import { IAuthLogin, IAuthRequestOtp, AuthTokenProps, IAuthToken, IAuthVerifyOtp, IAuthLoginResponse, IAuthVerifyOtpResponse } from "@/types/auth.interface"
import { IApiResponse } from "@/types/interfaces"
import { IUserResponse } from "@/types/user.interface"

const BASE_URL = '/api/auth'

const request = (method: 'post', url: string, data?: any) =>
  axiosInstance[method](url, data).then(response => response.data)

export const authApi = {
  login: async (phone: string, password: string): Promise<IAuthLoginResponse> => {
    const data: IAuthLogin = { phone, password };
    return request('post', `${BASE_URL}/login`, data)
  },

  getUserByToken: async (token: AuthTokenProps): Promise<IUserResponse> => {
    const data: IAuthToken = { token };
    return request('post', `${BASE_URL}/user`, data).then(response => response.user);
  },

  requestOtp: async (phone: string, step: 'restore' | 'register'): Promise<IApiResponse> => {
    const data: IAuthRequestOtp = { phone, step };
    return request('post', `${BASE_URL}/request-otp`, data);
  },

  verifyOtp: async (phone: string, otp: string): Promise<IAuthVerifyOtpResponse> => {
    const data: IAuthVerifyOtp = { phone, otp };
    return request('post', `${BASE_URL}/verify-otp`, data);
  },
};
