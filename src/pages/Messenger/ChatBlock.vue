<template>
  <div class="chat-container">
    <div class="chat-header">
      <div class="name-block" @click="showChatInfo = true">
        <c-avatar
          size="40"
          :userId="colorAvatar"
          :first_name="selectedChat.data?.first_name"
          :color="selectedChat.data?.color"
          :title="
            selectedChat.data?.type === 'group' ? selectedChat.data?.title : ''
          "
          :last_name="selectedChat.data?.last_name"
          :photo_path="
            selectedChat.data?.type === 'group'
              ? selectedChat.data?.avatar?.file_path
              : selectedChat.data?.file_path
          "
          :activity_status="selectedChat.data?.user_activity?.status"
        ></c-avatar>
        <div>
          <div>
            <h3>{{ displayName }}</h3>
            <div class="x-sm" v-if="selectedChat.data.type === 'private'">
              {{
                !selectedChat.data?.user_activity?.status
                  ? formatDateTime(selectedChat.data?.user_activity?.updated_at)
                  : "В сети"
              }}
            </div>
            <div class="x-sm" v-else>
              В группе {{ chatMembers || 0 }} {{ getMemberWord(chatMembers) }}
            </div>
          </div>
        </div>
        <v-icon
          v-if="isMobile"
          size="x-large"
          @click="this.$emit('update:selectedChat', null)"
          >mdi-chevron-left</v-icon
        >
      </div>
      <div class="d-flex ga-3" v-if="!isMobile">
        <v-icon
          size="small"
          @click="muteNotifications(selectedChat.data.chat_id)"
          >{{ iconMute }}</v-icon
        >
        <v-icon
          size="small"
          :class="{ pin: !isPinned }"
          @click="pinChat"
          :icon="isPinned ? 'mdi-pin-off' : 'mdi-pin'"
        ></v-icon>
      </div>
    </div>

    <div
      class="chat-messages"
      @dragenter.prevent="onDragEnter"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      ref="chatArea"
    >
      <div
        v-if="isDragOver && selectedFiles.length < MAX_FILES"
        class="drop-overlay"
      >
        <div>
          <img class="attach-circle" src="@public/assets/attach_d&d.svg" />
          Перетащите файл или фото,<br />чтобы прикрепить их к сообщению
        </div>
      </div>
      <MessageList
        :messages="messages"
        :chat="selectedChat"
        ref="messageList"
        @messageRead="onMessageRead"
        @loadMoreMessages="loadMoreMessages"
        @delete-message="deleteMessage"
        @edit-message="editMessage"
        @reply-to-message="handleReplyToMessage"
      ></MessageList>
    </div>

    <div class="chat-footer">
      <div v-if="editingMessage" class="editing-block">
        <v-icon size="small" color="rgba(137, 203, 31, 1)">mdi-pencil</v-icon>
        <div class="editing-block__text">
          <p class="editing-block__title">Редактирование</p>
          <p class="editing-block__message">{{ editingMessage.text }}</p>
        </div>
        <v-icon
          size="small"
          color="rgba(137, 203, 31, 1)"
          @click="cancelEditing"
        >
          mdi-close
        </v-icon>
      </div>
      <div v-else-if="replyMessage" class="editing-block">
        <v-icon size="small" color="rgba(137, 203, 31, 1)">mdi-reply</v-icon>
        <div class="editing-block__text">
          <p class="editing-block__title">
            В ответ {{ replyMessage.sender.first_name }}
            {{ replyMessage.sender.last_name }}
          </p>
          <EmojiText
            set="apple"
            :text="replyMessage.text"
            size="20"
          />
          <!-- <p class="editing-block__message">{{ replyMessage.text }}</p> -->
        </div>
        <v-icon size="small" color="rgba(137, 203, 31, 1)" @click="cancelReply">
          mdi-close
        </v-icon>
      </div>
      <div class="inputs-line" v-auto-animate>
        <v-icon
          v-if="selectedFiles.length < MAX_FILES && !editingMessage"
          size="small"
          @click="triggerFileInput"
          class="paperclip-icon"
          style="cursor: pointer"
        >
          mdi-paperclip
        </v-icon>
        <c-input
          ref="textInput"
          placeholder="Введите сообщение"
          v-model="newMessage"
          :append-inner-icon="!isMobile ? 'mdi-emoticon-happy-outline' : ''"
          @click:append-inner="emojiOpen"
          :height="isMobile ? 40 : 50"
          @keyup.enter.stop="sendMessage"
          class="open-sans-input"
        >
        </c-input>
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          @change="handleFileChange"
          multiple
        />
        <div v-if="showEmojiPicker" ref="emojiDialog" class="emoji-dialog">
          <Picker
            :data="emojiIndex"
            title="Artis"
            :i18n="emojiLocale"
            @select="showEmoji"
            :native="false"
            type="apple"
            :showPreview="false"
            :showSearch="false"
            :showSkinTones="false"
            defaultSkin="1"
            color="#89CB1F"
            v-click-outside="onClickOutside"
            :perLine="8"
          />
        </div>
        <!-- Кнопка отправки сообщения -->
        <c-btn
          v-if="newMessage || selectedFiles.length || editingMessage"
          :icon="editingMessage ? 'mdi-check' : 'mdi-arrow-up'"
          :size="isMobile ? 'sm' : ''"
          @click="sendMessage"
        ></c-btn>
      </div>
      <div class="selected-files" v-auto-animate>
        <c-file-card
          v-for="(file, index) in selectedFiles"
          :key="generateFileKey(file, index)"
          :file="file"
          @delete-file="removeFile(index)"
        />
      </div>
    </div>

    <ChatInfoPanel
      v-model="showChatInfo"
      :chat="selectedChat"
      :messages="messages"
      :chatMembers="chatMembers"
      :formatDateTime="formatDateTime"
      @delete-chat="deleteChat"
      @update-chat-title="updateChatTitle"
      @update-chat-members="updateChatMembers"
      @update-chat-photo="updateChatPhoto"
      @leave-chat="leaveChat"
      @chat-with-user="openUserChat"
    />
  </div>
</template>

<script>
import MessageList from "./MessageList.vue";
import { useUserStore } from "@/store/user.store";
import { socket } from "@/websocket";
import data from "emoji-mart-vue-fast/data/apple.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
import ChatInfoPanel from "./ChatInfoPanel.vue";
import { useUnreadMessagesStore } from "@/store/unreadMessages.store";
import EmojiText from "@/components/widgets/EmojiText";
let exclude = ["flags"];

let emojiIndex = new EmojiIndex(data, { exclude });
import { vAutoAnimate } from "@formkit/auto-animate/vue";

export default {
  components: {
    MessageList,
    Picker,
    ChatInfoPanel,
    EmojiText,
  },
  directives: {
    autoAnimate: vAutoAnimate,
  },
  props: {
    selectedChat: {
      type: Object,
      required: false,
    },
  },
  model: {
    prop: "selectedChat",
    event: "update:selectedChat",
  },

  data() {
    return {
      emojiIndex: emojiIndex,
      emojisOutput: "",
      newMessage: "",
      messages: [],
      selectedFiles: [],
      chatMembers: null,
      showEmojiPicker: false,
      isDragOver: false,
      muteTime: "any",
      editingMessage: null,
      replyMessage: null,
      MAX_FILES: 10,
      oldestMessageId: null, // ID самого старого из загруженных сообщений
      isLoadingMore: false, // Флаг, чтобы не вызвать повторную загрузку до окончания текущей
      isPinned: this.selectedChat.pinned,
      emojiLocale: {
        search: "Поиск",
        notfound: "Эмодзи не найдены",
        categories: {
          search: "Результаты поиска",
          recent: "Часто используемые",
          smileys: "Смайлы и эмоции",
          people: "Люди и тело",
          nature: "Животные и природа",
          foods: "Еда и напитки",
          activity: "Активность",
          places: "Путешествия и места",
          objects: "Объекты",
          symbols: "Символы",
          flags: "Флаги",
          custom: "Особые",
        },
      },
      showChatInfo: true,
    };
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    colorAvatar() {
      if (this.selectedChat.data.type === "private") {
        return this.selectedChat.data.user_id;
      } else {
        return this.selectedChat.data.id;
      }
    },
    pinIcon() {
      return this.isPinned ? "mdi-pin-off" : "mdi-pin";
    },
    userId() {
      return useUserStore().user.id;
    },
    iconMute() {
      return this.selectedChat.muted ? "mdi-bell-off" : "mdi-bell";
    },
    displayName() {
      if (this.selectedChat.data.type === "private") {
        return this.capitalizeFirstLetter(
          `${this.selectedChat.data.first_name} ${this.selectedChat.data.last_name}`.trim()
        );
      }
      return this.capitalizeFirstLetter(this.selectedChat.data.title);
    },
    firstUnreadMessageId() {
      const arr = this.messages || [];
      const firstUnread = arr.find(
        (m) => !m.readStatus?.status && m.sender_id != this.userId
      );
      return firstUnread ? Number(firstUnread.id) : null;
    },
    unreadMessagesCount() {
      return this.messages.filter((message) => !message.readStatus).length;
    },
  },
  watch: {
    "selectedChat.data.chat_id": {
      handler(newVal) {
        if (newVal) {
          this.fetchMessages(newVal);
          this.showChatInfo = false;
        }
      },
      immediate: true,
    },
    unreadMessagesCount(val) {
      if (val === 0) {
        const unreadStore = useUnreadMessagesStore();
        unreadStore.incrementUnreadCount();
      }
    },
  },
  created() {
    socket.on("newMessage", this.handleNewMessage);
    socket.on("messageDeleted", this.handleDeleteMessageFromSocket);
  },
  beforeUnmount() {
    socket.off("newMessage", this.handleNewMessage);
    socket.off("messageDeleted", this.handleDeleteMessageFromSocket);
  },
  methods: {
    handleNewMessage(msg) {
      if (msg.chat_id == this.selectedChat.data.chat_id) {
        const container =
          this.$refs.messageList?.$el?.querySelector(".message-list");
        let isAtBottom = false;
        if (container) {
          isAtBottom =
            container.scrollHeight -
              container.scrollTop -
              container.clientHeight <
            1;
        }
        this.messages.push(msg);
        if (isAtBottom) this.$refs.messageList?.scrollToBottom(true);
      }
    },
    pinChat() {
      this.isPinned = !this.isPinned;
      this.$emit("pin-chat", this.selectedChat?.data?.chat_id);
    },
    async loadMoreMessages() {
      if (!this.isLoadingMore && this.oldestMessageId) {
        this.isLoadingMore = true;
        // Загружаем ещё 15 сообщений старше старейшего имеющегося
        await this.fetchMessages(
          this.selectedChat.data.chat_id,
          15,
          this.oldestMessageId
        );
      }
    },
    handleReplyToMessage(message) {
      this.replyingTo = message;
      const messageToReply = this.messages.find((msg) => msg.id === message);
      if (messageToReply) {
        this.replyMessage = messageToReply;
        this.$refs.textInput.$el.querySelector("input").focus();
      }
    },
    openUserChat(userId) {
      this.$emit("chat-with-user", userId);
    },
    updateChatTitle(newTitle) {
      this.$emit("update-chat-title", newTitle);
    },
    updateChatPhoto(newPhoto) {
      this.$emit("update-chat-Photo", newPhoto);
    },
    capitalizeFirstLetter(string) {
      return (
        string.toString().charAt(0).toUpperCase() + string.toString().slice(1)
      );
    },
    getMemberWord(count) {
      count = Number(count);
      if (count === 1) return "участник";
      if (count >= 2 && count <= 4) return "участника";
      return "участников";
    },
    onMessageRead(data) {
      this.$emit("messageRead", data);
    },
    updateChatMembers(newMembers) {
      if (this.selectedChat && this.selectedChat.data) {
        // Создаем копию текущего чата
        const updatedChat = JSON.parse(JSON.stringify(this.selectedChat));

        // Убедимся, что chatMembers существует
        if (!updatedChat.data.chatMembers) {
          updatedChat.data.chatMembers = [];
        }

        // Добавляем новых участников
        if (Array.isArray(newMembers)) {
          // Если newMembers - массив, добавляем все элементы
          updatedChat.data.chatMembers.push(...newMembers);
        } else {
          // Если newMembers - один объект, добавляем его
          updatedChat.data.chatMembers.push(newMembers);
        }

        // Обновляем количество участников
        this.chatMembers = updatedChat.data.chatMembers.length;

        // Обновляем memberCount, если это свойство существует
        if ("memberCount" in updatedChat.data) {
          updatedChat.data.memberCount = this.chatMembers;
        }

        // Эмитим событие для обновления чата в родительском компоненте
        this.$emit("update:selectedChat", updatedChat);
      }
    },
    emojiOpen() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },
    deleteChat(chatId, actionType) {
      this.$emit("delete-chat", chatId, actionType);
    },
    leaveChat(chatId, actionType) {
      this.$emit("leave-chat", chatId, actionType);
    },
    deleteMessageFromArray(messageId) {
      this.messages = this.messages.filter(
        (message) => message.id !== messageId
      );
    },
    deleteMessage(messageId, actionType) {
      this.$emit(
        "delete-message",
        this.selectedChat?.data?.chat_id,
        actionType,
        messageId
      );
    },

    editMessage(messageId) {
      const messageToEdit = this.messages.find((msg) => msg.id === messageId);
      if (messageToEdit) {
        this.editingMessage = messageToEdit;
        this.newMessage = messageToEdit.text;
        this.$refs.textInput.$el.querySelector("input").focus();
      }
    },
    cancelEditing() {
      this.editingMessage = null;
      this.newMessage = "";
    },
    cancelReply() {
      this.replyMessage = null;
      this.newMessage = "";
    },
    onClickOutside() {
      this.showEmojiPicker = false;
    },
    showEmoji(emoji) {
      const textInput = this.$refs.textInput?.$el.querySelector("input");
      const symbol = emoji.native || emoji;
      if (!textInput) {
        this.newMessage += symbol;
        return;
      }
      const start = textInput.selectionStart;
      const end = textInput.selectionEnd;
      const before = this.newMessage.slice(0, start);
      const after = this.newMessage.slice(end);

      this.newMessage = before + symbol + after;
      this.$nextTick(() => {
        textInput.focus();
        const cursorPos = start + symbol.length;
        textInput.setSelectionRange(cursorPos, cursorPos);
      });
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const files = Array.from(event.target.files);
      const MAX_FILE_SIZE_MB = 50;
      const availableSlots = this.MAX_FILES - this.selectedFiles.length;

      this.selectedFiles.push(
        ...files
          .filter((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024)
          .slice(0, availableSlots)
      );

      event.target.value = ""; // Очищаем input
    },
    removeFile(index) {
      this.selectedFiles.splice(index, 1);
    },
    generateFileKey(file, index) {
      return `${file.name}-${file.size}-${file.lastModified}-${index}`;
    },
    async muteNotifications(chatId) {
      try {
        const action = this.selectedChat.muted ? "unmute" : "mute";
        await this.$axios.post(`/api/chats/${chatId}/${action}`);
        const updatedChat = {
          ...this.selectedChat,
          muted: !this.selectedChat.muted,
        };
        this.$emit("updateChat", updatedChat);
      } catch (error) {
        console.error("Ошибка при попытке замутить", error);
      }
    },
    async fetchMessages(chatId, limit = null, beforeId = null) {
      try {
        let url = `/api/chats/${chatId}`;
        if (limit && beforeId) {
          url += `?limit=${limit}&before=${beforeId}`;
        }

        const response = await this.$axios.get(url);

        if (!response || !response.data) {
          console.error("Получен пустой ответ от сервера");
          return;
        }

        if (!response.data.messages) {
          console.error("В ответе отсутствуют сообщения");
          return;
        }

        if (!limit) {
          this.chatMembers = response.data.memberCount;
          this.messages = (response.data.messages || []).sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );

          // Запоминаем самый старый ID сообщения (если есть)
          if (this.messages.length > 0) {
            this.oldestMessageId = this.messages[0].id;
          }

          this.$nextTick(() => {
            const container =
              this.$refs.messageList?.$el?.querySelector(".message-list");
            const firstUnreadMessageId = this.firstUnreadMessageId;
            if (firstUnreadMessageId && container) {
              const firstUnreadElement = container.querySelector(
                `.message[data-id="${firstUnreadMessageId}"]`
              );
              if (firstUnreadElement) {
                firstUnreadElement.scrollIntoView({
                  block: "center",
                });
                return;
              }
            } else {
              this.$refs.messageList?.scrollToBottom();
            }
          });
        } else {
          // Это догрузка старых сообщений
          const newMessages = (response.data.messages || []).sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );

          if (newMessages.length > 0) {
            const container =
              this.$refs.messageList?.$el?.querySelector(".message-list");
            const oldScrollHeight = container.scrollHeight;

            // Добавляем новые сообщения в начало массива
            this.messages = [...newMessages, ...this.messages];

            // Обновляем oldestMessageId
            this.oldestMessageId = this.messages[0].id;

            this.$nextTick(() => {
              // Сохраняем позицию скролла так, чтобы не было "дёргания"
              const newScrollHeight = container.scrollHeight;
              container.scrollTop = newScrollHeight - oldScrollHeight;
            });
          }
        }
      } catch (error) {
        console.error("Ошибка при загрузке сообщений", error);
      } finally {
        this.isLoadingMore = false;
      }
    },
    formatDateTime(isoDate) {
      if (!isoDate) {
        return "Не зарегистрирован";
      }
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) {
        return "неизвестно";
      }
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const formattedTime = formatter.format(date);
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const differenceInDays = Math.floor(
        (date - startOfToday) / (1000 * 60 * 60 * 24)
      );

      if (differenceInDays === 0) {
        return `Был сегодня в ${formattedTime}`;
      } else if (differenceInDays === -1) {
        return `Был вчера в ${formattedTime}`;
      } else if (differenceInDays === -2) {
        return `Был позавчера в ${formattedTime}`;
      } else {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `Был ${day}.${month}.${year} в ${formattedTime}`;
      }
    },
    async sendMessage() {
      if (!this.newMessage.trim() && this.selectedFiles.length === 0) {
        alert("Сообщение не может быть пустым!");
        return;
      }
      try {
        let formData = new FormData();
        formData.append("text", this.newMessage);
        if (this.replyMessage) {
          formData.append("reply_to_message_id", this.replyMessage.id);
        }
        if (!this.editingMessage) {
          formData.append("type", "text");
        }
        if (this.selectedFiles.length > 0) {
          for (let i = 0; i < this.selectedFiles.length; i++) {
            formData.append("files", this.selectedFiles[i]);
          }
        }

        let url = `/api/chats/${this.selectedChat.data.chat_id}/messages`;

        if (this.editingMessage) {
          url += `/${this.editingMessage.id}/edit`;
          await this.$axios.put(url, {
            text: this.newMessage,
          });
          const editedMessageIndex = this.messages.findIndex(
            (m) => m.id === this.editingMessage.id
          );

          if (editedMessageIndex !== -1) {
            this.messages[editedMessageIndex].text = this.newMessage;
          }
        } else {
          await this.$axios.post(url, formData);
        }

        this.editingMessage = null;
        this.replyMessage = null;
        this.newMessage = "";
        this.selectedFiles = [];
        this.$nextTick(() => {
          this.$refs.messageList?.scrollToBottom(true);
        });
      } catch (error) {
        console.error("Ошибка при отправке сообщения", error);
      }
    },
    onDragEnter() {
      this.isDragOver = true;
    },
    onDragOver() {
      this.isDragOver = true;
      // Ничего особого, просто предотвратить поведение по умолчанию
    },
    onDragLeave() {
      this.isDragOver = false;
    },
    onDrop(e) {
      this.isDragOver = false;
      if (this.selectedFiles.length < this.MAX_FILES) {
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
          this.selectedFiles.push(...files);
        }
      }
    },
    handleDeleteMessageFromSocket(message) {
      if (
        this.messages.some((obj) => obj.id === parseInt(message.messageId)) &&
        this.selectedChat.data.id === message.chatId
      ) {
        this.messages = this.messages.filter(
          (obj) => obj.id !== parseInt(message.messageId)
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  @media screen and (min-width: 960px) {
    height: 100%;
  }
}

.open-sans-input ::v-deep input {
  font-family: "Open Sans" !important;
  font-size: 18px;
  color: #3e3e3e;
  line-height: 21px;
  font-weight: 400;
  @media screen and (max-width: 767px) {
    font-size: 14px;
  }
}
.chat-header {
  position: sticky;
  z-index: 10;
  height: min-content;
  width: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  @media screen and (min-width: 960px) {
    justify-content: space-between;
    padding: 0px 20px;
  }

  .name-block {
    display: flex;
    gap: 4px;
    align-items: center;
    cursor: pointer;
    flex-direction: row-reverse;
    justify-content: space-between;
    width: 100%;
    height: 67px;
    padding-inline: 20px;
    @media screen and (min-width: 960px) {
      flex-direction: row;
      justify-content: flex-start;
      padding-inline: 0px;
    }
    h3 {
      white-space: nowrap;
    }
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      @media screen and (min-width: 960px) {
        display: block;
      }
    }
  }
}
.chat-messages {
  position: relative;
  flex: 1 1 auto; /* Чат занимает всё доступное пространство */
  overflow-y: auto;
  background: repeat url("@public/assets/chat_bg_light.svg");
  background-color: #dfdfdf;
  background-size: 200px;
  overflow: hidden;

  @media screen and (min-width: 960px) {
    height: auto;
  }
}
.drop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(var(--v-theme-white));
  display: flex;
  color: rgb(var(--v-theme-secondary));
  z-index: 10;
  pointer-events: none; /* Чтобы оверлей не блокировал взаимодействие с элементами под ним */
  div {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 4px dashed rgb(var(--v-theme-addition));
    border-radius: 24px;
    margin: 20px;
    text-align: center;
  }
}
.chat-footer {
  position: sticky;
  z-index: 10;
  margin: 14px 20px 20px 20px;
  bottom: 0;
  @media screen and (min-width: 960px) {
    margin: 16px 40px 8px 40px;
  }
}
.selected-files {
  gap: 16px;
  padding-top: 8px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.inputs-line {
  display: flex;
  align-items: center;
  gap: 12px;
}
.emoji-dialog {
  position: absolute;
  bottom: 60px; /* Отступ над полем ввода */
  right: 0;
  z-index: 100;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.pin {
  rotate: 45deg;
  cursor: pointer;
}

.editing-block {
  display: flex;
  background-color: rgba(137, 203, 31, 0.2);
  border-bottom: 1px solid rgba(137, 203, 31, 1);
  padding: 8px 12px;
  border-radius: 8px 8px 0px 0px;
  margin-bottom: 12px;
  align-items: center;
  font-family: "Open Sans";
  column-gap: 12px;
  @media screen and (max-width: 767px) {
    padding: 4px 8px;
    column-gap: 5px;
  }
  &__text {
    flex: 1;
    font-size: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 21px;
  }
  &__title {
    font-weight: 600;
    color: rgba(137, 203, 31, 1);

    @media screen and (max-width: 767px) {
      font-size: 14px;
    }
  }
  &__message {
    font-weight: 400;
    line-height: 21px;
    color: rgba(120, 120, 120, 1);
    @media screen and (max-width: 767px) {
      font-size: 14px;
    }
  }
}
</style>
