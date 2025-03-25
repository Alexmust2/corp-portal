<template>
  <div
    v-if="isVisible"
    class="border_type-1 user-card"
  >
    <div class="user-card-content">
      <div
        :class="[
          'user-image',
          'mr-3',
          {
            'user-image-with-photo': imageUrl,
            'user-image-without-photo': !imageUrl,
          },
        ]"
        :style="userImageBackgroundStyle"
      >
        <span v-if="!imageUrl" class="user-initials">{{ userInitials }}</span>
      </div>

      <div class="user-info">
        <h3 class="user-name">{{ userDetails.fullName }}</h3>
        <div class="user-job">
          <p>{{ userInfo }}</p>
        </div>
        <!--Оставляю функционал mail:to и tel на мобильной версии, а в компьюетере только копирую-->
        <a
          :href="isMobile ? 'mailto:' + userDetails.email : '#'"
          class="user-email"
          v-tooltip="!isMobile && 'Скопировать email'"
          @click="handleEmailClick"
          v-if="userDetails.email"
        >
          Почта: {{ userDetails.email }}
        </a>
        <a
          :href="isMobile ? 'tel:' + userDetails.phoneNumber : '#'"
          class="user-phone"
          v-tooltip="!isMobile && 'Скопировать номер'"
          @click="handlePhoneClick(userDetails.phoneNumber)"
          v-if="userDetails.phoneNumber"
          v-role="'show_user_phone'"
        >
          Личный телефон: {{ userDetails.phoneNumber }}
        </a>
        <a
          :href="isMobile ? 'tel:' + userDetails.workPhoneNumber : '#'"
          class="user-phone"
          @click="handlePhoneClick(userDetails.workPhoneNumber)"
          v-tooltip="!isMobile && 'Скопировать номер'"
          v-if="userDetails.workPhoneNumber"
        >
          Рабочий телефон: {{ userDetails.workPhoneNumber }}
        </a>
        <c-btn
          v-if="user.id !== authUser.id"
          size="sm"
          @click="writeMessage(user.id)"
          color="accent"
          :prepend-icon="icon"
          class="write-button text-no-wrap"
        >
          Написать в чат</c-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ClickOutside } from "vuetify/directives";
import { cBtn } from "@/components/ui/Btn";
import router from "@/router";
import { useUserStore } from "@/store/user.store";
import { generateColor } from "@/globalFunctions/generateColor";
import role from "@/directives/VRole";
export default {
  name: "c-user-card",
  props: {
    user: Object,
  },
  components: {
    cBtn,
  },
  data() {
    return {
      isVisible: true,
      router: router,
      icon: "mdi mdi-chat-processing-outline",
      isMobile: false,
    };
  },
  directives: {
    clickOutside: ClickOutside,
    role
  },

  mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkMobile);
  },

  methods: {
    generateColor,
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    onClickOutside() {
      this.$emit("close");
      this.isVisible = false;
    },
    writeMessage(id) {
      router.push(`/chat/${id}`);
      this.onClickOutside();
    },
    phoneFormat(str, plus = true) {
      if (!str) return;
      const startsWith = plus ? "+7" : "8";

      let phone = str?.replace(/[^0-9]/g, "");
      if (phone.startsWith("7") && plus) {
        phone = phone.substr(1);
      }
      if (phone.startsWith("8")) {
        phone = phone.substr(1);
      }

      return phone?.replace(
        /(\d{3})(\d{3})(\d{2})(\d{2})/g,
        `${startsWith} ($1) $2-$3-$4`
      );
    },

    copyToClipboard(text) {
      if (!text) return;
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.$emit("copied", text);
        })
        .catch(() => {
          console.error("Ошибка при копировании");
        });
    },

    handleEmailClick(event) {
      if (!this.isMobile) {
        event.preventDefault();
        this.copyToClipboard(this.userDetails.email);
      }
    },
    handlePhoneClick(phoneNumber) {
      if (!this.isMobile) {
        event.preventDefault();
        this.copyToClipboard(phoneNumber);
      }
    },
  },
  computed: {
    userInitials() {
      const firstInitial = this.user.first_name
        ? this.user.first_name.charAt(0)
        : "";
      const lastInitial = this.user.last_name
        ? this.user.last_name.charAt(0)
        : "";
      return (firstInitial + lastInitial).toUpperCase();
    },
    userInfo() {
      const { department = null, roles = {} } = this.user || {};

      const departmentInfo =
        department && department !== "Не указано"
          ? department
          : "Отдел: Не указан";

      const roleInfo = Object.keys(roles).length > 0 ? roles.name : "Должность: Не указана";

      if (!department && !Object.keys(roles).length ) {
        return "Отдел и роль не указаны";
      }

      return `${departmentInfo} • ${roleInfo}`;
    },
    userImageBackgroundStyle() {
      if (this.imageUrl) {
        return { "background-image": `url(${this.imageUrl})` };
      } else {
        return { "background-color": this.generateColor(this.user?.id) };
      }
    },

    authUser() {
      return useUserStore().user;
    },
    userDetails() {
      return {
        fullName: this.user?.full_name || "",
        email: this.user?.email || "",
        phoneNumber: this.phoneFormat(this.user?.phone_number) || "",
        workPhoneNumber: this.phoneFormat(this.user?.work_phone) || "",
      };
    },
    imageUrl() {
      return this.user && this.user?.avatar
        ? `${process.env.VUE_APP_API_URL}${this.user?.avatar.file_path}`
        : null;
    },
  },
};
</script>

<style lang="scss" scoped src="./styles.scss"></style>
