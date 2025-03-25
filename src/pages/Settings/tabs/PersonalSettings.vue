<template>
  <base-settings-form
    @save="submitForm"
    @cancel="resetForm"
    :is-save-disabled="isSaveDisabled"
  >
    <template #header v-if="isMobile">
      <div class="header-block px-5">
        <v-icon size="x-large" color="secondary" @click="$router.go(-1)"
          >mdi-chevron-left</v-icon
        >
        <h1 class="h1 ma-auto">Личные данные</h1>
      </div>
    </template>

    <div class="photo-section" v-if="!isMobile">
      <c-avatar
        class="cursor-pointer"
        @click="triggerFileInput"
        :preview_photo="avatarSrc"
        :showStatus="false"
        v-bind="getAvatarProps(newUser)"
        size="120"
      />
      <div class="photo-actions">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="uploadPhoto"
          style="display: none"
        />
        <c-chip clickable @click="triggerFileInput"
          >Загрузить новое фото</c-chip
        >
        <c-chip clickable @click="removePhoto">Удалить фото</c-chip>
      </div>
    </div>

    <div class="personal-info">
      <div class="form-field">
        <label class="h2">ФИО</label>
        <c-input disabled block v-model="newUser.full_name" />
      </div>

      <div class="form-field">
        <div class="label-block">
          <label class="h2">Дата рождения</label>
          <button
            class="label-action sm bold ml-auto"
            @click="changeBirthday"
            v-role="'canHide'"
          >
            Скрыть
          </button>
        </div>
        <c-input disabled block type="date" v-model="formattedBirthDate" />
      </div>

      <div class="form-field" v-role="'can_edit_role'">
        <label class="h2">Должность</label>
        <c-input block v-model="newUser.role" />
      </div>

      <div class="form-field">
        <label class="h2">Email</label>
        <c-input block v-model="newUser.email" />
      </div>
    </div>

    <div class="contacts-section">
      <div class="phone-group">
        <div class="work-phone">
          <label class="h2">Рабочий телефон</label>
          <phone-input
            block
            v-model="newUser.work_phone"
            @phone-empty="handlePhoneEmpty"
            @phone-valid="handlePhoneValid"
          />
        </div>
        <div class="extension-number">
          <label class="h2">Добавочный</label>
          <c-input block v-model="newUser.extension" />
        </div>
      </div>

      <div class="form-field">
        <div class="label-block">
          <label class="h2">Личный телефон</label>
          <button
            class="label-action sm bold ml-auto"
            @click="togglePhoneVisibility"
            v-role="'canHide'"
          >
            Скрыть
          </button>
        </div>
        <phone-input disabled block v-model="newUser.phone_number" />
      </div>
    </div>
  </base-settings-form>
</template>

<script>
import headerVisibilityMixin from "@/mixins/headerVisibilityMixin";
import BaseSettingsForm from "./BaseSettingsForm.vue";
import { useUserStore } from "@/store/user.store";
import PhoneInput from "@/components/widgets/PhoneInput/Component.vue";
import { getAvatarProps } from "@/globalFunctions/avatarUtils";
export default {
  components: {
    BaseSettingsForm,
    PhoneInput,
  },
  mixins: [headerVisibilityMixin],
  data() {
    return {
      newUser: {},
      avatarSrc: null,
      isSaveDisabled: false,
    };
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  beforeMount() {
    this.newUser = { ...this.user };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    formattedBirthDate: {
      get() {
        return this.formatDateForInput(this.newUser.birth_date);
      },
      set(value) {
        this.newUser.birth_date = value;
      }
    }
  },
  methods: {
    getAvatarProps,
    handlePhoneEmpty() {3
      this.isSaveDisabled = false;
    },
    handlePhoneValid(val) {
      this.isSaveDisabled = !val;
    },
    formatDateForInput(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    async submitForm() {
      try {
        const formData = this.createFormData();
        const response = await this.$API.userApi.updateProfile(formData);
        this.$emit("user-update", response);
      } catch (error) {
        console.error(error);
      }
    },
    resetForm() {
      this.newUser = { ...this.user };
      this.avatarSrc = null;
    },
    createFormData() {
      const formData = new FormData();
      Object.keys(this.newUser).forEach((key) => {
        const value = this.newUser[key];
        if (value !== null && value !== undefined) {
          if (typeof value === "object" && !(value instanceof File)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });
      return formData;
    },

    getHeaders() {
      return {
        "Content-Type": "multipart/form-data",
      };
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async uploadPhoto(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.avatarSrc = e.target.result;
        };
        reader.readAsDataURL(file);

        const response = await this.$API.userApi.updatePhoto(
          this.userStore.user.id,
          file
        );
        this.$emit("photo-update", response);
        if (!this.userStore.user.avatar) {
          this.userStore.user.avatar = {};
        }
        this.userStore.user.avatar.file_path = response.file_path;
      }
    },

    async removePhoto() {
      this.avatarSrc = null;
      if (this.newUser.avatar) {
        this.newUser.avatar.file_path = null;
      }
      const response = await this.$API.userApi.updatePhoto(
        this.userStore.user.id,
        null
      );
      this.$emit("photo-update", response);
      this.userStore.user.avatar = null;

      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.photo-section {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 0;

  .photo-actions {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }
}

.personal-info {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.contacts-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-field,
.phone-group {
  label {
    display: block;
    margin-bottom: 12px;
  }
}

.phone-group {
  display: flex;
  gap: 20px;

  .work-phone {
    flex: 3;
  }

  .extension-number {
    flex: 2;
  }
}

.label-block {
  display: flex;
  justify-content: space-between;
}

.label-action {
  color: rgb(var(--v-theme-addition));
  text-decoration: underline;
  font-size: 16px;
}
</style>
