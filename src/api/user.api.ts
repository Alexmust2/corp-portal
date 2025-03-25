import { axiosInstance } from "@/plugins/axios.plugin";
import { IApiId, IApiResponse } from "@/types/interfaces";
import {
  IPermissionUpdate,
  IPermissionWithAllowDeny,
} from "@/types/permission.interface";
import {
  IUserGetByIds,
  IUserGetByIdResponse,
  IUserResponse,
  IUserRoleResponse,
  IUserUpdatePassword,
  IUserUpdateProfile,
  IUserUpdatePhotoResponse,
  IUserUpdateProfileResponse,
} from "@/types/user.interface";

const BASE_URL = "/api/users";

const request = (
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any
) => axiosInstance[method](url, data).then((response) => response.data);

export const userApi = {
  getAll: async (params?: Record<string, any>): Promise<IUserResponse[]> => {
    let url = BASE_URL;
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }
    return request("get", url);
  },
  
  sync: async (): Promise<String> => request("get", `${BASE_URL}/sync`),

  getByIds: async (userIds: IUserGetByIds): Promise<IUserGetByIdResponse[]> => {
    const response = await request("post", BASE_URL, userIds);
    return response.map((user: any) => ({
      ...user,
      photo: process.env.VUE_APP_API_URL + "/api" + user.photo_path,
    }));
  },

  updatePassword: async (
    oldPassword: string,
    newPassword: string
  ): Promise<IApiResponse> =>
    request("put", `${BASE_URL}/updatePassword`, { oldPassword, newPassword }),

  updateProfile: async (
    formData: object
  ): Promise<IUserUpdateProfileResponse> =>
    request("put", `${BASE_URL}`, formData).then((response) => response.user),

  updatePhoto: async (
    userId: IApiId,
    file: File
  ): Promise<IUserUpdatePhotoResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await request(
      "put",
      `${BASE_URL}/${userId}/photo`,
      formData
    );
    return response;
  },

  changePassword: async (
    password: IUserUpdatePassword
  ): Promise<IApiResponse> =>
    request("put", `${BASE_URL}/changePassword`, { password }),

  delete: async (userId: IApiId): Promise<IApiResponse> =>
    request("delete", `${BASE_URL}/${userId}`),

  getPermissions: async (userId: IApiId): Promise<IPermissionWithAllowDeny[]> =>
    request("get", `${BASE_URL}/${userId}/permissions`).then(
      (response) => response.allPermissions
    ),

  updatePermission: async (
    userId: IApiId,
    perm_id: number,
    allow_deny: boolean
  ): Promise<IApiResponse> => {
    const data: IPermissionUpdate = { perm_id, allow_deny };
    return request("put", `${BASE_URL}/${userId}/permissions`, data);
  },

  // updateUserProfile: async (userId: IApiId, formData: IUserUpdateProfile): Promise<IUserUpdateProfileResponse> =>
  //     request('put', `${BASE_URL}/${userId}`, formData)
  //         .then(response => response.user),

  attachRole: async (
    userId: IApiId,
    roleId: number
  ): Promise<IUserRoleResponse> =>
    request("post", `${BASE_URL}/${userId}/role`, { roleId }),

  attachPermissions: async (
    userId: IApiId,
    permissions: string | string[],
    allow_deny: boolean
  ): Promise<IApiResponse> => {
    const data = {
      permissions: Array.isArray(permissions) ? permissions : [permissions],
      allow_deny,
    };
    return request("post", `${BASE_URL}/${userId}/permissions`, data);
  },
  detachPermissions: async (
    userId: IApiId,
    data: number[]
  ): Promise<IApiResponse> =>
    request("delete", `${BASE_URL}/${userId}/permissions`, { data: data }),
};
