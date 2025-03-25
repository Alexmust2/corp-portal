<template>
  <div class="auth-form">
    <div class="form_header">
      <div class="title">
        <button @click="goBack">
          <v-icon> mdi-chevron-left </v-icon>
        </button>
        <h1 class="h1">Добро пожаловать</h1>
      </div>
      <div class="text-center mb-5 lg">
        Введите номер телефона и мы отправим код для регистрации
      </div>
    </div>
    <form @submit.prevent="requestOtp" class="form">
      <div class="form-group">
        <phoneInput
          v-model="phone"
          label="Телефон"
          :success="isPhoneValid && !error"
          :error="error"
          :errorMessages="errorMessage"
          @phone-valid="handlePhoneValid"
        />
      </div>
      <div class="form-actions mt-2">
        <c-btn :disabled="!isPhoneValid || isSubmitting || error" block>
          Получить код
        </c-btn>
      </div>
    </form>
  </div>
</template>
<script>
import phoneInput from "@/components/widgets/PhoneInput";
import { useAuthStore } from "@/store/auth.store";

export default {
  name: "login-page",
  components: {
    phoneInput,
  },
  data() {
    return {
      phone: "",
      isPhoneValid: false,
      error: false,
      errorMessage: "",
      isSubmitting: false,
      errorTimeout: null,
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
  },
  created() {
    this.phone = this.authStore.phone;
  },
  methods: {
    clearError() {
      this.error = false;
      this.errorMessage = "";
    },
    requestOtp() {
      this.isSubmitting = true;

      this.$API.authApi
        .requestOtp(this.phone, "register")
        .then(() => {
          this.goOtp();
        })
        .catch((err) => {
          this.setError(err.response.data.message);
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    goBack() {
      this.authStore.setCurrentStep("login");
    },
    goOtp() {
      this.authStore.phone = this.phone;
      this.authStore.setCurrentStep("otp");
    },
    setError(message) {
      this.error = true;
      this.errorMessage = message;

      // Очищаем предыдущий таймаут, если он существует
      if (this.errorTimeout) {
        clearTimeout(this.errorTimeout);
      }

      // Устанавливаем новый таймаут для автоматического очищения ошибки
      this.errorTimeout = setTimeout(() => {
        this.clearError();
      }, 2000);
    },
    handlePhoneValid(val) {
      this.isPhoneValid = val;
    },
  },
  beforeUnmount() {
    clearTimeout(this.errorTimeout);
  },
};
</script>
