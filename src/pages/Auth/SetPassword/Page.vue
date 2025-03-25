<template>
  <div class="auth-form">
    <div class="form_header">
      <h1 class="h1">Новый пароль</h1>
    </div>
    <form @submit.prevent="setPassword" class="form">
      <div class="form-group">
        <passwordInput
          v-model="password"
          label="Введите новый пароль"
          :success="isPasswordValid && !error"
          :error="error"
        />
      </div>
      <div class="form-group">
        <passwordInput
          v-model="confirmPassword"
          label="Повторите пароль"
          :success="isConfirmPasswordValid && !error"
          :error="error"
          :errorMessages="errorMessage"
          :isAutocompleteHidden="true"
        />
      </div>
      <div class="form-actions">
        <c-btn block :disabled="!canSubmit || isSubmitting || error">
        Войти
      </c-btn>
      </div>
      <c-checkbox :modelValue="true" class="mt-10">Запомнить меня</c-checkbox>
    </form>
  </div>
</template>

<script>
import passwordInput from "@/components/widgets/PasswordInput";
import { useAuthStore } from "@/store/auth.store";
import { createSocketManager } from "@/websocket";

export default {
  name: "login-page",
  components: {
    passwordInput,
  },
  data() {
    return {
      password: "",
      confirmPassword: "",
      error: false,
      errorMessage: "",
      isSubmitting: false,
      socketManager: createSocketManager(),
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    isPasswordValid() {
      return this.password.length >= 8;
    },
    isConfirmPasswordValid() {
      return (
        this.confirmPassword.length >= 8 &&
        this.password === this.confirmPassword
      );
    },
    canSubmit() {
      return this.isPasswordValid && this.isConfirmPasswordValid;
    },
  },
  watch: {
    password() {
      this.clearError();
    },
    confirmPassword() {
      this.clearError();
    },
  },
  methods: {
    clearError() {
      this.error = null;
      this.errorMessage = "";
    },
    setPassword() {
      this.isSubmitting = true;

      this.$API.userApi
        .changePassword(this.password)
        .then(() => {
          this.goToHome();
          this.socketManager.reconnectSocket();
        })
        .catch((err) => {
          this.error = true;
          this.errorMessage = err.response.data.message;
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    goToHome() {
      this.$router.push({ name: "home" });
      this.authStore.setCurrentStep("login");
    },
  },
};
</script>
