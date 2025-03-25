<template>
  <div class="auth-form">
    <h1 class="mb-5 h1 text-center text-primary">Авторизация</h1>
    <mobile-collage v-if="isMobile" />
    <form
      @submit.prevent="handleLogin"
      @keydown.enter.prevent="handleLogin"
      class="form"
    >
      <div class="form-group">
        <phoneInput
          class="auth-input"
          :class="{ 'auth-input_autocoplete': !phone }"
          v-model="phone"
          :label="isMobile ? 'Введите телефон' : 'Телефон'"
          :success="isPhoneValid && !error"
          :error="error"
          @phone-valid="handlePhoneValid"
          :type="'tel'"
        />
      </div>
      <div class="form-group">
        <passwordInput
          @focus="scrollToLoginButton"
          class="auth-input"
          :class="{ 'auth-input_autocoplete': !password }"
          v-model="password"
          :label="isMobile ? 'Введите пароль' : 'Пароль'"
          :success="isPasswordValid && !error"
          :error="error"
          :errorMessages="errorMessage"
        />
      </div>
      <div class="form-group">
        <button class="forgot sm" @click="goToRecovery" type="button">
          Забыли пароль?
        </button>
        <c-checkbox v-model="remember" v-if="isMobile"
          >Запомнить меня</c-checkbox
        >
      </div>
      <div class="form-actions">
        <c-btn
          ref="loginButton"
          class="login-btn"
          block
          :disabled="!isPasswordValid || !isPhoneValid || error"
        >
          Войти
        </c-btn>
        <c-checkbox v-model="remember" class="mb-5" v-if="!isMobile"
          >Запомнить меня</c-checkbox
        >
        <div class="help-container">
          <div class="help">
            <span>Еще нет аккаунта?</span>
            <button @click="goToRegistration">Зарегистрироваться</button>
          </div>
          <v-tooltip
            :text="helpText"
            :model-value="isMobile ? show : undefined"
            :activator="isMobile ? 'manual' : undefined"
            location="top"
            :max-width="tooltipMaxWidth"
            :disabled="isTooltipDisabled"
          >
            <template v-slot:activator="{ props }">
              <v-icon
                v-bind="props"
                :class="['help-icon', isMobile ? 'mobile-help-icon' : '']"
                color="addition"
                @click="handleIconClick"
              >
                mdi-help-circle-outline
              </v-icon>
            </template>
          </v-tooltip>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from "@/store/auth.store";
import passwordInput from "@/components/widgets/PasswordInput";
import phoneInput from "@/components/widgets/PhoneInput";
import { MobileCollage } from "@/components/widgets/collage";
import { ROUTE_NAMES } from "@/router/routeNames";
import { createSocketManager } from "@/websocket";

export default {
  name: "login-page",
  components: {
    passwordInput,
    phoneInput,
    MobileCollage,
  },
  data() {
    return {
      phone: "",
      isPhoneValid: false,
      remember: true,
      password: "",
      error: false,
      errorMessage: "",
      show: false,
      tooltipTimeout: null,
      tooltipMaxWidth: 300,
      errorTimeout: null,
      helpText:
        "Введите ваш номер телефона, зарегистрированный в базе сотрудников и пароль. Если вход осуществляется впервые, зарегистрируйтесь, получив код подтверждения по SMS на зарегистрированный номер сотрудника.",
      socketManager: createSocketManager(),
    };
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    authStore() {
      return useAuthStore();
    },
    isTooltipDisabled() {
      return this.isMobile && window.innerWidth < 320;
    },
    isPasswordValid() {
      return this.password.length >= 8;
    },
  },
  // watch: {
  //   password() {
  //     this.clearError();
  //   },
  // },
  methods: {
    handleLogin() {
      this.$API.authApi
        .login(this.phone, this.password)
        .then((res) => {
          const token = res.token;
          localStorage.setItem("token", token);
          this.socketManager.reconnectSocket();
          this.$router.push({ name: ROUTE_NAMES.HOME });
        })
        .catch((err) => {
          this.setError(err.response.data.message);
        });
    },
    handleIconClick() {
      if (this.isMobile) {
        this.show = !this.show;
        this.adjustTooltipWidth();
        clearTimeout(this.tooltipTimeout);
        this.tooltipTimeout = setTimeout(() => {
          this.show = false;
        }, 3000);
      }
    },
    adjustTooltipWidth() {
      if (window.innerWidth < 375) {
        this.tooltipMaxWidth = window.innerWidth - 40;
      } else {
        this.tooltipMaxWidth = 300;
      }
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
    goToRecovery() {
      if (this.phone) this.authStore.setPhone(this.phone);
      this.authStore.setCurrentStep("recovery");
    },
    goToRegistration() {
      if (this.phone) this.authStore.setPhone(this.phone);
      this.authStore.setCurrentStep("registration");
    },
    handlePhoneValid(val) {
      this.isPhoneValid = val;
    },
    scrollToLoginButton() {
      this.$refs.loginButton?.$el?.scrollIntoView({ behavior: "smooth" });
    },
  },
  beforeUnmount() {
    clearTimeout(this.tooltipTimeout);
    clearTimeout(this.errorTimeout);
  },
};
</script>

<style lang="scss" scoped>
.auth-form {
  > .collage-container {
    margin-bottom: 40px;

    @media screen and (min-width: 960px) {
      margin-bottom: 0;
    }
    @media screen and (max-width: 440px) {
      min-width: 105%;
      transform: translateX(-2%);
    }
  }
}

.auth-input {
  display: block;
  max-height: 200px !important;
}

.form-actions {
  margin-top: auto;
  position: relative;
}

.forgot {
  color: rgb(var(--v-theme-addition));
  margin-right: auto;
  margin-top: 10px;
  margin-bottom: 30px;
  text-decoration: underline;

  @media screen and (min-width: 960px) {
    margin-left: auto;
    margin-right: 0;
    transform: translateY(-100%);
    font-weight: 600;
    text-decoration: none;
  }
  @media screen and (max-height: 667px) {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 18px;
    line-height: 16px;
  }
  &:focus-visible {
    outline: 1px solid rgb(var(--v-theme-addition));
    border-radius: 5px;
    outline-offset: 3px;
  }
}
.help-container {
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 959px) {
    justify-content: space-between;
    align-items: flex-end;
  }
}
.help {
  color: rgb(var(--v-theme-addition));
  display: flex;
  gap: 5px;
  justify-content: center;
  flex-wrap: wrap;
  letter-spacing: 0.03em;
  font-size: 18px;

  @media screen and (min-width: 960px) {
    justify-content: flex-start;
  }
  @media screen and (max-width: 575px) {
    justify-content: flex-start;
    flex-direction: column;
  }
  > button {
    color: rgb(var(--v-theme-primary));
  }
}

.help-icon {
  display: block;
  // margin-left: auto;
  @media screen and (max-width: 959px) {
    margin-left: 0;
  }
}

.mobile-help-icon {
  font-size: 20px;
}

.login-btn {
  margin-bottom: 40px;
  @media screen and (max-width: 960px) {
    margin-bottom: 26px;
  }
}

.auth-input_autocoplete :deep(input:-webkit-autofill) {
  scale: 1.35;
  transform-origin: 1% 66%;
  caret-color: transparent !important;
  @media screen and (max-width: 960px) {
    scale: 1.3;
    transform-origin: 1% 64%;
  }
}
@media screen and (max-height: 667px) {
  .auth-form {
    > .collage-container {
      display: none;
    }
    > h1 {
      margin-bottom: 40px !important;
    }
  }
}
</style>
