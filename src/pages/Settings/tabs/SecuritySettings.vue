<template>
  <base-settings-form @save="saveChanges" :showCancel="false">
    <template #header v-if="isMobile">
      <div class="header-block px-5">
        <v-icon size="x-large" color="secondary" @click="$router.go(-1)"
          >mdi-chevron-left</v-icon
        >
        <h1 class="h1 ma-auto">Безопасность</h1>
      </div>
    </template>
    <div class="form-field" v-role="'can_edit_phone'">
      <label class="h2">Сменить телефон</label>
      <phone-input block v-model="newUser.phone_number" />
    </div>

    <div class="form-field">
      <div class="label-block">
        <label class="h2">Текущий пароль</label>
      </div>
      <password-input
        :error="currentPasswordError"
        :errorMessages="currentPasswordError"
        block
        v-model="newPassword.current"
        @input="clearCurrentPasswordError"
      />
    </div>
    <div class="form-field">
      <label class="h2">Новый пароль</label>
      <password-input
        :error="newPasswordError"
        block
        v-model="newPassword.new"
        @input="clearNewPasswordError"
        :isAutocompleteHidden="true"
      />
    </div>

    <div class="form-field">
      <label class="h2">Повторите новый пароль</label>
      <password-input
        v-model="newPassword.repeat"
        block
        :error="newPasswordError"
        :errorMessages="newPasswordError"
        @input="clearNewPasswordError"
        :isAutocompleteHidden="true"
      />
    </div>
  </base-settings-form>
</template>

<script>
import headerVisibilityMixin from "../../../mixins/headerVisibilityMixin";
import BaseSettingsForm from "./BaseSettingsForm.vue";
import PasswordInput from "@/components/widgets/PasswordInput/Component.vue";
import PhoneInput from "@/components/widgets/PhoneInput/Component.vue";
import { useUserStore } from "@/store/user.store";

export default {
  components: {
    BaseSettingsForm,
    PasswordInput,
    PhoneInput,
  },
  mixins: [headerVisibilityMixin],
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newUser: { ...this.user },
      newPassword: {
        current: "",
        new: "",
        repeat: "",
      },
      currentPasswordError: null,
      newPasswordError: null,
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
  },
  methods: {
    clearCurrentPasswordError() {
      this.currentPasswordError = null;
    },
    clearNewPasswordError() {
      this.newPasswordError = null;
    },
    async saveChanges() {
      try {
        const updates = {};
        if (!this.newPassword.current) {
          this.currentPasswordError = "Поле не может быть пустым";
          return;
        }
        if (!this.newPassword.new || !this.newPassword.repeat) {
          this.newPasswordError = "Поле не может быть пустым";
          return;
        }
        if (this.newPassword.new !== this.newPassword.repeat) {
          this.newPasswordError = "Пароли не совпадают";
          return;
        }
        updates.oldPassword = this.newPassword.current;
        updates.newPassword = this.newPassword.new;

        if (this.newUser.phone_number !== this.user.phone_number) {
          updates.phone_number = this.newUser.phone_number;
        }

        if (Object.keys(updates).length > 0) {
          const response = await this.$API.userApi.updatePassword(
            this.newPassword.current,
            this.newPassword.new
          );
          if (response.status === "error") {
            this.currentPasswordError = response.message;
          } else {
            this.userStore.getUserByToken();
            this.$emit("success", "Изменения сохранены");
          }
        }
      } catch (error) {
        console.log(error);
        this.currentPasswordError =
          error.response.data?.message || "Ошибка при изменении пароля";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-field {
  label {
    display: block;
    margin-bottom: 12px;
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
