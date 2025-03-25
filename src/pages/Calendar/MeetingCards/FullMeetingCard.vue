<template>
  <div
    class="full-meeting-card-overlay"
    :class="{ open: visible }"
    @click.self="closeCard"
  >
    <baseCard
      class="full-meeting-card"
      :class="{ open: visible }"
      :title="event?.title"
      :canEditOrDelete="canEditOrDelete"
      :onEdit="wrappedOnEdit"
      :onDelete="wrappedOnDelete"
    >
      <div class="card-content" v-if="event">
        <div class="info">
          <div class="info-item">
            <v-icon>mdi-calendar</v-icon>
            <span class="h3">{{ formattedDate }}</span>
          </div>
          <div class="info-item">
            <v-icon>mdi-clock</v-icon>
            <span class="h3">{{ formattedTimeRange }}</span>
          </div>
        </div>

        <div class="description" v-if="event?.extendedProps?.description">
          {{ truncatedDescription }}
        </div>

        <div class="participants">
          <h2>Участники встречи</h2>
          <div class="participants-list" v-if="event?.extendedProps" >
            <div class="participant">
              <c-avatar size="32" v-bind="getAvatarProps(event.extendedProps.creator)" />
              <span class="sm">
                {{ event.extendedProps.creator.first_name }}
                {{ event.extendedProps.creator.last_name }}
              </span>
              <v-icon v-if="event.extendedProps.creator" color="accent" size="small"
                >mdi-star</v-icon
              >
            </div>
            <div
              v-for="participant in participantsVisible"
              :key="participant.id"
              class="participant sm"
            >
              <c-avatar size="32" v-bind="getAvatarProps(participant)" />
              <span>
                {{ participant.first_name }}
                {{ participant.last_name }}
              </span>
            </div>
            <button v-if="event?.extendedProps?.participants.length > 2" class="shot-more sm" @click="toggleParticipantsShowLimit">{{participantsViewLimit === 2 ? 'смотреть еще': 'скрыть'}}</button>

          </div>
        </div>

        <div class="room" v-if="event?.extendedProps?.room">
          <h2>Переговорная: {{ event.extendedProps.room.name }}</h2>
        </div>
      </div>
    </baseCard>
  </div>
</template>

<script>
import { getAvatarProps } from "@/globalFunctions/avatarUtils";
import baseCard from "./BaseCard.vue";

export default {
  name: "full-meeting-card",
  components: {
    baseCard,
  },
  props: {
    modelValue: Boolean,
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
  emits: ["update:modelValue"],
  data() {
    return {
      visible: this.modelValue,
      participantsViewLimit: 2,
    };
  },
  watch: {
    modelValue(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("update:modelValue", val);
    },
  },
  computed: {
    truncatedDescription() {
      let maxLength = 200;
      let desctiption =  this.event?.extendedProps?.description
      return desctiption.slice(0, maxLength) + (desctiption.length > maxLength -1 ? "..." : "");
    },
    participantsVisible() {
      let visibleParticipants = this.event?.extendedProps?.participants;
      return visibleParticipants.slice(0, this.participantsViewLimit);
    },
    canEditOrDelete() {
      return this.event?.extendedProps?.canEditOrDelete;
    },
    wrappedOnEdit() {
      return this.onEdit ? () => this.onEdit(this.event) : null;
    },
    wrappedOnDelete() {
      return this.onDelete ? () => this.onDelete(this.event) : null;
    },
    formattedDate() {
      if (!this.event?.start) return "";
      const date = new Date(this.event.start);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
    formattedTimeRange() {
      return `${this.formatTime(this.event.startStr)} - ${this.formatTime(
        this.event.endStr
      )}`;
    }
  },
  methods: {
    toggleParticipantsShowLimit() {
      this.participantsViewLimit = this.participantsViewLimit === 2 ? 100 : 2;
    },
    closeCard() {
      this.visible = false;
    },
    formatTime(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    },
    getAvatarProps,
  },
};
</script>

<style lang="scss" src="./FullMeetingCard.scss" scoped></style>
