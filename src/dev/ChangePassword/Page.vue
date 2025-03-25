<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>Установка пароля</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="changePassword">
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                label="Новый пароль"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :rules="[rules.required, rules.min]"
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                label="Повторите пароль"
                :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showConfirmPassword = !showConfirmPassword"
                :rules="[rules.required, rules.match]"
              ></v-text-field>
              <v-btn color="primary" type="submit" :disabled="!isFormValid"
                >Установить пароль</v-btn
              >
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useUserStore } from "@/store/user.store";

export default {
  name: "change-password-page",
  data() {
    return {
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      useUserStore: useUserStore(),
      rules: {
        required: (v) => !!v || "Это поле обязательно",
        min: (v) => v.length >= 8 || "Минимум 8 символов",
        match: (v) => v === this.password || "Пароли не совпадают",
      },
    };
  },
  computed: {
    isFormValid() {
      return (
        this.password.length >= 8 && this.password === this.confirmPassword
      );
    },
    authUser() {
      return this.useUserStore.user;
    },
  },
  methods: {
    async changePassword() {
      if (this.isFormValid) {
        await this.useUserStore.updateUserPassword(this.password);
        this.$router.push("/");
      }
    },
  },
};
</script>
