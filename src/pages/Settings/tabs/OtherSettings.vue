<template>
  <base-settings-form @save="save" @cancel="resetChanges">
    <template #header v-if="isMobile">
      <div class="header-block px-5">
        <v-icon size="x-large" color="secondary" @click="$router.go(-1)"
          >mdi-chevron-left</v-icon
        >
        <h1 class="h1 ma-auto">Настройки</h1>
      </div>
    </template>
    <span class="h2">Настройка уведомлений</span>

    <c-chip-group class="chip-group mb-3" v-model="selectedTag">
      <c-chip
        class="chip"
        :value="tag.value"
        v-for="tag in tags"
        :key="tag.value"
      >
        {{ tag.title }}
      </c-chip>
    </c-chip-group>
    <div class="settings-container">
    <transition name="slide" mode="out-in">
      <div :key="selectedTag" class="settings-wrapper">
        <transition-group name="list" tag="div" class="settings-grid">
          <div
            v-for="setting in notificationTypeSettings"
            :key="setting.key"
            class="setting-row border_type-1"
          >
            <span>{{ setting.label }}</span>
            <c-switch v-model="setting.value" />
          </div>
        </transition-group>
      </div>
    </transition>
    </div>

    <div class="additional-settings" v-role="'canToggleTheme'">
      <span class="h2">Дополнительные настройки</span>
      <div class="setting-row mt-8 border_type-1">
        <span>Темная тема</span>
        <c-switch
          v-model="additionalSettings.theme"
          @change="switchTheme"
          withIcons
        />
      </div>
    </div>
  </base-settings-form>
</template>

<script>
import { settingsApi } from "@/api/settings.api";
import BaseSettingsForm from "./BaseSettingsForm.vue";
import headerVisibilityMixin from "../../../mixins/headerVisibilityMixin";

export default {
  components: {
    BaseSettingsForm,
  },
  mixins: [headerVisibilityMixin],
  data() {
    return {
      tags: [
        { value: "push", title: "Push", },
        { value: "email", title: "Email", },
      ],
      selectedTag: "push",
      notificationTypeSettings: [],
      additionalSettings: {
        theme: false,
      },
      allSettings: {},
    };
  },
  mounted() {
    this.loadSettings();
  },
  methods: {
    async loadSettings() {
      const response = await settingsApi.getNotificationSettingsByType(
        this.selectedTag.toLowerCase()
      );
      this.allSettings[this.selectedTag] = response.settings;
      this.notificationTypeSettings = this.allSettings[this.selectedTag];
    },
    switchTheme() {
      this.additionalSettings.theme = !this.additionalSettings.theme;
    },
    async save() {
      await settingsApi.updateNotificationSettings(this.allSettings);
    },
    resetChanges() {
      this.notificationTypeSettings = JSON.parse(
        JSON.stringify(this.originalSettings)
      );
    },
  },
  watch: {
    "additionalSettings.theme": {
      handler(value) {
        this.$vuetify.theme.global.name = value ? "dark" : "light";
      },
    },
    selectedTag() {
      if (this.allSettings[this.selectedTag]) {
        this.notificationTypeSettings = this.allSettings[this.selectedTag];
      } else {
        this.loadSettings();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chip-group {
  display: flex;
  justify-content: space-between;
}

.chip {
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 18px;
}

.settings-wrapper {
  overflow: hidden;
}

.settings-container {
  overflow-x: hidden;
  position: relative;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.settings-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}
.additional-settings {
  margin-top: 20px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
