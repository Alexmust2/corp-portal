<template>
  <c-slide-panel
    v-model="isModal"
    :title="'Редактирование'"
    class="edit-group-panel"
  >
    <template #header="{ closePanel }">
      <div class="d-flex align-center justify-space-between w-100">
        <v-icon size="large" color="secondary" @click="closePanel"
          >mdi-chevron-left</v-icon
        >
        <h1 class="title">
          {{ isMobile ? "Редактировать" : "Редактирование" }}
        </h1>
        <div style="width: 24px"></div>
        <!-- Пустой div для баланса -->
      </div>
    </template>
    <div class="d-flex align-center gc-5 mt-7" v-if="!isMobile">
      <c-avatar
        size="120"
        :userId="colorAvatar"
        :preview_photo="previewUrl"
        :first_name="chat.data?.first_name"
        :last_name="chat.data?.last_name"
        :title="chat.data?.type === 'group' ? chat.data?.title : ''"
        :color="chat.data?.color"
        :photo_path="
          isPhotoRemoved ? null : previewUrl || chat.data?.avatar?.file_path
        "
        :activity_status="chat.data?.user_activity?.status"
      />
      <div class="d-flex flex-column align-start ga-4">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="uploadPhoto"
          style="display: none"
        />
        <c-chip class="upload" clickable @click="triggerFileInput"
          >Загрузить новое фото</c-chip
        >
        <c-chip class="delete" v-if="hasPhoto" clickable @click="removePhoto"
          >Удалить фото</c-chip
        >
      </div>
    </div>
    <div class="d-flex flex-column align-center gc-5 mt-7" v-else>
      <c-avatar
        size="120"
        :userId="colorAvatar"
        :preview_photo="previewUrl"
        :first_name="chat.data?.first_name"
        :last_name="chat.data?.last_name"
        :color="chat.data?.color"
        :title="chat.data?.type === 'group' ? chat.data?.title : ''"
        :photo_path="
          isPhotoRemoved ? null : previewUrl || chat.data?.avatar?.file_path
        "
        :activity_status="chat.data?.user_activity?.status"
      />
      <div class="d-flex flex-column ga-2 text-center mt-3">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="uploadPhoto"
          style="display: none"
        />
        <p class="mobile-action upload" @click="triggerFileInput">
          Сменить фото
        </p>
        <p class="mobile-action delete" v-if="hasPhoto" @click="removePhoto">
          Удалить
        </p>
      </div>
    </div>
    <div>
      <label class="label-title" for="group-name">Название беседы</label>
      <c-input class="mt-3" v-model="groupName"></c-input>
    </div>
    <template #footer>
      <div class="d-flex flex-column ga-5">
        <c-btn @click="saveChanges" :disabled="!isChanged"
          >Сохранить изменения</c-btn
        >
        <div
          class="text-center exit"
          @click="leaveChat(chat.data.chat_id, 'leave-chat')"
        >
          Выйти из беседы
        </div>
      </div>
    </template>
  </c-slide-panel>
</template>
<script>
export default {
  name: "EditGroupPanel",
  props: {
    chat: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isModal: true,
      uploadedPhoto: null,
      previewUrl: null,
      newPhotoFile: null,
      isPhotoRemoved: false,
      groupName: this.capitalizeFirstLetter(this.chat.data.title),
    };
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggle() {
      this.isToggled = !this.isToggled;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async uploadPhoto(event) {
      const file = event.target.files[0];
      if (file) {
        this.newPhotoFile = file;
        this.isPhotoRemoved = false;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    async removePhoto() {
      this.newPhotoFile = null;
      this.previewUrl = null;
      this.isPhotoRemoved = true;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },

    leaveChat(chatId, actionType) {
      this.$emit('leave-chat', chatId, actionType);
    },

    async saveChanges() {
      const isPhotoChanged = this.newPhotoFile !== null;
      const isTitleChanged = this.groupName !== this.chat.data.title;

      try {
        let newAvatarPath = null;
        let updatedTitle = null;

        // Подготовка данных для обновления
        const updateData = {};
        if (isTitleChanged) {
          updateData.title = this.groupName;
          updatedTitle = this.groupName;
        }

        // Обновление аватара, если он изменен
        if (isPhotoChanged) {
          const formData = new FormData();
          formData.append("file", this.newPhotoFile);
          const avatarResponse = await this.$axios.put(
            `/api/chats/${this.chat.data.chat_id}/avatar`,
            formData
          );
          newAvatarPath = avatarResponse.data.file_path;
        } else if (this.isPhotoRemoved) {
          await this.$axios.delete(
            `/api/chats/${this.chat.data.chat_id}/avatar`
          );
          newAvatarPath = null;
        }
        if (
          Object.keys(updateData).length > 0 ||
          isPhotoChanged ||
          this.isPhotoRemoved
        ) {
          await this.$axios.put(
            `/api/chats/${this.chat.data.id}/edit`,
            updateData
          );

          if (this.isPhotoRemoved || isPhotoChanged) {
            this.$emit("update-chat-photo", newAvatarPath);
          }
          if (updatedTitle) {
            this.$emit("update-chat-title", updatedTitle);
          }
        }
        this.newPhotoFile = null;
        this.previewUrl = null;
        this.isPhotoRemoved = false;
        this.isModal = false;
      } catch (error) {
        console.error("Ошибка при сохранении изменений", error);
      }
    },
  },
  computed: {
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
    hasPhoto() {
      return this.newPhotoFile !== null || 
             this.previewUrl !== null || 
             (!this.isPhotoRemoved && this.chat.data?.avatar?.file_path);
    },
    isValidGroupName() {
      return this.groupName.trim().length >= 2;
    },

    isChanged() {
      return (
        (this.groupName !== this.chat.data.title && this.isValidGroupName) ||
        this.newPhotoFile !== null ||
        this.isPhotoRemoved
      );
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
.edit-group-panel {
  gap: 0px;
  max-width: 436px;
  @media screen and (min-width: 960px) {
    top: calc(var(--v-layout-py)) !important;
  }
  @media screen and (max-width: 768px) {
    max-width: 100%;
  }
}
.label-title {
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  font-family: "Raleway";
}
.exit {
  cursor: pointer;
  font-family: "Open Sans";
  font-size: 16px;
  line-height: 16px;
  color: rgba(235, 113, 113, 1);
}

.c-chip {
  height: 45px;
}

.mobile-action {
  font-family: "Open Sans";
  font-size: 16px;
  line-height: 24px;
  cursor: pointer;

  &.upload {
    color: rgba(62, 62, 62, 1);
  }

  &.delete {
    color: rgba(235, 113, 113, 1);
  }
}
</style>
