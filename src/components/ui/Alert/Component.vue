<template>
  <div>
    <div class="alert-block">
      <h3 class="pb-2 pb-md-1">{{ title }}</h3>
      <div class="text-wrapper">
        <slot />
        <v-icon v-if="readed" color="accent" class="pl-1">mdi-check-all</v-icon>
        <v-icon v-else color="addition" class="pl-1">mdi-check</v-icon>
      </div>
    </div>
    <div class="sm">{{ formatTime(time) }}</div>
  </div>
</template>

<script>
export default {
  name: "c-Alert",

  props: {
    title: String,
    time: String,
    readed: Boolean,
  },
  data() {
    return {
      currentTime: this.time,
    };
  },
  methods: {
    formatTime(dateTime) {
      if (!dateTime) return "";
      let time;
      if (dateTime.includes("T")) {
        time = dateTime.split("T")[1].split(".")[0]; // Получаем часть с временем
      } else {
        time = dateTime.split(" ")[1]; // Получаем часть с временем
      }
      return time.slice(0, 5); // Обрезаем до формата HH:MM
    },
  },
};
</script>

<style lang="scss" src="./styles.scss" />
