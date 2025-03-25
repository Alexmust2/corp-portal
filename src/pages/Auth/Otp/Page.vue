<template>
  <div class="auth-form d-flex">
    <div class="form_header">
      <div class="title">
        <button @click="goBack">
          <v-icon> mdi-chevron-left </v-icon>
        </button>
        <h1 class="h1">Введите код</h1>
      </div>
      <div class="text-center text-hint">
        Код подтверждения был отправлен на номер {{ maskedPhone }}
      </div>
    </div>
    <div class="form-group mb-4">
      <v-otp-input
        class="otp-input"
        ref="otpInput"
        v-model="otp"
        :length="6"
        type="number"
        outlined
        :success="otp.length > 0 && !error"
        :error="error"
      ></v-otp-input>
      <span class="error" v-if="error">
        {{ errorMessage }}
      </span>
    </div>

    <div class="resend-btn-wrap">
      <div v-if="timer > 0" class="resend-timer">
        Отправить код повторно ({{ formattedTimer }})
      </div>
      <div class="form-actions" v-else>
        <c-btn block @click="requestOtp" :disabled="isRequesting">
          Отправить код повторно</c-btn
        >
      </div>
    </div>

    <!-- <div class="support-btn">
      <button class="text-addition text-decoration-underline"  @click="console.log('')">Написать в поддержку</button>
    </div> -->
  </div>
</template>

<script>
import { useAuthStore } from "@/store/auth.store";

export default {
  name: "login-page",
  data() {
    return {
      otp: "",
      error: false,
      errorMessage: "",
      timer: 60,
      intervalId: null,
      isRequesting: false,
      errorTimeout: null,
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    maskedPhone() {
      let phone = this.phone;
      if (phone.length < 10) return "+7 *** ***-**-**";
      phone = "7" + phone.slice(1);

      const country = phone[0];
      const areaCode = phone.slice(1, 4);
      const firstDigit = phone[4];
      const lastDigit = phone[10];

      const maskedDigits = "*****";

      const formattedPhone = `+${country} (${areaCode}) ${firstDigit}${maskedDigits}${lastDigit}`;

      return formattedPhone;
    },
    formattedTimer() {
      const minutes = Math.floor(this.timer / 60);
      const seconds = this.timer % 60;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      return `${minutes}:${formattedSeconds}`;
    },
  },
  watch: {
    otp(newVal) {
      if (this.error) {
        this.error = false;
        this.errorMessage = "";
      }

      if (newVal.length === 6 && !this.isRequesting) {
        this.verifyOtp();
      }
    },
  },
  created() {
    this.phone = this.authStore.phone;
    this.startTimer();
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
  mounted() {
    // Устанавливаем фокус на поле OTP при загрузке страницы
    this.$nextTick(() => {
      this.$refs.otpInput?.focus(); // Вызываем метод focus() через ref
    });
  },
  methods: {
    startTimer() {
      this.timer = 60;

      this.intervalId = setInterval(() => {
        if (this.timer > 0) {
          this.timer -= 1;
        } else {
          clearInterval(this.intervalId);
        }
      }, 1000);
    },
    requestOtp() {
      this.isRequesting = true;

      this.$API.authApi
        .requestOtp(this.phone)
        .then(() => {
          this.startTimer();
        })
        .catch((err) => {
        this.setError(err.response.data.message);
        })
        .finally(() => {
          this.isRequesting = false;
        });
    },
    verifyOtp() {
      this.isRequesting = true;

      this.$API.authApi
        .verifyOtp(this.phone, this.otp)
        .then((res) => {
          localStorage.setItem("token", res.token);
          this.goSetPassword();
        })
        .catch((err) => {
          this.error = true;
          this.errorMessage = err.response.data.message;
          this.isRequesting = false;
        });
    },
    clearError() {
      this.error = false;
      this.errorMessage = "";
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

    goBack() {
      this.authStore.setCurrentStep("login");
    },
    goSetPassword() {
      this.authStore.setCurrentStep("setPassword");
    },
  },
};
</script>

<style lang="scss" scoped>
.buttonClass {
  height: 50px;
}

.v-otp-input :deep(.v-field.v-field--focused) .v-field__outline {
  color: rgb(var(--v-theme-accent));
}

.error {
  display: inline-block;
  width: 100%;
  text-align: center;
}

.resend-btn-wrap > * {
  @media screen and (min-width: 960px) {
    max-width: 450px;
    margin: 0 auto;
  }
}
.v-otp-input :deep(.v-otp-input__content) {
  --v-cell-side: 60px;
  --v-otp-input-gap: 18px;
  width: 100%;
  max-width: 450px;
  height: fit-content;
  padding: 0;
  @media screen and (min-width: 960px) {
    justify-content: space-between;
  }
}
.v-otp-input :deep(.v-field) {
  box-shadow: 0px 4px 4px 0px #b0b0b014;
  @media screen and (min-width: 960px) {
    width: 100%;
    aspect-ratio: 1/1;
    max-height: var(--v-cell-side);
    max-width: var(--v-cell-side);
  }
}
.otp-input,
.resend-btn-wrap {
  @media screen and (max-width: 959px) {
    width: min(100%, 530px);
    margin-inline: auto;
  }
}

.text-hint {
  display: inline-block;
  max-width: 32ch;
  margin-inline: auto;
  color: #3e3e3e;
}

.support-btn {
  display: block;
  height: fit-content;
  margin: auto;
  margin-bottom: 10px;
  font-size: 16px;
  button {
    text-decoration-skip-ink: none;
  }
  @media screen and (min-width: 960px) {
    margin-top: 100px;
  }
}
.v-otp-input[success="true"] * {
  --v-field-border-opacity: 1;
}

.v-otp-input[success="true"] {
  :deep(.v-field__outline) {
    color: rgb(var(--v-theme-accent));
  }
}

.resend-timer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  box-shadow: var(--v-shadow-input);
  border-radius: 12px;
  border: 1px solid rgb(var(--v-theme-addition));
}
</style>
