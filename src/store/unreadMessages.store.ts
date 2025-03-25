import { defineStore } from "pinia";

export const useUnreadMessagesStore = defineStore("unreadMessages", {
  state: () => ({
    unreadCount: 0,
  }),

  getters: {
    getUnreadCount: (state) => state.unreadCount,
  },
  actions: {
    incrementUnreadCount() {
      this.unreadCount += 1;
    }
  }

   
});
