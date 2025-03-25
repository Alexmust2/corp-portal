<template>
  <c-slide-panel
    v-model="internalIsOpen"
    :title="isEditMode ? 'Редактировать встречу' : 'Создать встречу'"
  >
    <cInput v-model="localMeetingData.title" block label="Название" />

    <c-select
      v-model="localMeetingData.participantIds"
      :items="availableUsers"
      item-title="full_name"
      item-value="id"
      multiple
      :is-label-active="true"
      :is-combobox="true"
      clear-on-select
      label="Участники"
      :return-object="false"
      :unique-only="true"
      @update:modelValue="validateSelection"
    >
      <template #selection="{ item, index }">
        <div class="d-flex gc-3">
          <v-chip  class="user-chip" v-if="index < 2">
            <span>{{ item.raw.first_name }} {{ item.raw.last_name }}</span>
          </v-chip>
          <div v-if="index === 2" class="round">
            +{{ localMeetingData.participantIds.length - 2 }}
          </div>
        </div>
      </template>

      <template #item="{ item, props }">
        <div
          v-bind="props"
          v-on="props.on"
          class="d-flex align-center py-2 pl-3 cursor-pointer ga-2"
        >
          <v-checkbox
            true-icon="mdi-checkbox-outline"
            base-color="secondary"
            color="accent"
            :ripple="false"
            :hide-details="true"
            density
            @click.stop
            v-model="localMeetingData.participantIds"
            :value="item.raw.id"
          />
          <c-avatar
            v-bind="getAvatarProps(item.raw)"
            :size="40"
            class="participants-avatar"
          />
          <div>
            <div class="text-truncate">
              {{ item.raw.full_name }}
            </div>
            <div
              class="sm text-truncate"
              style="color: rgb(var(--v-theme-secondary))"
            >
              {{ item.raw.role }}
            </div>
          </div>
        </div>
      </template>
    </c-select>

    <cSelect
      v-model="localMeetingData.roomId"
      :items="rooms"
      item-title="name"
      item-value="id"
      label="Комната"
    />

    <cSelect
      v-show="localMeetingData.roomId"
      v-model="localMeetingData.date"
      :items="availableDates"
      item-title="label"
      item-value="value"
      label="Дата"
      :icon="'mdi-calendar-range'"
    />

    <div class="row" v-show="localMeetingData.date">
      <cSelect
        v-model="localMeetingData.startTime"
        :items="availableStartTimes"
        label="Начало встречи"
        :icon="'mdi-clock'"
      >
        <template #item="{ item, props }">
          <check-select-item
            :item="item"
            :props="props"
            :is-hovered="hoveredDate === item.value"
            @hover="setHoveredDate"
          />
        </template>
      </cSelect>

      <cSelect
        v-model="localMeetingData.endTime"
        :items="availableEndTimes"
        :disabled="!localMeetingData.startTime"
        label="Конец встречи"
        :icon="'mdi-clock'"
      >
        <template #item="{ item, props }">
          <check-select-item
            :item="item"
            :props="props"
            :is-hovered="hoveredDate === item.value"
            @hover="setHoveredDate"
          />
        </template>
      </cSelect>
    </div>

    <cTextarea
      v-model="localMeetingData.description"
      label="Описание встречи"
    />

    <template #footer>
      <c-btn
        :disabled="
          !localMeetingData.title ||
          !localMeetingData.endTime ||
          !localMeetingData.participantIds?.length
        "
        @click="saveMeeting"
        block
      >
        {{ isEditMode ? "Сохранить встречу" : "Создать встречу" }}
      </c-btn>
    </template>
  </c-slide-panel>
</template>

<script>
import { getAvatarProps } from "@/globalFunctions/avatarUtils";
import { vAutoAnimate } from "@formkit/auto-animate";
import checkSelectItem from "@/components/ui/Select/checkSelectItem.vue";

export default {
  name: "meeting-panel",
  props: {
    isOpen: Boolean,
    isEditMode: Boolean,
    meetingData: Object,
    rooms: Array,
    users: Array,
    auth_user_id: Number,
    events: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    checkSelectItem,
  },
  directives: {
    autoAnimate: vAutoAnimate,
  },
  data() {
    return {
      internalIsOpen: this.isOpen,
      localMeetingData: { ...this.meetingData },
      hoveredDate: null,
    };
  },
  watch: {
    meetingData() {
      this.localMeetingData = { ...this.meetingData };
    },

    "localMeetingData.startTime"(newVal, oldVal) {
      if (newVal !== oldVal && !this.isEditMode) {
        this.localMeetingData.endTime = "";
      }
    },
    "localMeetingData.roomId"(newRoomId, oldRoomId) {
      this.localMeetingData.startTime = null
      this.localMeetingData.endTime = null
      // if(this.checkOverlap(this.meetingData, this.events)) {
      //   oldRoomId !== null ? (this.localMeetingData.startTime = this.localMeetingData.endTime = null) : '';
      // }
      if (newRoomId !== oldRoomId && newRoomId) {
        this.$emit("room-selected", newRoomId);
      }
    },
    "localMeetingData.date"(newDate, oldDate) {
      if (newDate !== oldDate && newDate) {
        this.$emit("date-selected", newDate);
      }
    },
    isOpen(val) {
      this.internalIsOpen = val;
    },
    internalIsOpen(val) {
      this.$emit("update:modelValue", val);
    },
  },
  computed: {
    availableUsers() {
      return this.users.filter((user) => user.id !== this.auth_user_id);
    },
    availableDates() {
      const dates = [];
      const today = new Date();
      const currentHour = today.getHours();
      const workingHoursEnd = 18;

      for (let i = 0; i < 8; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        if (i === 0 && currentHour >= workingHoursEnd) {
          continue;
        }

        const value = date.toISOString().substring(0, 10);
        const label = date.toLocaleDateString("ru-RU", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        dates.push({ value, label });
      }

      return dates;
    },

    availableStartTimes() {
      return this.generateAvailableTimes("start");
    },
    availableEndTimes() {
      return this.generateAvailableTimes("end");
    },
  },
  methods: {
    getAvatarProps,
    validateSelection(value) {
      // filter out items that r not existing users from combobox
      const validIds = this.availableUsers.map(user => user.id);
      let properArray = Array.isArray(value) ? Array.from(value) : [value];
      properArray = properArray.filter(id => validIds.includes(id) && !isNaN(Number(id)));
      this.localMeetingData.participantIds = [...properArray];
    },
    closePanel() {
      this.internalIsOpen = false;
    },
    setHoveredDate(date) {
      this.hoveredDate = date;
    },
    saveMeeting() {
      this.$emit("save-meeting", this.localMeetingData);
      this.closePanel();
    },
    formatTime(dateObj) {
      if (!dateObj) return "";
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    },
    generateAvailableTimes(type) {
      const times = [];
      const {
        date: selectedDate,
        roomId: selectedRoomId,
        startTime,
      } = this.localMeetingData;
      const isStartType = type === "start";

      if (!selectedDate || !selectedRoomId || (!isStartType && !startTime)) {
        return times;
      }

      const interval = 15;
      const workingHoursStart = 9;
      const workingHoursEnd = 18;

      let currentTime;

      if (isStartType) {
        currentTime = new Date(
          `${selectedDate}T${String(workingHoursStart).padStart(2, "0")}:00:00`
        );

        const today = new Date();
        const todayDateString = today.toISOString().substring(0, 10);

        if (selectedDate === todayDateString) {
          const now = new Date();

          if (now.getHours() < workingHoursEnd) {
            const minutes = now.getMinutes();
            const roundedMinutes = Math.ceil(minutes / interval) * interval;

            currentTime = new Date(now);
            currentTime.setSeconds(0);
            currentTime.setMilliseconds(0);
            currentTime.setMinutes(roundedMinutes);

            if (currentTime.getHours() >= workingHoursEnd) {
              currentTime = new Date(
                `${selectedDate}T${String(workingHoursStart).padStart(
                  2,
                  "0"
                )}:00:00`
              );
            }
          }
        }
      } else {
        currentTime = new Date(`${selectedDate}T${startTime}:00`);
        currentTime.setMinutes(currentTime.getMinutes() + interval);
      }

      const endTime = new Date(`${selectedDate}T${workingHoursEnd}:00:00`);

      while (isStartType ? currentTime < endTime : currentTime <= endTime) {
        const formattedTime = this.formatTime(currentTime);

        const hasConflict = this.events.some((event) =>
          this.isTimeConflict(event, formattedTime, isStartType)
        );

        if (!hasConflict) {
          if (
            isStartType ||
            (!isStartType &&
              currentTime > new Date(`${selectedDate}T${startTime}:00`))
          ) {
            times.push(formattedTime);
          }
        } else if (!isStartType) {
          break;
        }

        currentTime.setMinutes(currentTime.getMinutes() + interval);
      }

      return times;
    },

    isTimeConflict(event, timeSlot, isStartType) {
      const { roomId: localRoomId, date: localDate } = this.localMeetingData;
      const eventRoomId = event.extendedProps.room.id;

      if (
        eventRoomId !== localRoomId ||
        event.start.substr(0, 10) !== localDate
      ) {
        return false;
      }

      if (this.isEditMode && event.id === this.localMeetingData.id) {
        return false;
      }

      const eventStartDateTime = new Date(event.start.replace("Z", ""));
      const eventEndDateTime = new Date(event.end.replace("Z", ""));

      const timeSlotDateTime = new Date(`${localDate}T${timeSlot}:00`);

      const eventStartTime = eventStartDateTime.getTime();
      const eventEndTime = eventEndDateTime.getTime();
      const timeSlotTime = timeSlotDateTime.getTime();

      const conflict = isStartType
        ? timeSlotTime >= eventStartTime && timeSlotTime < eventEndTime
        : timeSlotTime > eventStartTime && timeSlotTime <= eventEndTime;

      return conflict;
    },
    checkOverlap(localEvent, events) {

      const localStart = new Date(`${localEvent.date}T${localEvent.startTime}:00.000Z`);
      const localEnd = new Date(`${localEvent.date}T${localEvent.endTime}:00.000Z`);

      for (let event of events) {
        if (event.id !== localEvent.id) { 
          const eventStart = new Date(event.start); 
          const eventEnd = new Date(event.end); 
          const eventRoomId = event.extendedProps.room.id; 

          if ((localStart < eventEnd && localEnd > eventStart) && this.localMeetingData.roomId === eventRoomId) {
            return true; 
          }
        }
      }
      return false;
    },


  }
};
</script>

<style lang="scss" scoped src="./MeetingPanel.scss"></style>
