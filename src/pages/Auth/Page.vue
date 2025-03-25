<template>
  <div
    class="wrapper d-flex w-100 align-center"
  >
    <div class="left-side">
      <div class="card d-flex flex-column align-center mx-auto">
        <v-img
          src="/assets/logo.svg"
          alt="Логотип"
          width="82"
          class="mb-15 d-none d-md-block"
        ></v-img>
        <component :is="currentComponent"></component>
      </div>
    </div>

    <div class="right-side h-100 d-none d-md-flex">
      <desktop-collage />
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/store/auth.store";
import Login from "./Login";
import Registration from "./Registration";
import Recovery from "./Recovery";
import Otp from "./Otp";
import SetPassword from "./SetPassword";
import { DesktopCollage, MobileCollage } from "@/components/widgets/collage";

export default {
  name: "auth-page",
  components: {
    Login,
    Registration,
    Recovery,
    Otp,
    SetPassword,
    DesktopCollage,
    MobileCollage,
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    currentComponent() {
      const stepToComponentMap = {
        login: "Login",
        registration: "Registration",
        recovery: "Recovery",
        otp: "Otp",
        setPassword: "SetPassword",
      };
      return stepToComponentMap[this.authStore.currentStep] || "Login";
    },
  },
};
</script>

<style lang="scss" src="./styles.scss" scoped></style>
