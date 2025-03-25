<template>
  <c-slide-panel
    v-model="isModal"
    :title="'Создать беседу'"
    class="create-chat-panel"
  >
    <template #header="{ closePanel }">
      <div class="d-flex align-center" v-if="!isChatCreate">
        <v-icon size="large" color="secondary" @click="closePanel"
          >mdi-chevron-left</v-icon
        >
        <h1 class="title ml-2">Написать сообщение</h1>
      </div>
      <div class="d-flex align-center" v-else>
        <v-icon size="large" color="secondary" @click="isChatCreate = false"
          >mdi-chevron-left</v-icon
        >
        <h1 class="title ml-2">Создать беседу</h1>
      </div>
      <div
        :class="{
          'pt-5 d-flex flex-column gr-3': isMobile,
          'pt-5 d-flex ga-5': !isMobile,
        }"
      >
        <SearchInput
          class="w-100 search-input"
          v-model="usersSearchQuery"
          :height="35"
          placeholder="Поиск"
        />
        <div class="d-flex gc-1 align-center">
          <v-chip
            v-for="user in selectedUsers.slice(0, isMobile ? 2 : 1)"
            :key="user.id"
            class="user-chip mb-2"
          >
            <span> {{ user.full_name }}</span>
          </v-chip>
          <div
            v-if="
              isMobile ? selectedUsers.length > 2 : selectedUsers.length > 1
            "
            class="round ml-2"
          >
            +{{ showMoreUsers }}
          </div>
        </div>
      </div>
    </template>

    <!-- ГРУППИРОВАНИЕ ПОЛЬЗОВАТЕЛЕЙ ПО БУКВАМ -->
    <loader-wrapper :loading="loading" :is-mobile="isMobile">
      <div class="users-list">
        <template v-for="group in groupedUsers" :key="group.letter">
          <div
            v-if="
              group.users.length > 0 &&
              group.users.some((user) => user.id !== userId)
            "
          >
            <!-- Разделитель -->
            <div class="letter-separator sm">
              {{ group.letter }}
            </div>
            <!-- Список пользователей внутри группы -->
            <template v-for="item in group.users" :key="item.id">
              <div
                v-if="item.id !== userId"
                class="user-content"
                @click="handleUserClick(item)"
              >
                <v-checkbox
                  v-if="isChatCreate"
                  class="pr-3"
                  true-icon="mdi-checkbox-outline"
                  false-icon="mdi-checkbox-blank-outline"
                  base-color="secondary"
                  color="accent"
                  :ripple="false"
                  :hide-details="true"
                  density
                  v-model="selectedUserIds"
                  :value="item.id"
                  @click.stop
                />
                <c-avatar
                  size="40"
                  :userId="item.id"
                  :first_name="item.first_name"
                  :color="item.color"
                  :last_name="item.last_name"
                  :photo_path="item.file_path"
                  :activity_status="item.activity_status"
                />
                <div class="pl-5">
                  <div>{{ item.full_name }}</div>
                </div>
                <v-icon
                  v-if="!isChatCreate"
                  color="rgba(176, 176, 176, 1)"
                  class="ml-auto"
                  >mdi-chat-outline</v-icon
                >
              </div>
            </template>
          </div>
        </template>
      </div></loader-wrapper
    >

    <!-- /ГРУППИРОВАНИЕ ПОЛЬЗОВАТЕЛЕЙ ПО БУКВАМ -->

    <template #footer>
      <div>
        <c-btn
          :class="{
            'w-100 my-3': isMobile,
            'mt-8': !isMobile,
          }"
          v-if="!isChatCreate"
          @click="enterChatCreateMode"
        >
          Создать беседу
        </c-btn>
        <div v-else class="d-flex align-center create-wrapper">
          <div class="photo-upload">
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              @change="handlePhotoUpload"
              style="display: none"
            />
            <label for="photo-upload" class="photo-upload-label">
              <template v-if="!photoPreview">
                <v-icon>mdi-camera</v-icon>
              </template>
              <img
                v-else
                :src="photoPreview"
                class="photo-preview"
                alt="Preview"
              />
            </label>
          </div>
          <div class="input-container">
            <c-input
              placeholder="Название"
              :not-border="true"
              :not-focus="true"
              v-model="groupName"
            />
          </div>
          <c-btn
            :disabled="selectedUserIds.length < 1 || groupName.length < 1"
            @click="createChatWithSelectedUsers"
          >
            Создать беседу
          </c-btn>
        </div>
      </div>
    </template>
  </c-slide-panel>
</template>

<script>
import SearchInput from "@/components/widgets/SearchInput";
import { useUserStore } from "@/store/user.store";
import LoaderWrapper from "@/components/ui/LoaderWrapper/Component.vue";

export default {
  name: "CreateChatPanel",
  components: {
    SearchInput,
    LoaderWrapper,
  },
  data() {
    return {
      isModal: true,
      isChatCreate: false,
      usersSearchQuery: "",
      users: [],
      groupName: "",
      selectedUserIds: [],
      uploadedPhoto: null,
      photoPreview: null,
      loading: false,
    };
  },
  computed: {
    // Для фильтрации по поисковому запросу
    filteredUsers() {
      const query = this.usersSearchQuery.trim().toLowerCase();
      return this.users.filter((user) => {
        return (
          !query ||
          (user.full_name && user.full_name.toLowerCase().includes(query)) ||
          (user.role && user.role.toLowerCase().includes(query)) ||
          (user.first_name && user.first_name.toLowerCase().includes(query)) ||
          (user.last_name && user.last_name.toLowerCase().includes(query))
        );
      });
    },
    selectedUsers() {
      return this.users.filter((user) =>
        this.selectedUserIds.includes(user.id)
      );
    },
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    showMoreUsers() {
      return this.isMobile
        ? this.selectedUsers.length - 2
        : this.selectedUsers.length - 1;
    },
    // Для группировки по первой букве first_name
    groupedUsers() {
      const groups = {};
      this.filteredUsers.forEach((user) => {
        // Используем first_name, если last_name отсутствует
        const name = user.last_name || user.first_name;
        const letter = name[0]?.toUpperCase() || "#";
        if (!groups[letter]) {
          groups[letter] = [];
        }
        groups[letter].push(user);
      });
      // Сортируем буквы по алфавиту
      return Object.keys(groups)
        .sort()
        .map((letter) => ({
          letter,
          users: groups[letter],
        }));
    },
    userId() {
      return useUserStore().user.id;
    },
  },
  created() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      try {
        this.loading = true;
        const response = await this.$API.userApi.getAll({registered: true });
        this.users = response.map((user) => ({
          id: user.id,
          photo: user.avatar ? user.avatar.file_path : null,
          color: user.color || "",
          full_name:
            user.full_name || `${user.first_name} ${user.last_name}`.trim(),
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          role: user.roles?.description || "",
          activity_status: user.activity ? user.activity.status : false,
          file_path: user.avatar ? user.avatar.file_path : null,
        }));
      } catch (error) {
        console.error("Ошибка при загрузке пользователей", error);
      } finally {
        this.loading = false;
      }
    },
    handleUserClick(user) {
      if (this.isChatCreate) {
        this.toggleUserSelection(user.id);
      } else {
        this.$emit("openUserChat", user.id);
        this.isModal = false;
      }
    },
    handlePhotoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedPhoto = file;
        this.createPhotoPreview(file);
        // You can also add preview functionality here if needed
      }
    },
    createPhotoPreview(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    toggleUserSelection(userId) {
      const index = this.selectedUserIds.indexOf(userId);
      if (index > -1) {
        this.selectedUserIds.splice(index, 1);
      } else {
        this.selectedUserIds.push(userId);
      }
    },
    enterChatCreateMode() {
      this.isChatCreate = true;
      this.selectedUserIds = [];
    },
    async createChatWithSelectedUsers() {
      if (this.selectedUserIds.length < 1 || !this.groupName.trim()) {
        if (this.selectedUserIds.length < 1) {
          alert("Выберите хотя бы одного пользователя для создания беседы.");
        }
        return;
      }
      try {
        const formData = new FormData();
        formData.append("type", "group");
        formData.append("title", this.groupName);
        [this.userId, ...this.selectedUserIds].forEach((memberId, index) => {
          formData.append(`members[${index}]`, memberId);
        });

        this.uploadedPhoto
          ? formData.append("file", this.uploadedPhoto)
          : formData.append("file", null);
        const response = await this.$axios.post("/api/chats", formData);
        this.$emit("chatCreated", response.data);
        this.isModal = false;
        this.isChatCreate = false;
        this.selectedUserIds = [];
        this.uploadedPhoto = null;
        this.photoPreview = null;
        return response.data;
      } catch (error) {
        console.error("Ошибка при создании беседы", error);
        alert("Ошибка при создании беседы");
      }
    },
  },
  watch: {
    isModal(val) {
      if (!val) {
        this.$emit("closePanel");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.create-chat-panel {
  gap: 0px;
}

.input-container {
  flex-grow: 1;
  min-height: 50px; // Установите это значение в зависимости от высоты вашего инпута и сообщения об ошибке
  display: flex;
  flex-direction: column;
}

.user-content {
  display: flex;
  align-items: center;
  margin-top: 8px;
  cursor: pointer;
  height: 61px;
  border-bottom: 1px solid rgb(var(--v-theme-tertiary));
}
.letter-separator {
  background-color: rgb(var(--v-theme-tertiary));
  padding: 0px 20px;
  line-height: 21px;
  font-weight: 600;
  font-size: 14px;
  margin-top: 8px;
  color: #333;
}

.create-wrapper {
  border: 1px solid rgba(223, 223, 223, 1);
  padding: 22px 16px;
  border-radius: 12px;
  align-items: flex-start;
  @media screen and (max-width: 767px) {
    padding: 11px 16px;
  }
}

.photo-upload {
  display: flex;
  align-items: center;
}

.photo-preview {
  width: 100%;
  border-radius: 50%;
  border: 1px solid rgba(223, 223, 223, 1);
  height: 100%;
  object-fit: cover;
}

.photo-upload-label {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid rgba(223, 223, 223, 1);
  transition: background-color 0.3s;
}

.v-chip {
  background-color: rgba(223, 223, 223, 1);
  font-size: 16px;

  font-family: "Open Sans";
  font-weight: 400;
  line-height: 24px;
  border-radius: 32px;
  padding: 8px 12px;
  margin: 0px !important;
  max-width: 209px;

  @media screen and (max-width: 767px) {
    max-width: 130px;
    width: 100%;
    line-height: 21px;
    font-size: 14px;
  }

  :deep(.v-chip__content) {
    width: 100%;
    overflow: hidden;

    span {
      display: block;
      color: #787878;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
  }
}
</style>
