<template>
  <div class="chat-message-container">
    <div class="message-list" @scroll="onScroll">
      <div v-if="groupedMessages.length === 0" class="group-created-info">
        {{ chatsType }}
      </div>
      <div
        v-for="(group, index) in groupedMessages"
        :key="index"
        class="date-group"
      >
        <div class="date-divider">{{ formatDate(group.date) }}</div>
        <div
          v-if="group.messages.some((m) => m.id === firstUnreadMessageId)"
          class="new-divider"
        >
          Новые сообщения
        </div>
        <div class="messages">
          <div
            v-for="message in group.messages"
            :key="message.id"
            :data-id="message.id"
            @touchstart="handleTouchStart($event, message.id)"
            @touchmove="handleTouchMove($event, message.id)"
            @touchend="handleTouchEnd($event, message.id)"
            v-long-press="(event) => handleLongPress(event, message.id)"
            @contextmenu.prevent="handleContextMenu($event, message.id)"
            :class="[
              'message',
              message.sender_id === userId ? 'mine' : 'theirs',
              { swiped: swipedMessageId === message.id },
            ]"
            v-intersect="
              !message.readStatus?.status && message.sender_id != userId
                ? {
                    handler: (isIntersecting, entries, observer) =>
                      onIntersect(isIntersecting, entries, observer, message),
                    options: {
                      threshold: [1],
                    },
                  }
                : []
            "
          >
            <router-link
              v-if="chat.data.type === 'group' && message.sender_id !== userId"
              class="message-sender"
              :to="'/chat/' + message.sender_id"
            >
              <c-avatar
                size="28"
                class="ava"
                :color="message.sender?.color"
                :userId="message.sender_id"
                :first_name="message.sender?.first_name"
                :last_name="message.sender?.last_name"
                :title="''"
                :photo_path="message.sender?.avatar?.file_path"
              />

              <span class="sender-name"
                >{{ message.sender.first_name }}
                {{ message.sender.last_name }}</span
              >
            </router-link>
            <div
              :class="[
                'reply-base',
                message.sender_id === userId ? 'mine-reply' : 'your-reply',
              ]"
              v-if="message?.reply"
              @click="scrollToMessage(message.reply_to_message_id)"
              style="cursor: pointer"
            >
              <span class="initials"
                >{{ message.reply.sender.first_name }}
                {{ message.reply.sender.last_name }}</span
              >
              <p>
                <EmojiText
                  set="apple"
                  :text="message.reply.text"
                  size="20"
                />
              </p>
            </div>
            <div
              class="message-content"
              :class="{
                'with-attachments':
                  message.attachments && message.attachments.length > 0,
              }"
            >
              <div class="message-body">
                <div>
                  <EmojiText
                    set="apple"
                    :text="message.text"
                    size="20"
                  />
                </div>
                <div
                  v-if="message?.attachments?.length"
                  class="file-attachment"
                  :class="{
                    'all-images': checkIfAllAreImages(message.attachments),
                  }"
                >
                  <div
                    v-for="attachment in message.attachments"
                    :key="attachment.id"
                    class="file-wrapper"
                  >
                    <c-file-card :file="attachment.uploads" />
                  </div>
                </div>
              </div>
              <div class="message-meta">
                <span class="message-time" v-if="message">
                  {{
                    new Date(message.created_at).toLocaleString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                </span>
                <span
                  v-if="message.sender_id === userId"
                  class="message-status"
                >
                  <v-icon v-if="message.readStatus?.status" color="accent"
                    >mdi-check-all</v-icon
                  >
                  <v-icon v-else color="addition">mdi-check</v-icon>
                </span>
              </div>
            </div>
            <div
              class="swipe-action"
              :style="{
                opacity:
                  currentSwipe.messageId === message.id &&
                  currentSwipe.translateX < 0
                    ? Math.min(Math.abs(currentSwipe.translateX) / 40, 1)
                    : 0,
              }"
            >
              <v-icon>mdi-reply</v-icon>
            </div>
            <transition name="fade">
              <div
                v-if="tooltips[message.id]"
                class="custom-menu"
                :style="getMenuPosition(message.id)"
              >
                <div class="message-actions-menu">
                  <div class="menu-list">
                    <template v-for="(item, index) in actions" :key="item.name">
                      <div
                        v-if="
                          (item.name === 'Удалить' &&
                            message.sender_id === userId) ||
                          (item.name === 'Скопировать' && canCopy(message)) ||
                          (item.name === 'Изменить' && canEdit(message)) ||
                          (item.name === 'Ответить' && !isMobile)
                        "
                        @click="handleAction(item.name, message)"
                        @touchstart="handleAction(item.name, message)"
                        class="message-action-item"
                      >
                        <span :style="{ color: item.color }">{{
                          item.name
                        }}</span>
                        <v-icon :size="24" :color="item.color">{{
                          item.icon
                        }}</v-icon>
                      </div>
                      <hr
                        v-if="
                          index < actions.length - 1 &&
                          ((item.name === 'Удалить' &&
                            message.sender_id === userId) ||
                            (item.name === 'Скопировать' && canCopy(message)) ||
                            (item.name === 'Изменить' && canEdit(message)))
                        "
                      />
                    </template>
                  </div>
                </div></div
            ></transition>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showScrollButton"
      class="d-flex down"
      :class="{ hidden: !showScrollButton }"
      @click="scrollToBottom(true)"
    >
      <div class="down_wrapper">
        <v-icon class="down_icon">mdi-chevron-down</v-icon>
      </div>
      <p class="down_count" v-if="unreadMessagesCount > 0">
        {{ unreadMessagesCount > 99 ? "99+" : unreadMessagesCount }}
      </p>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/store/user.store";
import { socket } from "@/websocket";
import { longPress } from "@/directives/VLongPress";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import EmojiText from "@/components/widgets/EmojiText";

export default {
  props: {
    messages: {
      type: Array,
      default: () => [],
    },
    chat: {
      type: Object,
      default: () => {},
    },
  },
  directives: {
    autoAnimate: vAutoAnimate,
    longPress,
  },
  data() {
    return {
      tooltips: {},
      translateX: 0,
      swipedMessageId: null,
      showScrollButton: false,
      touchStartX: 0,
      touchStartY: 0,
      currentSwipe: {
        messageId: null,
        translateX: 0,
      },
      actions: [
        {
          name: "Ответить",
          icon: "mdi-reply",
          color: "rgba(62, 62, 62, 1)",
        },
        {
          name: "Скопировать",
          icon: "mdi-content-copy",
          color: "rgba(62, 62, 62)",
        },
        {
          name: "Изменить",
          icon: "mdi-square-edit-outline",
          color: "rgba(62, 62, 62)",
        },
        // {
        //   name: "Переслать",
        //   icon: "mdi-share",
        //   color: "rgba(62, 62, 62, 1)",
        // },
        {
          name: "Удалить",
          icon: "mdi-delete",
          color: "rgba(235, 113, 113)",
        },
      ],
    };
  },
  components: {
    EmojiText,
  },
  computed: {
    userId() {
      return useUserStore().user.id;
    },
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    unreadMessagesCount() {
      return this.messages.filter(
        (m) => !m.readStatus?.status && m.sender_id !== this.userId
      ).length;
    },
    groupedMessages() {
      const arr = this.messages || [];
      const grouped = {};
      arr.forEach((m) => {
        const date = this.getDateString(m.created_at);
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(m);
      });

      const sortedDates = Object.keys(grouped).sort((a, b) => {
        return new Date(a) - new Date(b);
      });

      return sortedDates.map((date) => ({
        date,
        messages: grouped[date].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        ),
      }));
    },
    chatsType() {
      return this.chat.data.type === "group" ? "Группа создана" : "Чат создан";
    },
    firstUnreadMessageId() {
      const arr = this.messages || [];
      const firstUnread = arr.find(
        (m) => !m.readStatus?.status && m.sender_id != this.userId
      );
      return firstUnread ? Number(firstUnread.id) : null;
    },
  },
  created() {
    socket.on("messageRead", (data) => {
      this.groupedMessages.forEach((group) => {
        const message = group.messages.find((m) => m.id === data.messageId);
        if (message) {
          message.readStatus = data.messageReadData;
        }
      });
      this.$emit("messageRead", data);
    });
  },
  methods: {
    onScroll(e) {
      const container = e.target;
      if (container.scrollTop < 50) {
        this.$emit("loadMoreMessages");
      }
      this.showScrollButton = !this.isAtBottom();
    },
    handleSwipeLeft(messageId) {
      const messageElement = document.querySelector(`[data-id="${messageId}"]`);
      if (messageElement) {
        messageElement.style.transform = "translateX(-80px)";
        setTimeout(() => {
          messageElement.style.transform = "translateX(0)";
          this.$emit("reply-to-message", messageId);
        }, 300);
      }
      this.swipedMessageId = messageId;
      setTimeout(() => {
        this.swipedMessageId = null;
      }, 600);
    },

    textMessages(message) {
      return message.type === "text" && !message.isSystemMessage;
    },

    getDateString(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    },
    handleTouchStart(event, messageId) {
      // Сохраняем начальную позицию касания
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
      this.currentSwipe.messageId = messageId;
      this.currentSwipe.translateX = 0;
    },
    handleTouchMove(event, messageId) {
      if (this.currentSwipe.messageId !== messageId) return;

      const touchX = event.touches[0].clientX;
      const touchY = event.touches[0].clientY;

      // Вычисляем разницу по X и Y
      const deltaX = touchX - this.touchStartX;
      const deltaY = touchY - this.touchStartY;

      // Если движение больше по вертикали, чем по горизонтали,
      // то это скролл, а не свайп
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;

      // Предотвращаем скролл при горизонтальном свайпе
      event.preventDefault();

      // Разрешаем только свайп влево (отрицательные значения deltaX)
      // и ограничиваем его до -80px
      if (deltaX < 0) {
        // Свайп влево (для ответа)
        const newTranslateX = Math.max(deltaX, -80);
        this.currentSwipe.translateX = newTranslateX;

        // Применяем трансформацию к сообщению
        const messageElement = event.currentTarget;
        messageElement.style.transform = `translateX(${newTranslateX}px)`;
        messageElement.style.transition = "none"; // Убираем анимацию при движении пальцем

        const swipeAction = messageElement.querySelector(".swipe-action");
        if (swipeAction) {
          // Устанавливаем прозрачность в зависимости от величины свайпа
          const opacity = Math.min(Math.abs(newTranslateX) / 40, 1);
          swipeAction.style.opacity = opacity;
        }
      }
    },

    handleTouchEnd(event, messageId) {
      if (this.currentSwipe.messageId !== messageId) return;

      const messageElement = event.currentTarget;
      messageElement.style.transition = "transform 0.5s ease"; // Возвращаем анимацию

      const swipeAction = messageElement.querySelector(".swipe-action");
      if (swipeAction) {
        swipeAction.style.transition = "opacity 0.5s ease"; // Добавляем плавное исчезновение
      }
      // Если свайп был достаточно большим влево, вызываем действие ответа
      if (this.currentSwipe.translateX <= -20) {
        this.handleSwipeLeft(messageId);
        if (swipeAction) {
          swipeAction.style.opacity = 0; // Скрываем иконку после завершения свайпа
        }
      } else {
        messageElement.style.transform = "translateX(0)";
        if (swipeAction) {
          swipeAction.style.opacity = 0; // Скрываем иконку после завершения свайпа
        }
      }

      // Сбрасываем данные о текущем свайпе
      this.currentSwipe.messageId = null;
      this.currentSwipe.translateX = 0;
    },
    getMenuPosition(messageId) {
      if (!this.tooltips[messageId]) return {};

      const menuWidth = 171;
      const screenWidth = window.innerWidth;
      let left = this.tooltips[messageId].x;

      // Проверяем, не выходит ли меню за правый край экрана
      if (left + menuWidth > screenWidth) {
        left = screenWidth - menuWidth - 20;
      }

      // Проверяем, не выходит ли меню за левый край экрана
      if (left < 20) {
        left = 20;
      }

      return {
        top: `${this.tooltips[messageId].y}px`,
        left: `${left}px`,
      };
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = this.getMonthName(date.getMonth());
      const year = date.getFullYear();
      return `${day} ${month} ${year}г`;
    },
    getMonthName(monthIndex) {
      const months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
      ];
      return months[monthIndex];
    },

    canEdit(message) {
      // Можно изменять только текстовые сообщения без вложений
      return this.textMessages(message) && message.sender_id === this.userId;
    },

    canCopy(message) {
      // Можно копировать, если есть только текст
      if (this.textMessages(message)) {
        return true;
      }
      return false;
    },

    canEditOrCopy(message) {
      // Проверяем, есть ли текст и нет ли вложений
      if (this.textMessages(message)) {
        return true;
      }

      // Проверяем, есть ли только одно вложение и это изображение формата PNG
      if (message.attachments?.length === 1) {
        const attachment = message.attachments[0];
        return attachment.uploads.file_type === "image/png";
      }

      return false;
    },
    handleLongPress(event, messageId) {
      if (
        event.target.closest(".file-attachment") ||
        event.target.closest(".c-file-card")
      ) {
        return;
      }
      this.handleContextMenu(event, messageId);
    },
    handleAction(actionName, message) {
      switch (actionName) {
        case "Скопировать":
          this.copyContent(message);
          break;
        case "Ответить":
          this.$emit("reply-to-message", message.id);
          break;
        case "Изменить":
          this.$emit("edit-message", message.id);
          break;
        case "Удалить":
          this.$emit("delete-message", message.id, "delete");
          break;
      }

      setTimeout(() => {
        this.closeContextMenu();
      }, 0);
    },

    scrollToMessage(messageId) {
      const messageElement = document.querySelector(`[data-id="${messageId}"]`);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: "smooth", block: "center" });

        // Add a highlight effect to make it clear which message was referenced
        messageElement.classList.add("highlighted-message");
        setTimeout(() => {
          messageElement.classList.remove("highlighted-message");
        }, 2000);
      }
    },

    preventScroll(e) {
      e.preventDefault();
    },
    allowScroll() {
      document.body.style.overflow = "";
      document.removeEventListener("wheel", this.preventScroll);
      document.removeEventListener("touchmove", this.preventScroll);
    },

    handleContextMenu(event, messageId) {
      const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      if (
        isMobile &&
        event.type !== "touchstart" &&
        event.type !== "mousedown"
      ) {
        return;
      }
      if (
        event.target.closest(".file-attachment") ||
        event.target.closest(".c-file-card")
      ) {
        return;
      }

      event.preventDefault();
      const x = event.clientX || (event.touches && event.touches[0].clientX);
      const y = event.clientY || (event.touches && event.touches[0].clientY);

      this.closeContextMenu();

      const message = this.findMessageById(messageId);
      if (!message) return;

      this.tooltips = {
        [messageId]: { x, y },
      };

      this.filteredActions = this.actions.filter((action) => {
        if (action.name === "Изменить") {
          return this.canEdit(message);
        }
        return true;
      });
      // Добавляем обработчики событий сразу
      document.addEventListener("click", this.handleOutsideClick);
      document.addEventListener("touchend", this.handleOutsideClick);
      document.addEventListener("wheel", this.preventScroll, {
        passive: false,
      });
      document.addEventListener("touchmove", this.preventScroll, {
        passive: false,
      });
      document.body.style.overflow = "hidden";
    },
    findMessageById(messageId) {
      for (const group of this.groupedMessages) {
        const message = group.messages.find((m) => m.id === messageId);
        if (message) return message;
      }
      return null;
    },
    closeContextMenu() {
      this.tooltips = {};
      document.removeEventListener("click", this.handleOutsideClick);
      document.removeEventListener("touchend", this.handleOutsideClick);
      document.removeEventListener("wheel", this.preventScroll);
      document.removeEventListener("touchmove", this.preventScroll);
      document.body.style.overflow = "";
    },
    handleOutsideClick(event) {
      const menu = this.$el.querySelector(".custom-menu");
      const messageElement = event.target.closest(".message");
      if (menu && !menu.contains(event.target) && !messageElement) {
        this.closeContextMenu();
      }
    },
    async copyContent(message) {
      try {
        let textContent = "";

        if (message.text) {
          textContent = message.text;
          await navigator.clipboard.writeText(textContent);
          return { textContent, hasMultipleItems: false };
        }

        throw new Error("Нечего копировать");
      } catch (error) {
        console.error("Ошибка при копировании содержимого:", error);
        return null;
      }
    },

    onIntersect(isIntersecting, entries, observer, message) {
      if (
        isIntersecting &&
        !message.readStatus?.status &&
        message.sender_id != this.userId
      ) {
        message.readStatus = { status: true };
        socket.emit("readMessage", message.id);
      }
    },
    scrollToBottom(isSmooth = false) {
      this.$nextTick(() => {
        const container = this.$el.querySelector(".message-list");
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: isSmooth ? "smooth" : "auto",
          });
        }
        this.showScrollButton = !this.isAtBottom(container);
      });
    },
    isAtBottom(container) {
      if (!container) container = this.$el.querySelector(".message-list");
      if (!container) return true;

      const lastMessages = container.querySelectorAll(".message");
      if (lastMessages.length < 2) return true;

      const secondLastMessage = lastMessages[lastMessages.length - 2];
      const containerBottom = container.scrollTop + container.clientHeight;

      return containerBottom >= secondLastMessage.offsetTop;
    },
    checkIfAllAreImages(attachments) {
      if (!attachments || !Array.isArray(attachments)) return false;
      return attachments.every(
        (attachment) =>
          attachment.uploads &&
          attachment.uploads.file_type &&
          attachment.uploads.file_type.startsWith("image")
      );
    },
  },
};
</script>

<style scoped lang="scss">
.chat-message-container {
  position: relative;
  overflow: auto;
  overflow-x: hidden;
  height: 100%;
}

.down {
  position: absolute;
  bottom: 20px;
  right: 20px;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  opacity: 1;
  visibility: visible;
}

.down.hidden {
  opacity: 0;
  visibility: hidden;
}

.message-list {
  --chat-padding-inline: clamp(10px, -1.25rem + 3.125vw, 40px);
  overflow: auto;
  height: 100%;
  overflow-x: hidden;
  padding-inline: var(--chat-padding-inline);
  padding-bottom: 20px;
  @media screen and (max-width: 959px) {
    --chat-padding-inline: 20px;
  }
}

.message-actions-menu {
  background-color: rgba(255, 255, 255, 1) !important;
  border-radius: 12px !important;
  border: 1px solid rgba(223, 223, 223, 1);
  box-shadow: 0px 2px 8px 0px rgba(120, 120, 120, 0.08) !important;
}

.group-created-info {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #3e3e3e80;
  border-radius: 32px;
  padding: 0px 8px;
  margin: 12px auto;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  font-family: "Open Sans";
  width: fit-content;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.custom-menu {
  position: fixed;
  z-index: 1000;
  transform-origin: top left;
}

.menu-list {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #dfdfdf;
  width: 171px;
  padding: 0 8px;
  box-shadow: 0px 2px 8px 0px rgba(120, 120, 120, 0.08);
}

.message-sender {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  column-gap: 6px;
}

.sender-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 21px;
  font-family: "Open Sans";
  color: rgba(62, 62, 62, 1);
}

.message-action-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  span {
    font-size: 14px;
    font-family: "Open Sans";
    line-height: 21px;
    font-weight: 400;
  }
}

.message-body {
  width: 100%;
}

hr {
  border: none;
  border-top: 1px solid #dfdfdf;
}

.message-action-item {
  padding: 8px !important;
  transition: background-color 0.2s ease;
}

.message-action-item .v-list-item-title {
  font-size: 14px;
  color: rgba(62, 62, 62, 1);
  font-family: "Open Sans";
  line-height: 21px;
  font-weight: 400;
}

.date-group {
  display: flex;
  flex-direction: column;
  position: relative;
}

.date-divider {
  display: inline-block;
  background: #3e3e3e80;
  border-radius: 32px;
  padding: 0 8px;
  margin: 12px auto;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
}
.reply-base {
  border-radius: 8px;
  padding: 2.5px 8px;
  margin-bottom: 4px;

  span {
    font-size: 14px;
    font-family: "Open Sans";
    line-height: 21px;
    font-weight: 400;
  }

  p {
    font-size: 18px;
    font-family: "Open Sans";
    line-height: 27px;
    font-weight: 400;
    color: rgba(62, 62, 62, 1);
    @media screen and (max-width: 768px) {
      font-size: 14px;
      line-height: 21px;
    }
  }
}

.your-reply {
  @extend .reply-base;
  background-color: rgba(223, 223, 223, 1);

  .initials {
    color: rgba(120, 120, 120, 1);
    font-weight: 600;
  }
}

.mine-reply {
  @extend .reply-base;
  background-color: rgba(137, 203, 31, 0.2);

  .initials {
    color: rgba(137, 203, 31, 1);
  }
}

.new-divider {
  display: inline-block;
  background: #3e3e3e80;
  border-radius: 32px;
  padding: 0 8px;
  margin: 12px 24px;
  display: flex;
  justify-content: center;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ava {
  font-size: 14px;
}

.message {
  max-width: 100%;
  cursor: pointer;
  padding: 12px;
  line-height: 1.4;
  word-wrap: break-word;
  transition: transform 0.3s ease;
  display: inline-block;
  position: relative;
  &.swiped {
    transform: translateX(-60px);
  }
  .swipe-action {
    position: absolute;
    right: -35px;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;
    opacity: 0;
  }

  &.swiped .swipe-action {
    opacity: 1;
  }
  @media screen and (min-width: 960px) {
    max-width: 60%;
  }
}

.file-wrapper {
  width: 100%;
}

/* Свои сообщения (справа) */
.message.mine {
  align-self: flex-end;
  background: #e7f5d2;
  border-radius: 16px 16px 4px 16px;
  /* animation: slideInRight 300ms ease-out forwards; */
}
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Сообщения собеседника (слева) */
.message.theirs {
  align-self: flex-start;
  background: #ffffff;
  border-radius: 16px 16px 16px 4px;
  /* animation: slideInLeft 300ms ease-out forwards; */
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.message-content {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 8px;
  word-break: break-word;
  overflow-wrap: break-word;
  width: 100%;
  &.with-attachments {
    flex-direction: column;
    align-items: flex-start;
  }
}
.message-meta {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  gap: 4px;
  font-size: 12px;
  color: #7a7a7a;
  white-space: nowrap;
  align-self: flex-end;
}

.message-time {
  font-size: 12px;
  color: #7a7a7a;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.message-actions-menu,
.custom-menu,
.menu-list,
.message-action-item {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.message-status v-icon {
  font-size: 16px;
}
/* .file-attachment {
  gap: 8px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
} */
.file-attachment {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
/* Если контейнер содержит только один элемент, устанавливаем фиксированную ширину */
.file-attachment:has(> :only-child) {
  /* grid-template-columns: 290px; */
}

.message-content:has(.all-images) {
  flex-direction: column;
  width: 100%; // Ensure full width
}
.down {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: auto;
  padding: 8px 10.5px;
  border-radius: 24px;
  cursor: pointer;
  background-color: rgba(137, 203, 31, 1);
  gap: 8px;
  align-items: center;
  z-index: 10;
  &_icon {
    color: rgba(137, 203, 31, 1);
  }
  &_wrapper {
    background-color: #fff;
    width: 24px;
    height: 24px;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &_count {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
    font-family: "Open Sans";
    @media screen and (max-width: 767px) {
      font-size: 14px;
    }
  }
}

.all-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: dense;
  gap: 4px;
  width: 100%;
  :deep(.file-card) {
    padding: 0;
    min-width: 124px;
    min-height: 147px;
    border-radius: none;
    cursor: pointer;
    overflow: hidden; // Hide overflow
    height: 100%;
    border-radius: 0px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover; // Cover the entire area
      object-position: center;
    }
  }
  > div:last-child:nth-child(2n - 1) {
    grid-column: span 2;
    :deep(.file-icon) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  :deep(.file-info),
  :deep(.ellipsis-menu) {
    display: none;
  }
  :deep(.file-icon) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
