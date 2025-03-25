<template>
  <div
    class="avatar-container"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <v-avatar
      :image="fullPhotoPath"
      v-if="photo_path && !preview_photo"
      :size="size"
    />

    <v-avatar :image="preview_photo" v-else-if="preview_photo" :size="size" />

    <v-avatar :style="{ backgroundColor: avatarColor }" v-else :size="size">
      {{ initials }}
    </v-avatar>

    <div
      class="online-indicator"
      v-if="activityStatusDefined && showStatus"
      :class="{
        online: currentActivityStatus === true,
        offline: currentActivityStatus === false,
      }"
    ></div>
  </div>
</template>

<script>
import { socket } from "@/websocket";
import { generateColor } from "@/globalFunctions/generateColor";

export default {
  name: "c-avatar",
  props: {
    userId: Number,
    first_name: String,
    last_name: String,
    title: String,
    photo_path: [String, null],
    color: {
      type: String,
      default: null,
    },
    showStatus: {
      type: Boolean,
      default: true,
    },
    activity_status: {
      type: Boolean,
      default: null,
    },
    size: {
      type: Number,
      default: 36,
    },
    preview_photo: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      currentActivityStatus: this.activity_status,
    };
  },
  watch: {
    activity_status(newVal) {
      this.currentActivityStatus = newVal;
    },
  },
  computed: {
    initials() {
      if (this.title && this.title.length) {
        return this.title.slice(0, 2).toUpperCase();
      }
      const firstInitial = this.first_name ? this.first_name.charAt(0) : "";
      const lastInitial = this.last_name ? this.last_name.charAt(0) : "";
      return (firstInitial + lastInitial).toUpperCase();
    },
    avatarColor() {
      return this.color || this.generateColor(this.userId);
    },
    apiUrl() {
      return process.env.VUE_APP_API_URL;
    },
    fullPhotoPath() {
      return this.photo_path ? this.apiUrl + this.photo_path : null;
    },
    activityStatusDefined() {
      return this.currentActivityStatus !== null;
    },
  },

  methods: {
    generateColor
  },
  created() {
    socket.on("userStatus", ({ userId, status }) => {
      if (Number(userId) == this.userId) {
        this.currentActivityStatus = status;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.v-avatar {
  color: white;
}

.online-indicator {
  position: absolute;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 1px solid rgb(var(--v-theme-background));
  bottom: 0;
  right: 0;

  &.online {
    background-color: rgb(var(--v-theme-success));
  }

  &.offline {
    background-color: rgb(var(--v-theme-tertiary));
  }
}
</style>
