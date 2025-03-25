<!-- src/pages/ScreenView.vue -->
<template>
  <component :is="currentComponent.name"></component>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
data() {
  return {
    roomName: this.$route.params.roomName,
    screenId: this.$route.params.screenId,
    screen: null,
    currentComponent: null,
    currentIndex: 0
  };
},
async created() {
  const screens = await this.$API.screenApi.getScreens(this.roomName)
  console.log(screens)
  this.screen = screens.find(screen => screen.id === parseInt(this.screenId));
  if (this.screen && this.screen.Components.length > 0) {
    this.currentComponent = this.screen.Components[0];
    this.startTimer();
  }
},
components: {
  BestEmployeeComponent: defineAsyncComponent(() => import('@/components/screens/BestEmployeeComponent.vue')),
  BirthdaysComponent: defineAsyncComponent(() => import('@/components/screens/BirthdaysComponent.vue'))
},
methods: {
  startTimer() {
    setTimeout(this.nextComponent, this.currentComponent.ScreenComponent.duration * 1000);
  },
  nextComponent() {
    this.currentIndex = (this.currentIndex + 1) % this.screen.Components.length;
    this.currentComponent = this.screen.Components[this.currentIndex];
    this.startTimer();
  }
}
};
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>