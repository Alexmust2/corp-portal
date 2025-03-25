export interface IPermission {
    id: number
    name: string
    description: string
}

export interface IPermissionWithAllowDeny extends IPermission {
    allow_deny: boolean
    role_id: number
}

export interface IPermissionUpdate {
    perm_id: number
    allow_deny: boolean
}

export interface IPermissionCreate extends Omit<IPermission, 'id'> { }

export interface IPermissionCreateResponse extends Pick<IPermission, 'id'> { }
