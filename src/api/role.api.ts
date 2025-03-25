import { axiosInstance } from "@/plugins/axios.plugin";
import { IApiId, IApiResponse } from "@/types/interfaces";
import {
  IRole,
  IRoleCreate,
  IRoleCreateResponse,
  IRoleGetAll,
  IRoleGetById,
  IRoleWithDetails,
} from "@/types/role.interface";

const BASE_URL = "/api/roles";

const request = (
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any
) => axiosInstance[method](url, data).then((response) => response.data);

export const roleApi = {
  // Получить список всех ролей
  getAll: async (): Promise<IRoleGetAll[]> =>
    request("get", BASE_URL).then((response) => response.roles),

  // Получить все роли с подробной информацией
  getAllWithDetails: async (): Promise<IRoleWithDetails[]> =>
    request("get", `${BASE_URL}/all`).then((response) => response.roles),

  // Получить разрешения роли
  getById: async (id: IApiId): Promise<IRoleGetById> =>
    request("get", `${BASE_URL}/${id}/permissions`).then(
      (response) => response.roles
    ),

  getRolePermissions: async (id: any) =>
    request("get", `${BASE_URL}/${id}/permissions`).then(
      (response) => response.roles
    ),

  // Получить роль с дочерними ролями и разрешениями
  getByIdWithDetails: async (id: IApiId): Promise<IRoleWithDetails> =>
    request("get", `${BASE_URL}/${id}/children`).then(
      (response) => response.data
    ),

  // Создать новую роль
  create: async (
    name: string,
    description: string
  ): Promise<IRoleCreateResponse> => {
    const data: IRoleCreate = { name, description };
    return request("post", BASE_URL, data);
  },

  // Удалить роль
  delete: async (roleId: IApiId): Promise<IApiResponse> =>
    request("delete", `${BASE_URL}/${roleId}`),

  // Прикрепить дочернюю роль к родительской
  attachChild: async (
    parentId: number,
    childId: IApiId
  ): Promise<IApiResponse> =>
    request("post", `${BASE_URL}/${parentId}/attach`, { childRoleId: childId }),

  // Отсоединить дочернюю роль от родительской
  detachChild: async (
    parentId: number,
    childId: IApiId
  ): Promise<IApiResponse> =>
    request("post", `${BASE_URL}/${parentId}/detach`, { childRoleId: childId }),

  // Прикрепить разрешения к роли
  attachPermissions: async (
    id: IApiId,
    data: number[]
  ): Promise<IApiResponse> =>
    request("post", `${BASE_URL}/${id}/permissions`, data),

  // Отсоединить разрешения от роли
  detachPermissions: async (
    roleId: IApiId,
    data: number[]
  ): Promise<IApiResponse> =>
    request("delete", `${BASE_URL}/${roleId}/permissions`, data),
};
