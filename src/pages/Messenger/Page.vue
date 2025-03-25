<template>
  <div
    :class="[
      chats.length ? 'block' : 'no-block',
      { loading: loading && !chats.length },
    ]"
  >
    <!-- Chat List Block -->
    <div
      class="chat-list-block"
      v-if="(isMobile ? !selectedChat : true) && chats.length > 0"
    >
      <div
        class="search-block"
        :class="{ 'search-block-empty': chats.length === 0 }"
      >
        <SearchInput v-model="searchQuery" placeholder="Поиск"></SearchInput>
        <v-icon
          class="ml-auto"
          size="small"
          icon="mdi-pencil-plus"
          @click="toggleCreateChatModal"
        ></v-icon>
      </div>
      <div class="chat-list" v-auto-animate>
        <ChatListElement
          v-for="(chat, index) in filteredChats"
          :key="chat.data.chat_id"
          :chat="chat"
          :index="index"
          :isActive="
            selectedChat && selectedChat.data.chat_id === chat.data.chat_id
          "
          @selectChat="selectChat"
          :filteredChatId="chat.data.chat_id"
          @pinChat="(chatId) => pinChat(chatId)"
          @updateChat="updateChatState"
          @deleteChat="showConfirmModal"
        ></ChatListElement>
      </div>
    </div>

    <!-- Chat Block -->
    <loader-wrapper
      v-if="
        loading ||
        ((isMobile ? selectedChat : true) && chats.length > 0) ||
        chats.length === 0
      "
      :class="[!loading && chats.length > 0 ? 'chat-block' : '', 
       chats.length > 0 ? 'width-75' : 'width-100']"
      :loading="loading"
      :is-mobile="isMobile"
    >
      <ChatBlock
        ref="chatBlock"
        v-if="shouldShowChatBlock"
        v-model:selectedChat="selectedChat"
        @messageRead="onMessageRead"
        @updateChat="updateChatState"
        @deleteChat="showConfirmModal"
        @leaveChat="showConfirmModal"
        @deleteMessage="showConfirmModal"
        @update-chat-title="updateChatTitle"
        @update-chat-photo="updateChatPhoto"
        @chat-with-user="openUserChat"
        @pinChat="(chatId) => pinChat(chatId)"
        :isPinned="selectedChat.pinned"
      ></ChatBlock>

      <div v-else-if="chats.length > 0" class="h-100">
        <div class="h-100 d-flex align-center justify-center">Выберите чат</div>
      </div>

      <div
        v-else-if="!loading && chats.length === 0"
        class="empty-chat-container"
      >
        <div class="empty-chat-content">
          <img
            src="/assets/illustrations/messages.png"
            alt="Нет чатов"
            class="empty-chat-image"
          />
          <div class="empty-chat-content_main">
            <div class="empty-chat-text">
              <h2 class="empty-chat-title">У вас пока нет чатов</h2>
              <p class="empty-chat-description">
                Ваши чаты появятся здесь, как только вы начнете общение.
                Создайте первый диалог и возвращайтесь к нему в любое время.
              </p>
            </div>
            <c-btn
              size="sm"
              @click="toggleCreateChatModal"
              class="start-chat-btn"
              >Начать чат</c-btn
            >
          </div>
        </div>
      </div>
    </loader-wrapper>
    <!-- Компонент с панелью -->
    <CreateChatPanel
      v-if="showPanel"
      @closePanel="showPanel = false"
      @openUserChat="openUserChat"
      @chatCreated="onChatCreated"
    />
  </div>

  <transition name="fade">
    <div v-if="showOverlay" class="overlay" @click.stop="closeModal"></div>
  </transition>
  <ConfirmModal
    :options="dialogOptions"
    @confirm="handleChatAction"
    @close="closeModal"
    :single-button="showSingle"
    v-model="showModal"
  />
</template>

<script>
import ChatListElement from "./ChatListElement.vue";
import ChatBlock from "./ChatBlock.vue";
import SearchInput from "@/components/widgets/SearchInput";
import { socket } from "@/websocket";
import { useUserStore } from "@/store/user.store";
import { useHeaderStore } from "@/store/header.store";
import CreateChatPanel from "./CreateChatPanel.vue";
import { ConfirmModal } from "@/components/ui";
import LoaderWrapper from "@/components/ui/LoaderWrapper/Component.vue";
// import introJs from "intro.js";
// import "intro.js/minified/introjs.min.css";
import { onboardingService } from "@/globalFunctions/onBoarding";
export default {
  name: "ChatPage",
  components: {
    ChatListElement,
    ChatBlock,
    SearchInput,
    CreateChatPanel,
    ConfirmModal,
    LoaderWrapper,
  },
  data() {
    return {
      searchQuery: "", // Search query for chats
      chats: [], // List of chats
      selectedChat: null, // Currently selected chat
      showPanel: false, // Control panel visibility
      showModal: false, // Confirm modal visibility
      showEdit: false, // Edit group panel visibility
      dialogOptions: {
        title: "",
        text: "",
        cancelText: "Отмена",
        confirmText: "Удалить",
      },
      chatToDelete: null,
      chatActionType: null,
      messageToDelete: null,
      loading: false,
      showOverlay: false,
      showSingle: false,
      isStateChanged: false,
    };
  },
  emits: ["pin-chat"],
  created() {
    this.updateHeaderVisibility();
    socket.on("userStatus", this.updateUserStatus);
    socket.on("editMessage", this.updateEditedMessage);
    socket.on("newMessage", this.handleNewMessage);
    socket.on("newChat", this.addNewChat);
    socket.on("messageDeleted", () => this.handleDeleteMessageEventInChat());
    this.fetchChats();
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  },
  watch: {
    isMobile: "updateHeaderVisibility",
    selectedChat: "updateHeaderVisibility",
    // "$route.params.id": {
    //   handler(newId) {
    //     if (!newId) {
    //       this.selectedChat = null;
    //     } else {
    //       this.fetchChats(newId);
    //     }
    //   },
    // },
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    userId() {
      return useUserStore().user.id;
    },
    shouldShowChatBlock() {
      return (
        (this.isMobile ? this.selectedChat : true) &&
        this.chats.length > 0 &&
        this.selectedChat
      );
    },
    filteredChats() {
      const query = this.searchQuery.trim().toLowerCase();
      const uniqueChats = Array.from(
        new Set(this.chats.map((chat) => chat.data.chat_id))
      ).map((chatId) =>
        this.chats.find((chat) => chat.data.chat_id === chatId)
      );

      let filtered = uniqueChats.filter((chat) => {
        const title = (chat.data.title || "").toLowerCase();
        return !query || title.includes(query);
      });

      filtered.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        const aDate = new Date(a.data.message?.created_at || 0);
        const bDate = new Date(b.data.message?.created_at || 0);
        return bDate - aDate;
      });

      return filtered;
    },
  },
  methods: {
    onMessageRead() {
      if (this.selectedChat && this.selectedChat.data.unreadMessagesCount > 0) {
        this.selectedChat.data.unreadMessagesCount--;
      }
    },
    continueOnboarding() {
      onboardingService.startPageOnboarding("messenger");
      onboardingService.setRouter(this.$router);
    },
    updateChatTitle(title) {
      this.selectedChat.data.title = title;
    },
    updateChatPhoto(photo) {
      if (!this.selectedChat.data.avatar) {
        this.selectedChat.data.avatar = {};
      }
      this.selectedChat.data.avatar.file_path = photo || null;

      this.$forceUpdate();
    },
    handleNewMessage(message) {
      const chatIndex = this.chats.findIndex(
        (chat) => chat.data.chat_id == message.chat_id
      );
      if (this.chats[chatIndex]) {
        // Создаем новый объект чата
        const updatedChat = JSON.parse(JSON.stringify(this.chats[chatIndex]));

        // Обновляем последнее сообщение в чате
        updatedChat.data.message = message;

        // Увеличиваем счетчик непрочитанных сообщений, если сообщение не от текущего пользователя
        if (message.sender_id !== this.userId) {
          updatedChat.data.unreadMessagesCount =
            (updatedChat.data.unreadMessagesCount || 0) + 1;
        }

        // Обновляем чат в массиве
        this.chats[chatIndex] = updatedChat;

        // Перемещаем чат в начало списка
        this.chats.splice(chatIndex, 1);
        this.chats.unshift(updatedChat);

        // Если это выбранный чат, обновляем его
        if (
          this.selectedChat &&
          this.selectedChat.data.chat_id === message.chat_id
        ) {
          this.selectedChat = updatedChat;
        }
        this.$forceUpdate();
      } else {
        console.log("Получено сообщение для неизвестного чата:", message);
      }
    },
    showConfirmModal(chatId, actionType, messageId) {
      this.chatToDelete = chatId;
      this.messageToDelete = messageId;
      this.chatActionType = actionType;

      const isDelete = actionType === "delete";
      const isMessageDelete = Boolean(this.messageToDelete);

      const getTitleAndText = () => {
        if (isDelete && !isMessageDelete) {
          return {
            title: "Вы уверены, что хотите удалить чат?",
            text: "Все сообщения из этого чата будут удалены без возможности восстановления.",
          };
        }
        if (isMessageDelete) {
          return {
            title: "Вы уверены, что хотите удалить сообщение?",
            text: "Сообщение будет удалено у всех участников.",
          };
        }
        return {
          title: "Вы уверены, что хотите покинуть чат?",
          text: "Вы покинули этот чат.",
        };
      };

      const { title, text } = getTitleAndText();

      this.dialogOptions = {
        title,
        text,
        cancelText: "Отмена",
        confirmText: isDelete || isMessageDelete ? "Удалить" : "Покинуть",
      };
      this.showSingle = false;
      this.showModal = true;
      this.showOverlay = true;
    },
    updateChatState(updatedChat) {
      const chatId = updatedChat.data.chat_id;
      const chatIndex = this.chats.findIndex(
        (chat) => chat.data.chat_id === chatId
      );
      if (chatIndex === -1) return;

      // Создаем копию обновленного чата
      const updatedChatCopy = JSON.parse(JSON.stringify(updatedChat));

      // Обновляем чат в массиве
      this.chats[chatIndex] = updatedChatCopy;

      // Проверяем, изменилось ли время последнего сообщения
      const oldLastMessageTime = new Date(
        this.chats[chatIndex].data.message?.created_at || 0
      ).getTime();
      const newLastMessageTime = new Date(
        updatedChat.data.message?.created_at || 0
      ).getTime();

      // Перемещаем чат только если изменилось время последнего сообщения
      if (newLastMessageTime > oldLastMessageTime) {
        const [movedChat] = this.chats.splice(chatIndex, 1);
        this.chats.unshift(movedChat);
      }

      // Обновляем выбранный чат, если это текущий чат
      if (this.selectedChat && this.selectedChat.data.chat_id === chatId) {
        this.selectedChat = updatedChatCopy;
      }

      this.$forceUpdate();
    },
    addNewChat(data) {
      console.log("newChat socket event:", data);
      this.chats.push(data);
    },
    async handleChatAction() {
      if (this.dialogOptions.title === "Этот чат больше не доступен") {
        this.$router.push("/chat");
        return;
      }
      if (!this.chatToDelete) return;
      try {
        const endpoint =
          this.chatActionType === "delete" && !this.messageToDelete
            ? `/api/chats/${this.chatToDelete}`
            : this.messageToDelete
            ? `/api/chats/${this.chatToDelete}/messages/${this.messageToDelete}`
            : `/api/chats/${this.chatToDelete}/leave`;

        const method =
          this.chatActionType === "delete" || this.messageToDelete
            ? "delete"
            : "post";

        await this.$axios[method](endpoint);

        if (this.messageToDelete) {
          const chatIndex = this.chats.findIndex(
            (c) => c.data.chat_id === this.chatToDelete
          );
          if (chatIndex !== -1) {
            const chat = this.chats[chatIndex];

            if (
              chat.data.message &&
              chat.data.message.id === this.messageToDelete
            ) {
              const newLastMessage = this.$refs.chatBlock.messages
                .filter((m) => m.id !== this.messageToDelete)
                .pop();

              chat.data.message = newLastMessage || null;

              if (
                this.selectedChat &&
                this.selectedChat.data.chat_id === this.chatToDelete
              ) {
                this.selectedChat.data.message = newLastMessage || null;
              }
            }
            if (this.$refs.chatBlock) {
              this.$refs.chatBlock.deleteMessageFromArray(this.messageToDelete);
            }

            this.$forceUpdate();
          }
        } else {
          this.chats = this.chats.filter(
            (c) => c.data.chat_id !== this.chatToDelete
          );
          if (this.selectedChat?.data.chat_id === this.chatToDelete) {
            this.selectedChat = null;
            this.$router.push("/chat");
          }
        }
      } catch (error) {
        console.error("Ошибка", error);
      } finally {
        this.chatToDelete = null;
        this.chatActionType = null;
        this.messageToDelete = null;
        this.closeModal();
      }
    },
    closeModal() {
      this.showOverlay = false;
      this.$nextTick(() => {
        this.showModal = false;
      });
    },
    updateUserStatus({ userId, status }) {
      const chatIndex = this.chats.findIndex(
        (c) => c.data.user_id === Number(userId)
      );
      if (chatIndex !== -1) {
        const chat = this.chats[chatIndex];
        if (!chat.data.user_activity) {
          chat.data.user_activity = {};
        }
        chat.data.user_activity.status = status;
        chat.data.user_activity.updated_at = new Date().toISOString();
      }
    },
    toggleCreateChatModal() {
      this.showPanel = true;
    },
    selectChat(chat) {
      this.selectedChat = chat;
    },
    updateHeaderVisibility() {
      if (!this.isMobile || (this.isMobile && this.selectedChat != null)) {
        useHeaderStore().visibility = false;
      } else {
        useHeaderStore().visibility = true;
      }
    },
    async fetchChats() {
      this.loading = true;
      try {
        const response = await this.$axios.get("/api/chats");
        await new Promise((resolve) => {
          setTimeout(resolve, 300);
        });
        this.chats = response.data;
        const chatId = this.$route.params.id;
        if (chatId) this.handleRouteParams(chatId);
      } catch (error) {
        console.error("Ошибка при загрузке чатов", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchChatsLite() {
      try {
        const response = await this.$axios.get("/api/chats");
        this.chats = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке чатов", error);
      } finally {
        console.log('refetched after visibility change')
      }
    },
    async pinChat(chatId) {
      const chatIndex = this.chats.findIndex(
        (chat) => chat.data.chat_id === chatId
      );
      const isPinned = this.chats[chatIndex].pinned;

      try {
        const response = await this.$axios.post(`api/chats/${chatId}/pin`, {
          pinned: !isPinned,
        });
        if (response.status === 200) {
          this.chats[chatIndex].pinned = !isPinned;
        }
      } catch (error) {
        console.error("cant pin chat:", error);
      }
    },
    showErrorModal(message) {
      this.dialogOptions = {
        title: "Этот чат больше не доступен",
        text: message,
        confirmText: "Закрыть",
      };
      this.showSingle = true;
      this.showModal = true;
      this.showOverlay = true;
    },
    async handleRouteParams(chatId) {
      const isGroupChat = chatId.startsWith("-");
      chatId = parseInt(chatId);
      if (isGroupChat) {
        const chat = this.chats.find((c) => c.data.chat_id === chatId);
        if (chat) {
          this.selectChat(chat);
        } else {
          this.showErrorModal(
            "Ссылка, по которой вы пытаетесь перейти, больше не действует. Возможно, чат был удален, его срок действия истек, или вас удалили из чата."
          );
        }
      } else {
        let chat = this.chats.find((c) => c.data.chat_id === chatId);
        if (!chat) {
          try {
            const formData = new FormData();
            formData.append("type", "private");
            formData.append("title", null);
            formData.append("members[0]", this.userId);
            formData.append("members[1]", chatId);
            formData.append("file", null);
            const response = await this.$axios.post("/api/chats", formData);
            chat = response.data;
            this.addNewChat(chat);
          } catch (error) {
            console.error("Ошибка при создании чата", error);
            this.$router.push(`/chat/`);
            return;
          }
        }
        this.selectChat(chat);
      }
    },

    // Обработчики событий от CreateChatPanel
    openUserChat(userId) {
      // Логика та же, что и при handleRouteParams
      this.$router.push(`/chat/${userId}`);
      this.handleRouteParams(userId.toString());
      this.showPanel = false;
    },
    async onChatCreated(newChat) {
      try {
        this.chats.push(newChat);
        this.selectChat(newChat);
        this.$router.push(`/chat/${newChat.data.chat_id}`);
        await this.fetchChats();

        const updatedChat = this.chats.find(
          (chat) => chat.data.chat_id === newChat.data.chat_id
        );
        if (updatedChat) {
          this.selectChat(updatedChat);
        }
      } catch (error) {
        console.error("Ошибка при создании чата", error);
      } finally {
        this.showPanel = false;
      }
    },
    handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        this.fetchChatsLite();
      }
    },
    handleDeleteMessageEventInChat() {
      this.fetchChatsLite();
    }
  },
  mounted() {
    this.$nextTick(() => {
      // console.log("Chats:", this.chats);
      // console.log(
      //   "Onboarding state:",
      //   onboardingService.isOnboarding,
      //   onboardingService.currentStep
      // );
      // setTimeout(() => {
      //   const chatContent =
      //     document.querySelector(".empty-chat-container") ||
      //     document.querySelector(".chat-list");
      //   console.log("Chat content:", chatContent);

      //   if (
      //     chatContent &&
      //     onboardingService.isOnboarding &&
      //     onboardingService.currentStep === 2
      //   ) {
      //     this.continueOnboarding();
      //   } else {
      //     console.log("Onboarding conditions not met");
      //     console.log("Chat content exists:", !!chatContent);
      //     console.log("Is onboarding:", onboardingService.isOnboarding);
      //     console.log("Current step:", onboardingService.currentStep);
      //   }
      // }, 1500);
      if (onboardingService.shouldContinueOnboarding('messenger')) {
      this.continueOnboarding();
    }
    });
  },
  beforeUnmount() {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    socket.off("userStatus", this.updateUserStatus);
    // socket.off("editMessage", this.updateEditedMessage);
    // socket.off("newChat", this.addNewChat);
    socket.off("newMessage", this.handleNewMessage);
    socket.on("messageDeleted", () => this.handleDeleteMessageEventInChat());
    useHeaderStore().visibility = true;
  },
};
</script>

<style lang="scss" scoped src="./styles.scss" />
