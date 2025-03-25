<!-- src/pages/ScreensRoomView.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="9">
        <v-row>
          <v-col cols="12">
            <h1>Комната: {{ roomName }}</h1>
          </v-col>
          <v-col cols="3" v-for="screen in screens" :key="screen.id">
            <v-card>
              <router-link :to="'/screen/' + roomName + '/' + screen.id">
                <v-img :src="screen.preview" aspect-ratio="16/9"></v-img>
                <v-card-title>
                  {{ screen.name }} (ID: {{ screen.id }})
                </v-card-title>
              </router-link>
              <v-card-actions>
                <v-btn icon @click="openEditModal(screen)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <v-form @submit.prevent="createScreen">
          <v-text-field
            v-model="screenName"
            label="Название экрана"
            required
          ></v-text-field>
          <v-btn type="submit" color="primary">Создать экран</v-btn>
        </v-form>
      </v-col>
    </v-row>
    <edit-screen-modal
      v-if="selectedScreen"
      :screen="selectedScreen"
      @close="closeEditModal"
      @save="saveScreen"
      @delete="deleteScreen"
    />
  </v-container>
</template>

<script>
import EditScreenModal from "@/components/EditScreenModal.vue";

export default {
  components: {
    EditScreenModal,
  },
  data() {
    return {
      roomName: this.$route.params.roomName,
      screenName: "",
      screens: [],
      selectedScreen: null,
    };
  },
  created() {
    this.loadScreens();
  },
  methods: {
    async loadScreens() {
      this.screens = await this.$API.screenApi.getScreens(this.roomName);
      console.log(this.screens);
    },
    async createScreen() {
      if (this.screenName.trim() !== "") {
        await this.$API.screenApi.createRoom(this.roomName, {
          name: this.screenName,
        });
        this.screenName = "";
        this.loadScreens();
      }
    },
    openEditModal(screen) {
      this.selectedScreen = screen;
    },
    closeEditModal() {
      this.selectedScreen = null;
    },
    async saveScreen(updatedScreen) {
      await this.$API.screenApi.updateScreen(updatedScreen.id, updatedScreen)
      this.closeEditModal();
      this.loadScreens();
    },
    async deleteScreen(screenId) {
      await this.$API.screenApi.deleteScreen(screenId)
      this.closeEditModal();
      this.loadScreens();
    },
  },
};
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
