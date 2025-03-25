<template>
  <div class="auth-form">
    <div class="form_header">
      <div class="title">
        <button @click="goBack">
          <v-icon> mdi-chevron-left </v-icon>
        </button>
        <h1 class="h1">Забыли пароль?</h1>
      </div>
      <div class="text-center mb-5 lg recovery-help text-primary">
        Введите номер телефона и мы отправим вам код для сброса пароля
      </div>
    </div>
    <form @submit.prevent="requestOtp" class="form">
      <div class="form-group">
        <phoneInput
          v-model="phone"
          label="Введите телефон"
          :success="isPhoneValid && !error"
          :error="error"
          :errorMessages="errorMessage"
          @clear-error="clearError"
          @phone-valid="handlePhoneValid"
        />
      </div>
      <div class="form-actions">
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
      this.error = null;
      this.errorMessage = "";
    },
    requestOtp() {
      this.$API.authApi
        .requestOtp(this.phone, "restore")
        .then(() => {
          this.goOtp();
        })
        .catch((err) => {
          this.error = true;
          this.errorMessage = err.response.data.message;
        });
    },
    goBack() {
      this.authStore.setCurrentStep("login");
    },
    goOtp() {
      this.authStore.phone = this.phone;
      this.authStore.setCurrentStep("otp");
    },
    handlePhoneValid(val) {
      this.isPhoneValid = val;
    },
  },
};
</script>

<style lang="scss" scoped>

  .recovery-help {
    @media screen and (min-width: 960px) {
      margin-inline: auto;
      height: fit-content;
      max-width: 40ch;
      text-align: center;
    }
  }

</style>
