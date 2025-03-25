
// ЗАПРОСЫ
export interface IRoleCreate extends Pick<IRole, 'name' | 'description'> { }

// ОТВЕТЫ
export interface IRoleGetAll extends Pick<IRole, 'id' | 'name' | 'description'> { }

export interface IRoleWithDetails extends IRole { }

export interface IRoleGetById extends Omit<IRole, 'ChildRoles'> { }

export interface IRoleCreateResponse {
    roleId: string
}




export interface IRole {
    id: number;
    name: string;
    description: string;
    ChildRoles: IChildRole[];
    permissions: IRolePermission[];
}

interface IRolePermission {
    id: number;
    name: string;
    description: string;
    role_permission: {
        role_id: number;
        permission_id: number;
    };
}

interface IChildRole {
    id: number;
    name: string;
}