<template>
  <base-card
    class="short-meeting-card cursor-pointer"
    :class="{ 'ends_at_18': doesItLastsTill18 }"
    :title="event.title"
    :canEditOrDelete="canEditOrDelete"
    :onEdit="wrappedOnEdit"
    :onDelete="wrappedOnDelete"
    :time="formattedTimeRange"
  >
    <div class="meeting-card" >
      <div class="card-time">
        {{ formattedTimeRange }}
      </div>
      <div class="users">
        <div class="creator-info">
          <c-avatar :size="isMobile ?'28' : '36'" v-if="creator" v-bind="getAvatarProps(creator)" />
          {{ formattedName(creator) }}
        </div>
        <div class="participant-avatars">
          <c-avatar
            :size="isMobile ?'28' : '32'"
            v-for="user in visibleParticipants"
            :key="user.id"
            v-bind="getAvatarProps(user)"
          />
          <div v-if="remainingParticipants > 0" class="additional-participants">
            +{{ remainingParticipants }}
          </div>
        </div>
      </div>
    </div>
  </base-card>
</template>

<script>
import { getAvatarProps } from "@/globalFunctions/avatarUtils";
import baseCard from "./BaseCard.vue";

export default {
  name: "short-meeting-card",
  components: {
    baseCard,
  },
  props: {
    event: {
      id: String,
      title: String,
      start: String,
      end: String,
      extendedProps: {
        description: String,
        participants: Array,
        room: Object,
        creator: Object,
        canEditOrDelete: Boolean,
      },
    },
    onEdit: Function,
    onDelete: Function,
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    canEditOrDelete() {
      return this.event?.extendedProps?.canEditOrDelete;
    },
    formattedTimeRange() {
      return `${this.formatTime(this.event.startStr)} - ${this.formatTime(
        this.event.endStr
      )}`;
    },
    creator() {
      return this.event.extendedProps.creator || null;
    },
    wrappedOnEdit() {
      return this.onEdit ? () => this.onEdit(this.event) : null;
    },
    wrappedOnDelete() {
      return this.onDelete ? () => this.onDelete(this.event) : null;
    },
    participantAvatars() {
      return this.event.extendedProps.participants || [];
    },
    visibleParticipants() {
      return this.participantAvatars.slice(0, 2);
    },
    remainingParticipants() {
      return this.participantAvatars.length > 2
        ? this.participantAvatars.length - 2
        : 0;
    },
    doesItLastsTill18() {
      return this.formatTime(this.event.endStr) === "18:00";
    },
  },
  methods: {
    formatTime(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    },
    formattedName(user) {
      if (!user) return "";
      return `${user.last_name || ""} ${user.first_name || ""}`.trim();
    },
    getAvatarProps,
  },
};
</script>

<style lang="scss" src="./ShortMeetingCard.scss" scoped></style>
