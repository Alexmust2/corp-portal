<template>
  <c-slide-panel v-if="!showEdit" v-model="localValue" class="chat-info-panel">
    <template #header="{ closePanel }">
      <div class="d-flex flex-column" style="height: 100%">
        <div class="flex-grow-1"></div>

        <div class="d-flex justify-space-between align-end w-100 index">
          <div class="side-block left">
            <v-icon
              size="large"
              color="secondary"
              class="flex-shrink-0 chevron-left"
              @click="closePanel"
            >
              mdi-chevron-left
            </v-icon>
          </div>

          <div class="d-flex flex-column align-center mx-auto">
            <c-avatar
              size="56"
              :userId="colorAvatar"
              :first_name="chat.data?.first_name"
              :last_name="chat.data?.last_name"
              :color="chat.data?.color"
              :title="chat.data?.type === 'group' ? chat.data?.title : ''"
              :photo_path="
                chat.data?.type === 'group'
                  ? chat.data?.avatar?.file_path
                  : chat.data?.file_path
              "
              :activity_status="chat.data?.user_activity?.status"
            />
            <h3 class="mt-2 group-title">
              {{ displayName }}
            </h3>
            <div v-if="chat.data?.type === 'private'">
              {{
                chat.data?.user_activity?.status
                  ? "В сети"
                  : formatDateTime(chat.data?.user_activity?.updated_at)
              }}
            </div>
            <div v-else>
              {{ chatMembers || 0 }} {{ getMemberWord(chatMembers) }}
            </div>
          </div>
          <div class="side-block d-flex align-center justify-end right">
            <div
              class="edit-group"
              v-if="chat.data.type === 'group' && chat.role === 'owner'"
              @click="toggleEdit"
            >
              Изменить
            </div>
            <v-icon
              class="flex-shrink-0 delete-group"
              color="red"
              v-if="chat.role === 'owner' || chat.role === 'member'"
              :icon="
                chat.role === 'owner' || chat.data.type === 'private'
                  ? 'mdi-delete'
                  : 'mdi-logout'
              "
              @click="
                handleChatAction(
                  chat.data.chat_id,
                  chat.role === 'owner' || chat.data.type === 'private'
                    ? 'delete'
                    : 'leave'
                )
              "
            />
          </div>
        </div>
      </div>
    </template>
    <div class="border_type-1 d-flex pa-4">
      <div v-if="chat.data?.type === 'private'">
        <h2 class="pb-4">Личные данные</h2>
        <div class="d-flex ga-2 flex-column">
          <div class="d-flex ga-3 align-center">
            <v-icon color="secondary"> mdi-calendar-range </v-icon>
            <div class="d-flex flex-column">
              <div class="sm" style="color: rgb(var(--v-theme-secondary))">
                Дата рождения
              </div>
              {{
                chat.data?.chatMember?.user.birth_date
                  ? new Date(
                      chat.data?.chatMember?.user.birth_date
                    ).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "Не указано"
              }}
            </div>
          </div>
          <div class="d-flex ga-3 align-center">
            <v-icon color="secondary"> mdi-email-outline </v-icon>
            <div class="d-flex flex-column">
              <div class="sm" style="color: rgb(var(--v-theme-secondary))">
                Почта
              </div>
              {{ chat.data?.chatMember?.user.email || "Не указано" }}
            </div>
          </div>
          <div class="d-flex ga-3 align-center">
            <v-icon color="secondary"> mdi-cellphone </v-icon>
            <div class="d-flex flex-column">
              <div class="sm" style="color: rgb(var(--v-theme-secondary))">
                Личный телефон
              </div>
              {{ chat.data?.chatMember?.user.phone_number || "Не указано" }}
            </div>
          </div>
          <div class="d-flex ga-3 align-center">
            <v-icon color="secondary"> mdi-cellphone </v-icon>
            <div class="d-flex flex-column">
              <div class="sm" style="color: rgb(var(--v-theme-secondary))">
                Рабочий телефон
              </div>
              {{ chat.data?.chatMember?.user.work_phone || "Не указано" }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="w-100">
        <div class="d-flex justify-space-between">
          <h2 class="pb-4">Участники группы</h2>
          <v-icon @click="toggleAddSelect" class="add">mdi-plus-circle</v-icon>
        </div>
        <c-select
          v-if="showSelect"
          v-model="selectedUserIds"
          :items="availableUsers"
          item-title="full_name"
          class="addUser"
          item-value="id"
          :is-label-active="true"
          multiple
          :is-combobox="true"
          clear-on-select
          label="Выбрать участников"
          :return-object="false"
        >
          <template #selection="{ item, index }">
            <div class="d-flex">
              <v-chip class="user-chip mr-3" v-if="index < 2">
                <span>{{ item.raw.first_name }} {{ item.raw.last_name }}</span>
              </v-chip>
              <div v-if="index === 2" class="round">
                +{{ selectedUserIds.length - 2 }}
              </div>
            </div>
          </template>

          <template #item="{ item, props }">
            <v-virtual-scroll :items="[item]">
              <template v-slot:default="{ item }">
                <div
                  v-bind="props"
                  v-on="props.on"
                  class="d-flex align-center py-2 pl-3 cursor-pointer"
                >
                  <v-checkbox
                    true-icon="mdi-checkbox-outline"
                    base-color="secondary"
                    color="accent"
                    :ripple="false"
                    :hide-details="true"
                    density="compact"
                    @click.stop="toggleUserSelection(item.raw.id)"
                    :model-value="selectedUserIds.includes(item.raw.id)"
                  />
                  <c-avatar
                    v-bind="getAvatarProps(item.raw)"
                    :size="40"
                    class="pl-3 participants-avatar"
                  />
                  <div class="pl-5">
                    <div class="text-truncate">
                      {{ item.raw.full_name }}
                    </div>
                    <div
                      class="sm text-truncate"
                      style="color: rgb(var(--v-theme-secondary))"
                    >
                      {{ item.raw.role }}
                    </div>
                  </div>
                </div>
              </template>
            </v-virtual-scroll>
          </template>
          <template #prepend>
            <div class="prepend-btn-wrapper" v-if="selectedUserIds.length">
              <c-btn @click="saveParticipants" class="save-btn">
                Сохранить
              </c-btn>
            </div>
          </template>
          <template #no-data>
            <div class="text-center">
              Нет доступных участников для добавления
            </div>
          </template>
        </c-select>

        <div v-else>
          <div
            v-if="chat.data?.chatMembers && chat.data.chatMembers.length > 0"
          >
            <div
              v-for="(member, index) in chat.data?.chatMembers"
              :key="index"
              class="d-flex ga-2 align-center pb-2 pt-1 cursor-pointer"
              @click="chatWithUser(member.user.id)"
              style="border-bottom: 1px solid rgb(var(--v-theme-tertiary))"
            >
              <c-avatar
                size="45"
                :userId="member.user?.id"
                :first_name="member.user?.first_name"
                :last_name="member.user?.last_name"
                :color="member.user?.color"
                :photo_path="member.user?.avatar?.file_path || null"
                :activity_status="member.user?.activity?.status"
              />
              <div class="d-flex flex-column">
                <h3>
                  {{ member.user?.last_name }} {{ member.user?.first_name }}
                </h3>
                <div>
                  {{
                    !member?.user?.activity?.status
                      ? formatDateTime(member?.user?.activity?.updated_at)
                      : "В сети"
                  }}
                </div>
              </div>
              <v-icon
                class="ml-auto"
                v-show="member.role === 'owner'"
                :color="'rgba(137, 203, 31, 1)'"
                >mdi-star</v-icon
              >
            </div>
          </div>
          <div v-else class="text-center pa-4">
            В этой беседе пока нет участников.
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="d-flex justify-space-around align-center">
      <div
        :class="{
          category__item: true,
          category__item_active: activeTab === index,
        }"
        v-for="(tab, index) in tabs"
        @click="changeTab(index)"
        :key="index"
      >
        {{ tab }}
      </div>
    </div> -->
    <!-- <div class="mt-4">
      <div v-if="activeTab === 0">
        <div class="image-grid">
          <template v-for="message in messages" :key="message.id">
            <template v-if="message?.attachments?.length">
              <div
                v-for="attachment in message.attachments"
                :key="attachment.id"
              >
                <cGalleryImage
                  v-if="isImage(attachment.uploads.file_type)"
                  :file="attachment.uploads"
                  :width="190"
                  cover
                />
              </div>
            </template>
          </template>
        </div>
      </div>
      <div v-else-if="activeTab === 1">
        <div v-for="message in messages" :key="message.id">
          <div v-if="message?.attachments?.length" class="file-attachment">
            <div
              v-for="attachment in message?.attachments"
              :key="attachment.id"
            >
              <c-file-card
                v-if="attachment.uploads.file_type !== 'image/png'"
                :file="attachment.uploads"
                :is-chat-files="true"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="activeTab === 2"></div>
    </div> -->
  </c-slide-panel>
  <EditGroupPanel
    v-else
    :chat="chat"
    @closePanel="showEdit = false"
    @leave-chat="handleChatAction"
    @update-chat-title="updateChatTitle"
    @update-chat-photo="updateChatPhoto"
  ></EditGroupPanel>
</template>

<script>
// import { cGalleryImage } from "@/components/ui/GalleryImage";
import { useUserStore } from "@/store/user.store";
import EditGroupPanel from "./EditGroupPanel.vue";
import { getAvatarProps } from "@/globalFunctions/avatarUtils";
export default {
  name: "ChatInfoPanel",
  components: {
    EditGroupPanel,
  },
  props: {
    chat: {
      type: Object,
      required: true,
    },
    chatMembers: {
      type: Array,
      default: () => [],
    },
    messages: {
      type: Array,
      required: true,
      default: () => [],
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    formatDateTime: {
      type: Function,
      required: false,
      default: (date) => date,
    },
  },
  created() {
    this.getUsers();
  },
  data() {
    return {
      tabs: ["Медиа", "Файлы", "Ссылки"],
      activeTab: 0,
      showSelect: false,
      showEdit: false,
      users: [],
      selectedUserIds: [],
    };
  },
  // components: {
  //   cGalleryImage,
  // },
  emits: ["update:modelValue", "delete-chat", "leave-chat"], // обязательно
  computed: {
    localValue: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    colorAvatar() {
      if (this.chat.data.type === "private") {
        return this.chat.data.user_id;
      } else {
        return this.chat.data.id;
      }
    },
    displayName() {
      if (this.chat.data.type === "private") {
        return this.capitalizeFirstLetter(
          `${this.chat.data.first_name} ${this.chat.data.last_name}`.trim()
        );
      }
      return this.capitalizeFirstLetter(this.chat.data.title);
    },
    userId() {
      return useUserStore().user.id;
    },
    availableUsers() {
      const existingMemberIds = this.chat.data.chatMembers.map(
        (member) => member.user.id
      );
      return this.users
        .filter((user) => !existingMemberIds.includes(user.id))
        .sort((a, b) => {
          const nameA = `${a.last_name} ${a.first_name}`.toLowerCase();
          const nameB = `${b.last_name} ${b.first_name}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
    },
    selectedUsers() {
      return this.users.filter((user) =>
        this.selectedUserIds.includes(user.id)
      );
    },
    isOwner() {
      return this.chat.data.chatMembers[0].role === "owner";
    },
  },
  methods: {
    handleChatAction(chatId, actionType) {
      this.$emit(
        actionType === "delete" ? "delete-chat" : "leave-chat",
        chatId,
        actionType
      );
    },
    toggleEdit() {
      this.showEdit = true;
    },
    updateChatTitle(title) {
      this.$emit("update-chat-title", title);
    },
    updateChatPhoto(photo) {
      this.$emit("update-chat-photo", photo);
    },
    chatWithUser(userId) {
      if (userId === this.userId) return;
      this.$emit("chat-with-user", userId);
    },
    getAvatarProps,
    async getUsers() {
      try {
        const response = await this.$API.userApi.getAll();
        this.users = response.map((user) => ({
          id: user.id,
          photo: user.avatar ? user.avatar.file_path : null,
          color: user.color || "",
          full_name: user.full_name || "",
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          role: user.roles?.description || "",
          activity_status: user.activity ? user.activity.status : false,
          file_path: user.avatar ? user.avatar.file_path : null,
        }));
      } catch (error) {
        console.error("Ошибка при загрузке пользователей", error);
      }
    },
    isImage(fileType) {
      return ["image/png", "image/jpeg", "image/gif", "image/webp"].includes(
        fileType
      );
    },
    toggleAddSelect() {
      this.showSelect = !this.showSelect;
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
    toggleUserSelection(userId) {
      const index = this.selectedUserIds.indexOf(userId);
      if (index > -1) {
        this.selectedUserIds.splice(index, 1);
      } else {
        this.selectedUserIds.push(userId);
      }
    },
    async saveParticipants() {
      if (this.selectedUserIds.length < 1) {
        alert("Вы не выбрали участников.");
        return;
      }

      try {
        const chatData = {
          chatId: this.chat.data.chat_id,
          userIds: this.selectedUserIds,
        };

        const response = await this.$axios.post(
          `/api/chats/${this.chat.data.chat_id}/group-add`,
          chatData
        );

        if (response && response.status === 201) {
          const newMembers = this.createNewMembersArray(response.data);
          this.$emit("update-chat-members", newMembers);
          this.resetSelection();
        }
      } catch (error) {
        console.log("Ошибка при добавлении участников чата", error);
      }
    },
    createNewMembersArray() {
      return this.selectedUsers.map((user) => ({
        chat_id: this.chat.data.chat_id,
        created_at: new Date().toISOString(),
        deletedAt: null,
        joined_at: new Date().toISOString(),
        role: "member",
        updated_at: new Date().toISOString(),
        user: {
          full_name: `${user.last_name} ${user.first_name}`,
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          color: user.color,
          file_path: user.file_path,
          activity: {
            status: user.activity_status,
            updated_at: new Date().toISOString(),
          },
        },
        user_id: user.id,
      }));
    },
    resetSelection() {
      this.selectedUserIds = [];
      this.showSelect = false;
    },
    changeTab(index) {
      this.activeTab = index;
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-info-panel {
  @media screen and (min-width: 960px) {
    top: calc(var(--v-layout-py)) !important;
  }
}
.add {
  cursor: pointer;
}
.edit-group {
  cursor: pointer;
  font-size: 16px;
  color: rgba(176, 176, 176, 1);
  font-weight: 400;
  font-family: "Open Sans";
  line-height: 16px;
  text-decoration: underline;
  white-space: nowrap;
}

.category__item {
  cursor: pointer;
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  font-family: "Railway";
  color: rgba(120, 120, 120, 1);
  &_active {
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
    font-family: "Railway";
    cursor: pointer;
    color: rgba(137, 203, 31, 1);
    text-decoration: underline;
  }
}

.user-chip {
  height: 29px;
  background-color: #dfdfdf;
  max-width: 115px;
  width: 100%;
}

.v-chip__content {
  span {
    color: #787878;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.prepend-btn-wrapper {
  position: sticky;
  padding: 16px 12px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  transform: translateY(8px);
  z-index: 10;
}
.save-btn {
  width: 100%;
}

.side-block {
  width: 96px;
  display: flex;
  column-gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 63px;
  &.left {
    @media screen and (max-width: 768px) {
      align-items: start;
    }
  }
}

.group-title {
  @media screen and (max-width: 959px) {
    text-align: center;
    margin-bottom: 8px;
  }
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
</style>
