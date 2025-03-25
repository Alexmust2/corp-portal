<template>
  <div
    class="position-relative block calendar-view"
    :class="{
      'day-mode-wrap':
        calendarData?.currentData?.currentViewType == 'timeGridDay',
    }"
  >
    <div class="calendar-header" :key="titleKey">
      <div class="default-header">
        <h2 class="title mr-2">
          {{ calendarData?.currentData?.viewTitle }}
        </h2>

        <c-select
          class="room-select"
          v-model="selectedRoomId"
          :items="rooms"
          item-title="name"
          item-value="id"
        >
        </c-select>
        <div class="d-flex">
          <div v-if="isMobile" class="arrows border-0">
            <v-icon @click="navigatePrevious" size="x-large" class="arrow"
              >mdi-chevron-left</v-icon
            >
          </div>
          <div v-if="isMobile" class="arrows border-0">
            <v-icon @click="navigateNext" size="x-large" class="arrow"
              >mdi-chevron-right</v-icon
            >
          </div>
        </div>
      </div>
      <div>
        <TimeGrid
          v-if="!isMobile"
          @click="titleKey++"
          :activeView="calendarData?.currentData?.currentViewType"
          @weekClick="calendarData.changeView('timeGridWeek')"
          @dayClick="calendarData.changeView('timeGridDay')"
        >
        </TimeGrid>
      </div>
    </div>

    <div
      class="custom-day-header"
      :class="{
        'day-mode': calendarData?.currentData?.currentViewType == 'timeGridDay',
      }"
      v-auto-animate
    >
      <div class="time-header" v-if="!isMobile">
        <v-icon size="20">mdi-clock-time-four</v-icon>
      </div>
      <div v-if="!isMobile" class="arrows arrows-prev">
        <v-icon @click="navigatePrevious" size="x-large" class="arrow"
          >mdi-chevron-left</v-icon
        >
      </div>
      <div
        v-if="
          !isMobile &&
          calendarData?.currentData?.currentViewType == 'timeGridDay'
        "
        class="day-header single-day-picker"
      >
        <datePicker
          v-model="singleSelectedDate"
          @date-selected="onSingleDateSelected"
        />
      </div>
      <div v-else class="day-header-wrap">
        <div
          class="day-header"
          v-for="date in currentWeekDates"
          :key="date"
          @click="handleDayClickOnWeekDate(date)"
        >
          <div class="weekday" :class="{ today: isToday(date) }">
            {{ formatWeekday(date) }}
          </div>
          <div
            class="day"
            :class="{
              today: isToday(date),
              selected:
                calendarData?.currentData?.currentViewType == 'timeGridDay' &&
                isSelectedDate(date),
            }"
            @click="goToDate(date)"
          >
            {{ date.getDate() }}
          </div>
        </div>
      </div>
      <div v-if="!isMobile" class="arrows">
        <v-icon @click="navigateNext" size="x-large" class="arrow"
          >mdi-chevron-right</v-icon
        >
      </div>
    </div>

    <FullCalendar
      :options="calendarOptions"
      ref="calendar"
      style="overflow: hidden"
      v-touch="{ left: onSwipeLeft, right: onSwipeRight }"
    >
      <template #eventContent="{ event }">
        <short-meeting-card
          :event="event"
          :onEdit="openMeetingPanel"
          :onDelete="deleteEvent"
        />
      </template>
    </FullCalendar>

    <MeetingPanel
      v-model="isModalOpen"
      :is-edit-mode="isEditMode"
      :meeting-data="meetingData"
      :rooms="rooms"
      :users="users"
      :events="events"
      :auth_user_id="authUser.id"
      @room-selected="onRoomSelected"
      @date-selected="onDateSelected"
      @save-meeting="saveMeeting"
    />
    <full-meeting-card
      v-model="isFullMeetingCardOpen"
      :event="selectedEvent"
      :onEdit="openMeetingPanel"
      :onDelete="deleteEvent"
    />
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ruLocale from "@fullcalendar/core/locales/ru";
import { onboardingService } from "@/globalFunctions/onBoarding";
import { vAutoAnimate } from "@formkit/auto-animate/vue";

import MeetingPanel from "./MeetingPanel.vue";
import TimeGrid from "./TimeGrid.vue";
import { FullMeetingCard, ShortMeetingCard } from "./MeetingCards";

import { socket } from "@/websocket";
import { useHeaderStore } from "@/store/header.store";
import { useUserStore } from "@/store/user.store";
import { defineComponent } from "vue";
import DatePicker from "./DatePicker.vue";

export default defineComponent({
  name: "calendar-page",
  components: {
    FullCalendar,
    MeetingPanel,
    FullMeetingCard,
    ShortMeetingCard,
    TimeGrid,
    DatePicker,
  },
  directives: {
    autoAnimate: vAutoAnimate,
  },
  data() {
    return {
      events: [],
      calendarData: null,
      isModalOpen: false,
      titleKey: 0,
      currentDate: new Date(),
      isEditMode: false,
      isFullMeetingCardOpen: false,
      selectedEvent: null,
      selectedRoomId: null,
      rooms: [
        { id: 1, name: "Большая переговорная" },
        { id: 2, name: "Малая переговорная" },
        { id: 3, name: "КухТех переговорная" },
        { id: 4, name: "Учебный класс" },
      ],
      users: [],
      meetingData: this.getDefaultMeetingData(),
      singleSelectedDate: null,
      calendarKey: 0,
    };
  },
  created() {
    this.headerStore.setHeaderButton("Создать встречу", this.createMeeting);
    this.initializeSelectedRoom();
    this.subscribeToSocketEvents();
    this.initializeData();
  },
  mounted() {
    this.calendarData = this.$refs.calendar.getApi();
    const todayIndex = new Date().getDay();
    document.documentElement.style.setProperty(
      "--fc-day-index",
      todayIndex - 1
    );
  },
  beforeUnmount() {
    this.headerStore.setHeaderButton();
  },
  computed: {
    filteredEvents() {
      if (!this.selectedRoomId) {
        return this.events;
      }
      return this.events.filter(
        (event) => event.extendedProps.room?.id === this.selectedRoomId
      );
    },
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    authUser() {
      return useUserStore().user;
    },
    calendarOptions() {
      return {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: false,
        locale: ruLocale,
        timeZone: "Europe/Moscow",
        datesSet: this.handleDatesSet,
        initialView: this.isMobile ? "timeGridDay" : "timeGridWeek",
        eventClick: this.handleEventClick,
        events: this.filteredEvents,
        slotMinTime: "09:00:00",
        slotMaxTime: "18:00:00",
        allDaySlot: false,
        nowIndicator: true,
        titleFormat: this.isMobile
          ? {
              month: "long",
              year: "numeric",
            }
          : {
              day: "numeric",
              month: "long",
              year: "numeric",
            },
        slotLabelFormat: [
          {
            hour: "numeric",
            minute: "numeric",
          },
        ],
        slotDuration: "01:00:00",
        slotLabelInterval: "01:00:00",
        expandRows: true,
        dayHeaders: false,
      };
    },
    headerStore() {
      return useHeaderStore();
    },
    currentWeekDates() {
      const currentDate = this.currentDate;
      const startOfWeek = new Date(currentDate);
      const dayOfWeek = startOfWeek.getDay();
      const diff =
        startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startOfWeek.setDate(diff);

      const dates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
      }
      return dates;
    },
  },
  watch: {
    isModalOpen(val) {
      if (val === false && this.isEditMode) {
        this.isEditMode = false;
        this.resetForm();
      }
    },
    titleKey() {
      // console.log(this.calendarData);
    },
    selectedRoomId() {
      this.updateRoomQueryParam();
    },
    isMobile(newValue) {
      if (this.calendarData) {
        const newView = newValue ? "timeGridDay" : "timeGridWeek";
        this.calendarData.changeView(newView);
      }

      const newTitleFormat = newValue
        ? { month: "long", year: "numeric" }
        : { day: "numeric", month: "long", year: "numeric" };
      this.calendarData.setOption("titleFormat", newTitleFormat);
    },
    "calendarData.currentData.dateProfile.currentDate"(newVal) {
      if (newVal) {
        this.singleSelectedDate = this.formatYyyyMmDd(newVal);
      } else {
        this.singleSelectedDate = null;
      }
    },
  },
  methods: {
    subscribeToSocketEvents() {
      socket.on("newEvent", (event) => {
        this.events.push(this.parseEvent(event));
      });

      socket.on("updateEvent", (event) => {
        this.events.splice(
          this.events.findIndex((ev) => ev.id === event.id),
          1,
          this.parseEvent(event)
        );
        this.events.push(this.parseEvent(event));
      });

      socket.on("deleteEvent", (eventId) => {
        this.events = this.events.filter((event) => event.id !== eventId);

        if (this.isFullMeetingCardOpen && this.selectedEvent?.id === eventId) {
          this.isFullMeetingCardOpen = false;
          this.selectedEvent = null;
        }
      });
      
    },
    continueOnboarding() {
      onboardingService.startPageOnboarding("calendar");
      onboardingService.setRouter(this.$router);
    },
 
    onSwipeLeft() {
      if (this.calendarData) {
        this.calendarData.next();
        this.titleKey++;
      }
    },
    onSwipeRight() {
      if (this.calendarData) {
        this.calendarData.prev();
        this.titleKey++;
      }
    },
    handleDatesSet(dateInfo) {
      this.currentDate = dateInfo.start;
    },
    navigatePreviousDay() {
      if (this.calendarData) {
        this.calendarData.prev();
        this.singleSelectedDate = this.formatYyyyMmDd(
          this.calendarData.currentData.currentDate
        );
        this.titleKey++;
      }
    },
    navigateNextDay() {
      if (this.calendarData) {
        this.calendarData.next();
        this.singleSelectedDate = this.formatYyyyMmDd(
          this.calendarData.currentData.currentDate
        );
        this.titleKey++;
      }
    },
    navigatePrevious() {
      if (this.calendarData) {
        if (this.calendarData?.currentData?.currentViewType == "timeGridDay") {
          this.navigatePreviousDay();
          return;
        }
        this.calendarData.incrementDate({ weeks: -1 });
      }
    },
    navigateNext() {
      if (this.calendarData) {
        if (this.calendarData?.currentData?.currentViewType == "timeGridDay") {
          this.navigateNextDay();
          return;
        }
        this.calendarData.incrementDate({ weeks: 1 });
      }
    },
    onRoomSelected(selectedRoomId) {
      this.selectedRoomId = selectedRoomId;
      this.updateRoomQueryParam();
    },
    onDateSelected(selectedDate) {
      if (this.calendarData) {
        this.calendarData.gotoDate(selectedDate);
        this.singleSelectedDate = this.formatYyyyMmDd(
          this.calendarData.currentData.currentDate
        );
        this.titleKey++;
        this.calendarData.changeView("timeGridDay");
      }
    },
    isSelectedDate(date) {
      const currentDate = this.calendarData
        ? this.calendarData.getDate()
        : new Date();
      return (
        date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      );
    },
    async initializeData() {
      await this.getUsers();
      await this.getEvents();
    },
    initializeSelectedRoom() {
      const roomIdFromQuery = this.$route.query.room;
      if (roomIdFromQuery) {
        this.selectedRoomId = parseInt(roomIdFromQuery, 10);
      } else if (this.rooms.length > 0) {
        this.selectedRoomId = this.rooms[0].id;
        this.updateRoomQueryParam();
      }
    },
    updateRoomQueryParam() {
      this.$router.replace({
        query: { ...this.$route.query, room: this.selectedRoomId },
      });
    },
    handleEventClick(info) {
      const event = info.event;
      this.selectedEvent = event;
      this.isModalOpen = false;
      this.isFullMeetingCardOpen = true;
    },
    parseEvent(event) {
      const participants = event.user_ids
        ? event.user_ids
            .map((id) => this.users.find((user) => user.id === id))
            .filter(Boolean)
        : [];

      const room = this.rooms.find((room) => room.id === event.room) || null;

      const creator =
        this.users.find((user) => user.id === event.creator_id) || null;

      const startDateTime = new Date(event.start_time);
      const canEditOrDelete =
        event.creator_id === this.authUser.id && new Date() < startDateTime;

      startDateTime.setHours(startDateTime.getHours());

      const endDateTime = new Date(event.end_time);
      endDateTime.setHours(endDateTime.getHours());

      return {
        id: event.id.toString() || null,
        title: event.title || "",
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        extendedProps: {
          description: event.description || "",
          participants: participants,
          room: room || null,
          creator: creator || null,
          canEditOrDelete,
        },
      };
    },
    getDefaultMeetingData() {
      return {
        id: null,
        title: "",
        date: null,
        startTime: null,
        endTime: null,
        roomId: null,
        participantIds: null,
        description: "",
      };
    },
    openMeetingPanel(event) {
      const participantIds =
        event.extendedProps.participants.map((participant) => participant.id) ||
        [];

      this.meetingData = {
        id: event.id,
        title: event.title,
        date: event.startStr.substr(0, 10),
        startTime: event.startStr.substr(11, 5),
        endTime: event.endStr.substr(11, 5),
        roomId: event.extendedProps.room.id,
        participantIds,
        description: event.extendedProps.description,
      };

      this.isEditMode = true;
      this.isModalOpen = true;
    },
    formatWeekday(date) {
      const options = { weekday: "short" };
      return date.toLocaleDateString("ru-RU", options);
    },
    isToday(date) {
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    },
    goToDate(date) {
      if (
        this.calendarData &&
        this.calendarData?.currentData?.currentViewType == "timeGridDay"
      ) {
        this.calendarData.gotoDate(date);
        if (this.isMobile) {
          this.calendarData.changeView("timeGridDay");
        }
      }
      this.titleKey++;
    },
    resetForm() {
      this.meetingData = this.getDefaultMeetingData();
    },
    createMeeting() {
      this.isModalOpen = true;
    },
    async saveMeeting(updateMeetingData) {
      const {
        id,
        title,
        roomId,
        date,
        description,
        startTime,
        endTime,
        participantIds,
      } = updateMeetingData;

      const startDateTime = `${date}T${startTime}:00Z`;
      const endDateTime = `${date}T${endTime}:00Z`;
      const room = this.rooms.find((room) => room.id === roomId);

      const newEvent = {
        title,
        user_ids: participantIds,
        description,
        room,
        time: {
          start: startDateTime,
          end: endDateTime,
        },
        creator_id: this.authUser.id,
      };

      if (this.isEditMode && id !== null) {
        await this.$API.calendarApi.update(id, newEvent);
      } else {
        await this.$API.calendarApi.create(newEvent);
      }

      this.isModalOpen = false;
      this.resetForm();
    },

    async getEvents() {
      const response = await this.$API.calendarApi.getAll();
      this.events = response.map(this.parseEvent);
    },
    async getUsers() {
      const response = await this.$API.userApi.getAll({registered: true });
      this.users = response.map((user) => ({
        id: user.id,
        photo: user.avatar ? user.avatar.file_path : null,
        color: user.color || "",
        full_name: user.full_name || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        role: user.roles?.description || "",
        activity_status: user.activity ? user.activity.status : false,
      }));
    },
    deleteEvent(event) {
      const eventId = +event.id;

      this.$API.calendarApi.delete(eventId).then(() => {
        this.events = this.events.filter((event) => event.id !== eventId);
      });
    },
    onSingleDateSelected(date) {
      this.calendarData.gotoDate(date);
      this.titleKey++;
    },
    formatYyyyMmDd(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    handleDayClickOnWeekDate(date) {
      this.calendarData.changeView("timeGridDay");
      this.calendarData.gotoDate(date);
      this.singleSelectedDate = this.formatYyyyMmDd(
        this.calendarData.currentData.currentDate
      );
    },
  },
});
</script>

<style src="./styles.scss" lang="scss" scoped></style>

<style lang="scss">
.calendar-view {
  padding: 0 !important;
}
.fc {
  --fc-timegrid-width: 60px;
}
.fc .fc-timegrid-axis .fc-timegrid-col-frame {
  @media screen and (max-width: 959px) {
    border-right: 2px dashed rgb(var(--v-theme-tertiary)) !important;
    margin-right: -12px !important;
  }
}
.default-header {
  @media screen and (max-width: 960px) {
    justify-content: space-between;
    gap: clamp(0.625rem, 3.333vw + 0rem, 1.25rem) !important;
    h2 {
      min-width: fit-content;
      white-space: nowrap;
    }
    .c-select-wrapper {
      max-width: 275px;
      margin-right: auto;
    }
  }
}

.fc .fc-timegrid-slot-lane {
  opacity: 0 !important;
}
.fc .fc-timegrid-body::after {
  content: "";
  display: block;
  right: 0;
  top: 0;
  position: absolute;
  background-color: white;
  width: 16px;
  height: 100%;
  z-index: 1;
}

.fc .fc-scroller-liquid-absolute {
  overflow: hidden !important;
}

.fc-v-event {
  background-color: transparent;
  border: none;
}

.fc-theme-standard th {
  border: none;
}

.fc-timegrid-now-indicator-container {
  // 100% per day
  --indicator-base-width: 700%;
  z-index: 2;
  width: calc(var(--indicator-base-width) + var(--fc-timegrid-width));
  left: calc(var(--fc-timegrid-width) * -1) !important;
  @media screen and (min-width: 960px) {
    width: calc(var(--indicator-base-width) + var(--fc-timegrid-width));
    left: calc(
      -100% * var(--fc-day-index) - var(--fc-timegrid-width)
    ) !important;
  }
}
.day-mode-wrap {
  .fc-timegrid-now-indicator-container {
    --indicator-base-width: 100%;
    left: calc(var(--fc-timegrid-width) * -1) !important;
  }
  .fc-event-main {
    --fc-margin-left: 20px;
    position: relative;
    margin-left: calc(var(--fc-margin-left) + 12px) !important;
  }
}

.fc-timegrid-now-indicator-line {
  width: 100% !important;
  border-width: 2px 0px 0px !important;
  position: relative;
  &::before,
  &::after {
    content: "";
    display: block;
    position: absolute;
    width: 10px;
    border-radius: 50%;
    aspect-ratio: 1;
    top: -1px;
    background-color: rgb(var(--v-theme-accent));
    transform: translate(0%, -50%);
  }
  &::before {
    left: 1px;
  }
  &::after {
    right: 1px;
  }
}

.fc-theme-standard td {
  border: none !important;
  border-bottom: 1px solid var(--fc-border-color) !important;
}

.day.selected {
  background-color: rgba(var(--v-theme-accent), 0.5);
  color: rgb(var(--v-theme-on-accent));
}

.fc table,
tr,
td:nth-child(-1) {
  width: auto;
  border: none;
  margin: 1px;
}

.fc tbody tr .fc-timegrid-slot-label {
  border: none !important;
  font-size: 14px;
  padding-left: 16px;
}

.fc .fc-day {
  border-bottom: 1px solid rgb(var(--v-theme-tertiary));
}

.fc-timegrid-event-harness-inset .fc-timegrid-event {
  box-shadow: none;
}

.fc .fc-timegrid-now-indicator-arrow {
  border-color: rgb(var(--v-theme-accent));
  border-bottom-color: transparent;
  border-top-color: transparent;
}

.fc .fc-timegrid-now-indicator-line {
  border-color: rgb(var(--v-theme-accent));
}

.fc-theme-standard .fc-scrollgrid {
  border: none;
}

.fc-v-event .fc-event-main {
  color: rgb(var(--v-theme-primary));
}
.short-meeting-card {
  overflow: clip;
}

.fc .fc-timegrid-col.fc-day-today {
  background-color: transparent;
}

.fc .fc-prev-button,
.fc .fc-next-button {
  border: none;
}

.fc .fc-col-header-cell-cushion {
  @media screen and (max-width: 959px) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
