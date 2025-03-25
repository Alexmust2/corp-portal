import { defineStore } from "pinia";
import { useNotificationsStore } from "./notifications.store";
import pinia from "./index";
import { IUserResponse } from "@/types/user.interface";
import { userApi } from "@/api/user.api";
import { authApi } from "@/api/auth.api";
import { IPermissionWithAllowDeny } from "@/types/permission.interface";

const notificationsStore = useNotificationsStore(pinia);


export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    userPermissions: [],
    usersToEdit: [],
  }),

  getters: {
    getUser: (state) => state.user,
  },

  actions: {
    setUser(user: IUserResponse | null) {
      // @ts-ignore
      this.user = user;
    },

    setUserPerms(perms: IPermissionWithAllowDeny[]) {
      // @ts-ignore
      if (this.user) this.user.permissions = perms;
    },

    async getUserByToken() {
      const token = localStorage.getItem("token");
      if (!token) return
      try {
        const user = await authApi.getUserByToken(token)
        user.permissions = [];
        this.setUser(user);
        await this.getUserPerms();
      } catch (error) {
        console.error("Ошибка при получении пользователя по токену:", error);
        this.setUser(null);
      }
    },

    async getUserPerms() {
      try {
        if (!this.user) return
        // @ts-ignore
        const perms = await userApi.getPermissions(this.user.id)
        this.setUserPerms(perms);
      } catch (error) {
        console.error("Ошибка при получении пермишенов пользователя:", error);
      }
    },

    async updateUserPassword(password: string) {
      try {
        console.log(this.user, "from function updateUserPassword");
        if (!this.user) return
        await userApi.changePassword(password).then(() => {
          const notificationData = {
            // @ts-ignore
            recipients: this.user?.id,
            title: "Обновление пароля",
            message: `Пароль успешно обновлен`,
            link: null,
            status: "success",
          };
          // @ts-ignore
          notificationsStore.sendToastWithoutCount(notificationData);
        });
        await this.getUserByToken();
      } catch (error) {
        console.error("Error updating password:", error);
        throw error;
      }
    },

    async updateUserPhoto({ userId, file }: { userId: string | number, file: File }) {
      try {
        const photoPath = await userApi.updatePhoto(userId, file).then(() => {
          const notificationData = {
            // @ts-ignore
            recipients: this.user.id,
            title: "Обновление Фотографии",
            message: `Фотография успешно обновлена`,
            link: null,
            status: "success",
          };
          // @ts-ignore
          notificationsStore.sendToastWithoutCount(notificationData);
        });
        // @ts-ignore
        if (this.user) this.user.photo_path = photoPath;
      } catch (error) {
        const notificationData = {
          // @ts-ignore
          recipients: this.user.id,
          title: "Обновление Фотографии",
          message: `Ошибка обновлении: ${error}`,
          link: null,
          status: "error",
        };
        // @ts-ignore
        notificationsStore.sendToastWithoutCount(notificationData);
        console.error("Ошибка при загрузке фото:", error);
      }
    },
  },
});
