<!-- src/pages/ScreensControllView.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="9">
        <v-row>
          <v-col cols="12">
            <h1>Управление экранами</h1>
          </v-col>
          <v-col cols="3" v-for="room in rooms" :key="room.id">
            <v-card>
              <router-link :to="'/screen/' + room.name">
                <v-card-title>{{ room.name }}</v-card-title>
              </router-link>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <v-form @submit.prevent="createRoom">
          <v-text-field
            v-model="roomName"
            label="Название комнаты"
            required
          ></v-text-field>
          <v-btn type="submit" color="primary">Создать</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      roomName: "",
      rooms: [],
    };
  },
  created() {
    this.loadRooms();
  },
  methods: {
    async loadRooms() {
      this.rooms = await this.$API.screenApi.getAllRooms();
    },
    async createRoom() {
      if (this.roomName.trim() !== "") {
        await this.$API.screenApi.createRoom({ name: this.roomName });
        this.roomName = "";
        this.loadRooms();
      }
    },
  },
};
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
