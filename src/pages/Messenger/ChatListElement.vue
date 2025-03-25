<template>
  <div
    class="chat-container"
    v-touch="touchHandlers"
    v-click-outside="onClickOutside"
  >
    <div class="background-icons left-icons">
      <v-icon
        class="mx-auto bell"
        color="accent"
        @click="muteNotifications(chat.data.chat_id)"
        >{{ iconMute }}</v-icon
      >
      <v-icon
        class="mx-auto pin"
        @click="pinChat(chat.data.id)"
        :icon="isPinned ? 'mdi-pin-off' : 'mdi-pin'"
      ></v-icon>
    </div>
    <div class="background-icons right-icons">
      <v-icon class="mx-auto" @click="deleteChat(chat.data.chat_id)"
        >mdi-delete</v-icon
      >
    </div>
    <router-link
      :to="'/chat/' + chat.data.chat_id"
      class="chat-element-wrapper"
    >
      <div
        class="chat-element"
        :class="{ pinned: chat.pinned, active: isActive }"
        :style="{ transform: `translateX(${translateX}px)` }"
        @click="this.$emit('selectChat', this.chat)"
      >
        <c-avatar
          size="50"
          class="rounded-circle mr-2"
          :userId="colorAvatar"
          :first_name="chat.data?.first_name"
          :color="chat.data?.color"
          :last_name="chat.data?.last_name"
          :photo_path="
            chat.data?.type === 'group'
              ? chat.data?.avatar?.file_path
              : chat.data?.file_path
          "
          :title="chat.data?.type === 'group' ? chat.data?.title : ''"
          :activity_status="
            chat.data?.type != 'group' ? chat.data?.user_activity?.status : null
          "
        ></c-avatar>
        <div class="w-100">
          <div class="user-list-block">
            <span>{{ displayName }}</span>
            <div class="x-sm">
              {{
                chat.data.message
                  ? new Date(chat.data.message.created_at).toLocaleString(
                      "ru-RU",
                      { hour: "2-digit", minute: "2-digit" }
                    )
                  : ""
              }}
            </div>
          </div>
          <div class="message-list-block">
            <EmojiText
              set="apple"
              :text="getMessageContent(chat)"
              size="20"
              class="sm single-line-text"
            />
            <template
              v-if="
                chat.data.unreadMessagesCount &&
                chat.data.unreadMessagesCount > 0
              "
            >
              <div class="unread-badge" :class="{ active: isActive }">
                {{
                  chat.data.unreadMessagesCount > 99
                    ? "99+"
                    : chat.data.unreadMessagesCount
                }}
              </div>
            </template>
            <v-icon
              v-else-if="isPinned"
              size="x-small"
              style="transform: rotate(45deg)"
            >
              mdi-pin
            </v-icon>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import { useUserStore } from "@/store/user.store";
import EmojiText from "@/components/widgets/EmojiText";
export default {
  props: {
    chat: { type: Object, required: true },
    isActive: { type: Boolean, default: false },
    index: {
      type: Number,
      required: true,
    },
    filteredChatId: { type: Number, required: true },
  },
  components: {
    EmojiText,
  },
  data() {
    return {
      translateX: 0,
      lastMessageTimestamp: null,
    };
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    userId() {
      return useUserStore().user.id;
    },
    touchHandlers() {
      return {
        left: () => this.swipe("Left"),
        right: () => this.swipe("Right"),
      };
    },
    colorAvatar() {
      if (this.chat.data.type === "private") {
        return this.chat.data.user_id;
      } else {
        return this.chat.data.id;
      }
    },
    isPinned() {
      return this.chat.pinned;
    },
    iconMute() {
      return this.chat.muted ? "mdi-bell-off" : "mdi-bell";
    },
    displayName() {
      if (this.chat.data.type === "private") {
        return this.capitalizeFirstLetter(
          `${this.chat.data.first_name} ${this.chat.data.last_name}`.trim()
        );
      }
      return this.capitalizeFirstLetter(this.chat.data.title);
    },
  },
  methods: {
    pinChat() {
      this.isPinned = !this.isPinned;
      this.$emit("pin-chat", this.filteredChatId);
      setTimeout(() => {
        this.translateX = 0;
      }, 200);
    },
    capitalizeFirstLetter(string) {
      return (
        string.toString().charAt(0).toUpperCase() + string.toString().slice(1)
      );
    },
    getMessageContent(chat) {
      const { type, message } = chat.data;

      if (type === "group" && !message) {
        return "Группа создана";
      }
      const senderName =
        type === "group" && message?.sender?.id != this.userId
          ? message?.sender?.full_name
          : type === "group" && message?.sender?.id === this.userId
          ? "Вы"
          : "";

      const msgType = message?.type;
      const content =
        msgType === "text" ? message.text : msgType === "file" ? "Файл" : "";

      return senderName ? `${senderName}: ${content}` : content;
    },
    deleteChat(chatId) {
      this.$emit("delete-chat", chatId, "delete");
    },
    async muteNotifications(chatId) {
      try {
        const action = this.chat.muted ? "unmute" : "mute";
        await this.$axios.post(`/api/chats/${chatId}/${action}`);
        const updatedChat = {
          ...this.chat,
          muted: !this.chat.muted,
        };
        this.$emit("updateChat", updatedChat);
      } catch (error) {
        console.error("Ошибка при попытке замутить", error);
      }
    },
    swipe(direction) {
      if (direction === "Left") {
        this.translateX == 140
          ? (this.translateX = 0)
          : (this.translateX = -70);
      } else if (direction === "Right") {
        this.translateX == -70
          ? (this.translateX = 0)
          : (this.translateX = 140);
      }
    },
    onClickOutside() {
      this.translateX = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-container {
  position: relative;
  overflow: hidden;
  .background-icons {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    &.left-icons {
      > * {
      }
      left: 0;
      width: 140px;
      display: flex;
      .pin {
        width: 50%;
        height: 100%;
        background: rgba(var(--v-theme-tertiary), 0.2);
        color: rbg(var(--v-theme-tertiary));
      }
      .bell {
        width: 50%;
        height: 100%;
        background: rgba(var(--v-theme-accent), 0.2);
        color: rbg(var(--v-theme-accent));
      }
    }
    &.right-icons {
      right: 0;
      display: flex;
      width: 70px;
      background: rgba(var(--v-theme-red), 0.2);
      color: rgb(var(--v-theme-red));
    }
    v-icon {
      color: #fff;
    }
  }
  .chat-element-wrapper {
    display: block;
    overflow: hidden;
  }
}

.single-line-text {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 90% !important;
  display: block !important;
  
  :deep(span) {
    display: inline !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  
  :deep(.emoji-mart-emoji) {
    display: inline-flex !important;
    // vertical-align: middle !important;
  }
  
}
.chat-element {
  padding: 8px 20px;
  width: 100%;
  height: 80px;
  display: flex;
  background: rgb(var(--v-theme-white));
  align-items: center;
  border-top: 1px solid rgb(var(--v-theme-tertiary));
  transition: transform 0.3s ease-in-out;
  &.pinned {
    background-color: rgb(var(--v-theme-white));
  }
  &.active {
    background: rgb(var(--v-theme-accent));
    color: rgba(255, 255, 255, 1);
  }

  .user-list-block {
    display: grid;
    grid-template-columns: 6fr 0fr;
    gap: 10px;
    span {
      text-overflow: ellipsis;
      font-size: 18px;
      font-family: "Raleway";
      line-height: 27px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      align-self: flex-end;
      @media screen and (max-width: 767px) {
        font-size: 16px;
        line-height: 24px;
        font-family: "Open Sans";
      }
    }
  }
  .message-list-block {
    display: grid;
    grid-template-columns: 6fr 0fr;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    span {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      max-height: calc(1.5em * 2);
      font-size: 16px;
      font-family: "Open Sans";
      font-weight: 400;
      line-height: 24px;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .unread-badge {
      background: rgb(var(--v-theme-accent));
      color: rgb(var(--v-theme-white));
      border-radius: 50%;
      padding: 0 6px;
      font-size: 12px;
      font-weight: bold;
      display: inline-block;
      line-height: 24px;
      min-width: 24px;
      display: flex;
      justify-content: center;
      &.active {
        background: rgb(var(--v-theme-white));
        color: rgb(var(--v-theme-accent));
      }
    }
  }

  &:not(.active):hover {
    background: rgb(var(--v-theme-tertiary));
  }
}
</style>
