import { IUserResponse } from "@/types/user.interface";

export function showUserPerms(user: IUserResponse) {
  console.log(user.permissions, "user perms");
}

export function hasCommonElement(array1: any[], array2: any[]): boolean {
  return array1.some((element) => array2.includes(element));
}

export function userHavePermission(user: IUserResponse, permission: string): boolean {


  if (!user || !user.permissions) {
    console.log("Пользователь не определен или у него нет разрешений");
    return false;
  }

  const validUserPerms = user.permissions
    // @ts-ignore
    .filter((perm) => perm.allow_deny === undefined || perm.allow_deny === true)
        // @ts-ignore
    .map((perm) => perm.name);


  const hasPermission = validUserPerms.includes(permission);
  if(permission == '' || permission == undefined || permission == null) {
    return true;
  }

  return hasPermission;
}

export function userHaveAnyPermission(user: IUserResponse, permissions: string[]): boolean {
  if (!user || !user.permissions) {
    console.log("Пользователь не определен или у него нет разрешений");
    return false;
  }

  const validUserPerms = user.permissions
    // @ts-ignore
    .filter((perm) => perm.allow_deny === undefined || perm.allow_deny === true)
        // @ts-ignore
    .map((perm) => perm.name);

  const hasAnyPermission = permissions.some((perm) =>
    validUserPerms.includes(perm)
  );

  if (hasAnyPermission) {
    console.log("Пользователь имеет хотя бы одно из необходимых разрешений");
  } else {
    console.log("У пользователя нет ни одного из необходимых разрешений");
  }

  return hasAnyPermission;
}

export function userHaveAllPermissions(user: IUserResponse, permissions: string[]): boolean {
  if (!user || !user.permissions) {
    console.log("Пользователь не определен или у него нет разрешений");
    return false;
  }

  const validUserPerms = user.permissions
    // @ts-ignore
    .filter((perm) => perm.allow_deny === undefined || perm.allow_deny === true)
        // @ts-ignore
    .map((perm) => perm.name);

  const hasAllPermissions = permissions.every((perm) =>
    validUserPerms.includes(perm)
  );

  if (hasAllPermissions) {
    console.log("Пользователь имеет все необходимые разрешения");
  } else {
    console.log("У пользователя нет всех необходимых разрешений");
  }

  return hasAllPermissions;
}
