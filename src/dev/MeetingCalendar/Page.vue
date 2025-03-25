<template>
  <div class="container">
    <div class="room-filter">
      <v-chip-group v-model="selectedRoomNames" mandatory>
        <v-chip
          v-for="room in rooms"
          :key="room.id"
          :value="room.name"
          :color="room.color"
        >
          {{ room.name }}
        </v-chip>
      </v-chip-group>
      <v-btn color="green" @click="showDialog = true">Забронировать </v-btn>
    </div>
    <div class="main-content">
      <div class="calendar-container">
        <!-- <Qalendar
          :events="filteredEvents"
          :config="config"
          :selected-date="new Date()"
        >
          <template #weekDayEvent="eventProps">
            <v-card
              style=""
              height="100%"
              :color="getRoomColor(eventProps.eventData.room)"
            >
              <v-list-item class="text-subtitle-1 mt-n8">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ eventProps.eventData.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-icon left>mdi-clock</v-icon>
                    {{ eventProps.eventData.time.start.split(" ")[1] }} -
                    {{ eventProps.eventData.time.end.split(" ")[1] }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <v-icon left>mdi-account</v-icon>
                    {{ getOrganizerFullName(eventProps.eventData.creator_id) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </template>

          <template #monthEvent="monthEventProps">
            <span>{{ monthEventProps.eventData.title }}</span>
          </template>
          <template #eventDialog="props">
            <div
              v-if="props.eventDialogData && props.eventDialogData.title"
              :style="{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor:
                  props.eventDialogData.colorScheme.backgroundColor,
              }"
            >
              <v-list-item>
                <v-list-item-content>
                  <v-chip
                    :color="getRoomColor(props.eventDialogData.room)"
                    style="margin-bottom: 8px"
                  >
                    <v-icon left>mdi-office-building</v-icon>
                    {{ props.eventDialogData.room }}
                  </v-chip>
                  <v-list-item-title
                    class="headline"
                    style="margin-bottom: 8px"
                  >
                    {{ props.eventDialogData.title }}
                  </v-list-item-title>

                  <v-list-item-subtitle style="margin-bottom: 8px">
                    <v-icon left>mdi-calendar</v-icon>
                    {{ props.eventDialogData.time.start.split(" ")[0] }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle style="margin-bottom: 8px">
                    <v-icon left>mdi-clock</v-icon>
                    {{ props.eventDialogData.time.start.split(" ")[1] }} -
                    {{ props.eventDialogData.time.end.split(" ")[1] }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle style="margin-bottom: 8px">
                    <v-icon left>mdi-account</v-icon>
                    {{ getOrganizerFullName(props.eventDialogData.creator_id) }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle style="margin-bottom: 8px">
                    <v-icon left>mdi-account-multiple</v-icon>
                    {{ props.eventDialogData.with }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle style="margin-bottom: 8px">
                    <v-icon left>mdi-note-text</v-icon>
                    {{ props.eventDialogData.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <div
                v-if="
                  props.eventDialogData.isEditable &&
                  new Date() < new Date(props.eventDialogData.time.start)
                "
                class="d-flex justify-end mt-3"
              >
                <v-btn color="green" @click="editEvent(props.eventDialogData)"
                  >Изменить</v-btn
                >
                <v-btn
                  color="red"
                  @click="deleteEvent(props.eventDialogData)"
                  class="ml-3"
                  >Удалить</v-btn
                >
              </div>
            </div>
          </template>
        </Qalendar> -->
      </div>
    </div>
    <v-dialog v-model="showDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Создать встречу</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="newEvent.title"
              label="Название встречи"
              required
            ></v-text-field>
            <v-select
              v-model="newEvent.with"
              :items="withUsersList"
              item-title="full_name"
              label="Участники"
              multiple
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  :prepend-avatar="item.raw.photo"
                  v-bind="props"
                  :subtitle="item.raw.role"
                ></v-list-item>
              </template>
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index < 2">
                  <span>{{ item.title }}</span>
                </v-chip>
                <span
                  v-if="index === 2"
                  class="text-grey text-caption align-self-center"
                >
                  (ещё +{{ newEvent.with.length - 2 }})
                </span>
              </template>
            </v-select>
            <v-select
              v-model="newEvent.room"
              :items="rooms"
              item-title="name"
              theme="dark"
              label="Переговорная комната"
              ><template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :base-color="item.raw.color"
                ></v-list-item> </template
            ></v-select>
            <v-select
              v-model="newEvent.date"
              :items="availableDates"
              label="Выберите дату"
              :disabled="!newEvent.room"
            ></v-select>

            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="newEvent.startTime"
                  :items="availableStartTimes"
                  label="Время начала"
                  :disabled="!newEvent.date || availableStartTimes.length === 0"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :disabled="item.raw.disabled"
                    ></v-list-item> </template
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="newEvent.endTime"
                  :items="availableEndTimes"
                  label="Время окончания"
                  :disabled="
                    !newEvent.startTime || availableEndTimes.length === 0
                  "
                ></v-select>
              </v-col>
            </v-row>

            <v-textarea
              v-model="newEvent.description"
              label="Описание встречи"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red" text @click="showDialog = false">Закрыть</v-btn>
          <v-btn
            type="submit"
            color="green"
            :disabled="!newEvent.endTime || !newEvent.title"
            @click="saveEvent"
            >Создать</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import { Qalendar } from "qalendar";
import { socket } from "@/websocket";
import { useUserStore } from "@/store/user.store";
import { useNotificationsStore } from "@/store/notifications.store";

export default {
  name: "meeting-calendar-page",
  // components: {
  //   Qalendar,
  // },
  data() {
    return {
      selectedRoomNames: "",
      withUsersList: [],
      rooms: [
        { id: 1, name: "Переговорная 1", color: "yellow" },
        { id: 2, name: "Переговорная 2", color: "green" },
        { id: 3, name: "Переговорная 3", color: "red" },
      ],
      events: [],
      config: {
        locale: "ru-RU",
        eventDialog: {
          isCustom: true,
        },
        disableModes: "month",
        dayIntervals: {
          length: 60, // Length in minutes of each interval. Accepts values 15, 30 and 60 (the latter is the default)
          height: 74, // The height of each interval
          displayClickableInterval: true, // Needs to be set explicitly to true, if you want to display clickable intervals
        },
        defaultMode: "week",
        dayBoundaries: {
          start: 8,
          end: 18,
        },
        style: {
          colorSchemes: {
            yellow: {
              backgroundColor: "rgba(255,235,59, 0.8)",
            },
            green: {
              backgroundColor: "rgba(76, 175, 80, 0.8)",
            },
            red: {
              backgroundColor: "rgba(240,128,128,0.8)",
            },
          },
        },
      },
      newEvent: {
        title: "",
        with: [],
        room: null,
        date: null,
        startTime: null,
        endTime: null,
        description: "",
      },
      showDialog: false,
      editMode: false, // Новое состояние для определения режима редактирования
      currentEvent: null, // Текущее редактируемое событие
    };
  },
  created() {
    this.config.dayIntervals.height = this.adaptiveDayHeight;
    window.addEventListener("resize", () => {
      this.config.dayIntervals.height = this.adaptiveDayHeight;
    });

    socket.on("deleteEvent", (event) => {
      this.events = this.events.filter((ev) => ev.id !== event);
    });
    socket.on("newEvent", (event) => {
      event.isEditable = event.creator_id === this.authUser.id;
      this.events.push(event);
      this.checkForConflicts(event);
    });
    socket.on("updateEvent", (event) => {
      this.events = this.events.map((ev) => {
        if (ev.id === event.id) {
          event.isEditable = event.creator_id === this.authUser.id;
          return event;
        }
        return ev;
      });
      this.checkForConflicts(event);
    });

    const roomParam = this.$route.params.room;
    if (roomParam) {
      const roomId = roomParam.replace("room", "");
      const room = this.rooms.find((room) => room.id === parseInt(roomId));
      if (room) {
        this.selectedRoomNames = [room.name];
      }
    }
    this.selectedRoomNames = this.rooms.map((room) => room.name);

    this.selectedRoomNames = this.rooms[0].name;

    this.withUsers();
    this.fetchEvents();
  },
  computed: {
    authUser() {
      return useUserStore().user;
    },
    notificationsStore() {
      return useNotificationsStore();
    },
    adaptiveDayHeight() {
      const screenHeight = window.innerHeight;
      const calendarHeight = screenHeight - 175; // Adjust 100px based on your UI requirements
      return calendarHeight / 10; // Convert to dayIntervals.height value
    },
    availableDates() {
      if (!this.newEvent.room) return [];

      const dates = [];
      const today = new Date();
      for (let i = 0; i < 8; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().substr(0, 10));
      }
      return dates;
    },

    filteredEvents() {
      return this.events.filter((event) =>
        this.selectedRoomNames.includes(event.room)
      );
    },
    availableStartTimes() {
      if (!this.newEvent.room || !this.newEvent.date) return [];

      const startHour = this.config.dayBoundaries.start;
      const endHour = this.config.dayBoundaries.end;
      const times = [];
      const currentDateTime = new Date();
      const selectedDate = new Date(this.newEvent.date);
      const currentHour = currentDateTime.getUTCHours() + 3; // Convert to Moscow time
      const currentMinute = currentDateTime.getUTCMinutes();

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute of ["00", "15", "30", "45"]) {
          const timeSlot = `${hour.toString().padStart(2, "0")}:${minute}`;
          if (
            selectedDate.toDateString() === currentDateTime.toDateString() &&
            (hour < currentHour ||
              (hour === currentHour && minute <= currentMinute))
          ) {
            continue;
          }
          const eventExists = this.events.some(
            (e) =>
              e.room === this.newEvent.room &&
              e.time.start.startsWith(this.newEvent.date) &&
              timeSlot >= e.time.start.substr(11, 5) &&
              timeSlot < e.time.end.substr(11, 5) &&
              (!this.editMode || e.id !== this.currentEvent.id)
          );
          times.push({
            title: timeSlot,
            disabled: eventExists,
          });
        }
      }

      return times;
    },
    availableEndTimes() {
      if (!this.newEvent.room || !this.newEvent.startTime) return [];

      const [startHour, startMinute] = this.newEvent.startTime
        .split(":")
        .map(Number);
      const endBoundaryHour = this.config.dayBoundaries.end;
      const times = [];

      const startDateTime = new Date(this.newEvent.date);
      startDateTime.setHours(startHour, startMinute, 0);

      let currentTime = new Date(startDateTime);
      currentTime.setMinutes(currentTime.getMinutes() + 15);

      while (
        currentTime.getHours() < endBoundaryHour ||
        (currentTime.getHours() === endBoundaryHour &&
          currentTime.getMinutes() === 0)
      ) {
        const formattedTime = currentTime.toTimeString().substr(0, 5);
        const eventExists = this.events.some(
          (e) =>
            e.room === this.newEvent.room &&
            e.time.start.startsWith(this.newEvent.date) &&
            formattedTime > e.time.start.substr(11, 5) &&
            formattedTime <= e.time.end.substr(11, 5) &&
            (!this.editMode || e.id !== this.currentEvent.id)
        );
        if (eventExists) break;
        times.push(formattedTime);
        currentTime.setMinutes(currentTime.getMinutes() + 15);
      }

      return times;
    },
  },
  watch: {
    selectedRoomNames(newVal, oldValue) {
      if (oldValue != "") {
        const room = this.rooms.find((room) => room.name === newVal);
        this.$router.push({
          name: "Calendar",
          params: { room: "room" + room.id },
        });
      }
    },
    showDialog(newValue) {
      if (newValue == false) this.resetForm();
    },
    "newEvent.room"(newValue, oldValue) {
      if (!this.editMode || oldValue != null) {
        this.newEvent.date = null;
        this.newEvent.startTime = null;
        this.newEvent.endTime = null;
      }
    },
    "newEvent.date"(newValue, oldValue) {
      if (!this.editMode || oldValue != null) {
        this.newEvent.startTime = null;
        this.newEvent.endTime = null;
      }
    },
    "newEvent.startTime"(newValue, oldValue) {
      if (!this.editMode || oldValue != null) {
        this.newEvent.endTime = null;
      }
    },
  },
  methods: {
    checkForConflicts(event) {
      console.log(34343433);
      if (this.showDialog) {
        console.log(34343433, event);
        // const eventStart = new Date(event.time.start);
        const eventStart = event.start_time;
        // const eventEnd = new Date(event.time.end);
        const eventEnd = event.end_time;
        const selectedStart = new Date(
          `${this.newEvent.date} ${this.newEvent.startTime}`
        );
        const selectedEnd = new Date(
          `${this.newEvent.date} ${this.newEvent.endTime}`
        );

        if (
          (selectedStart >= eventStart && selectedStart < eventEnd) ||
          (selectedEnd > eventStart && selectedEnd <= eventEnd) ||
          (selectedStart <= eventStart && selectedEnd >= eventEnd)
        ) {
          this.newEvent.startTime = null;
          this.newEvent.endTime = null;
        }
      }
    },
    getRoomColor(roomName) {
      const room = this.rooms.find((room) => room.name === roomName);
      return room ? room.color : "black";
    },
    getOrganizerFullName(creatorId) {
      if (creatorId === this.authUser.id) {
        return `${this.authUser.first_name || ""} ${
          this.authUser.middle_name || ""
        } ${this.authUser.last_name || ""}`;
      }
      const organizer = this.withUsersList.find(
        (user) => user.id === creatorId
      );
      return organizer ? organizer.full_name : "Неизвестный организатор";
    },
    // FilterAndRecalculate(events, selectedRoomNames) {
    //   const eventsOverlap = (event1, event2) => {
    //     const start1 = new Date(event1.time.start);
    //     const end1 = new Date(event1.time.end);
    //     const start2 = new Date(event2.time.start);
    //     const end2 = new Date(event2.time.end);
    //     return start1 < end2 && start2 < end1;
    //   };

    //   const filteredEvents = events.filter((event) =>
    //     selectedRoomNames.includes(event.room)
    //   );

    //   filteredEvents.sort(
    //     (a, b) => new Date(a.time.start) - new Date(b.time.start)
    //   );

    //   const processedEvents = [];
    //   const eventGroups = [];

    //   filteredEvents.forEach((event) => {
    //     const overlappingEvents = [];
    //     for (const group of eventGroups) {
    //       if (eventsOverlap(group[group.length - 1], event)) {
    //         overlappingEvents.push(group);
    //       }
    //     }

    //     if (overlappingEvents.length === 0) {
    //       eventGroups.push([event]);
    //     } else {
    //       overlappingEvents[0].push(event);
    //       for (let i = 1; i < overlappingEvents.length; i++) {
    //         overlappingEvents[0].push(...overlappingEvents[i]);
    //         eventGroups.splice(eventGroups.indexOf(overlappingEvents[i]), 1);
    //       }
    //     }
    //   });

    //   eventGroups.forEach((group) => {
    //     const totalConcurrentEvents = group.length;
    //     group.forEach((event, index) => {
    //       event.nOfPreviousConcurrentEvents = index;
    //       event.totalConcurrentEvents = totalConcurrentEvents;
    //       processedEvents.push(event);
    //     });
    //   });

    //   return processedEvents;
    // },
    async withUsers() {
      try {
        const response = await this.$API.userApi.getAll();

        this.withUsersList = response.data
          .filter((user) => user.id !== this.authUser.id)
          .map((user) => ({
            ...user,
            full_name: `${user.first_name || ""} ${user.middle_name || ""} ${
              user.last_name || ""
            }`.trim(),
            role:
              user.roles && user.roles.length > 0
                ? user.roles[0].description
                : "",
            photo: process.env.VUE_APP_API_URL + user.photo_path,
          }));
      } catch (error) {
        return error;
      }
    },
    async saveEvent() {
      console.log(11111111);
      const event = {
        title: this.newEvent.title,
        with: this.newEvent.with.join(", "),
        time: {
          start: `${this.newEvent.date} ${this.newEvent.startTime}`,
          end: `${this.newEvent.date} ${this.newEvent.endTime}`,
        },
        colorScheme: this.rooms.find((r) => r.name === this.newEvent.room)
          .color,
        disableDnD: "week, day, month",
        disableResize: "week, day",
        description: this.newEvent.description,
        room: this.newEvent.room,
        creator_id: this.authUser.id,
      };
      console.log(44, event);
      const startTimeEvent = this.newEvent.startTime;
      const endTimeEvent = this.newEvent.endTime;
      console.log(999, startTimeEvent, endTimeEvent);
      if (this.editMode && this.currentEvent) {
        event.id = this.currentEvent.id; // Добавляем ID события при редактировании
        console.log(9999999, event);
        try {
          await this.$API.calendarApi.update(this.currentEvent.id, event);
          socket.emit("updateEvent", event);
        } catch (error) {
          console.error("Ошибка при обновлении события:", error);
        }
      } else {
        try {
          await this.$API.calendarApi.create(event);
          socket.emit("newEvent", event);

          const recipientsIds = this.withUsersList
            .filter((user) => {
              return this.newEvent.with.some(
                (userFullName) => userFullName === user.full_name
              );
            })
            .map((user) => user.id);
          const notificationData = {
            recipients: recipientsIds,
            title: "Вам назначена встреча",
            message: `${this.authUser.first_name} назначил(а) Вас участником встречи в переговорной комнате "${this.newEvent.room}". Тема встречи: ${this.newEvent.title}. Дата встречи: ${this.newEvent.date} с ${startTimeEvent} до ${endTimeEvent}`,
            link: null,
            status: "info",
            icon: null,
          };
          this.notificationsStore.createNewNotification(notificationData);
          await this.$axios.post("/api/notify", {
            message: `${this.authUser.first_name} назначил(а) Вас участником встречи в переговорной комнате "${this.newEvent.room}". Тема встречи: ${this.newEvent.title}. Дата встречи: ${this.newEvent.date} с ${startTimeEvent} до ${endTimeEvent}`,
            targetUserId: recipientsIds,
          });
        } catch (error) {
          console.error("Ошибка при сохранении события:", error);
        }
      }
      this.showDialog = false;
    },
    async fetchEvents() {
      console.log("0000");
      await this.$API.calendarApi
        .getAll()
        .then((response) => {
          const allEvents = response.map((event) => {
            const room = this.rooms.find((r) => r.name === event.room);
            const colorScheme = room ? room.color : "defaultColor";
            const isEditable = event.creator_id === this.authUser.id;
            return {
              title: event.title,
              with: event.event_with || "",
              time: {
                start: event.start_time,
                end: event.end_time,
              },
              colorScheme: colorScheme,
              disableDnD: "week, day, month",
              disableResize: "week, day",
              isEditable: isEditable,
              //isCustom: true,
              id: event.id.toString(),
              creator_id: event.creator_id,
              description: event.description || "",
              room: event.room,
            };
          });
          this.events = allEvents;
        })
        .catch((error) => {
          console.error("Ошибка при получении событий:", error);
        });
    },
    resetForm() {
      this.newEvent = {
        title: "",
        with: [],
        room: null,
        date: null,
        startTime: null,
        endTime: null,
        description: "",
      };
      this.showDialog = false;
      this.editMode = false;
      this.currentEvent = null;
    },
    editEvent(event) {
      this.currentEvent = event;
      console.log(88, event);
      this.newEvent = {
        title: event.title || this.newEvent.title,
        with: event.with ? event.with.split(", ") : this.newEvent.with,
        room: event.room || this.newEvent.room,
        date: event.time.start.split(" ")[0] || this.newEvent.date,
        startTime: event.time.start.split(" ")[1] || this.newEvent.startTime,
        endTime: event.time.end.split(" ")[1] || this.newEvent.endTime,
        description: event.description || this.newEvent.description,
      };
      this.showDialog = true;
      this.editMode = true;
    },
    deleteEvent(event) {
      this.$API.calendarApi
        .delete(event.id)
        .then(() => {
          socket.emit("deleteEvent", event);
        })
        .catch((error) => {
          console.error("Ошибка при удалении события:", error);
        });
    },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
}
.main-content {
  display: flex;
}
.calendar-container {
  flex: 3;
}
.room-filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px;
}
</style>
