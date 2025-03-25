<template>
  <div class="time-grid">
    <button
      class="btn time-grid-week"
      :class="{ active: activeView === 'timeGridWeek' }"
      @click="onWeekClick"
    >
      Неделя
    </button>
    <button
      class="btn time-grid-day"
      :class="{ active: activeView === 'timeGridDay' }"
      @click="onDayClick"
    >
      День
    </button>
  </div>
</template>

<script>
export default {
  name: "TimeGrid",
  props: {
    activeView: {
      type: String,
      required: true,
    },
  },
  emits: ["weekClick", "dayClick"],
  methods: {
    onWeekClick() {
      this.$emit("weekClick");
    },
    onDayClick() {
      this.$emit("dayClick");
    },
  },
};
</script>

<style lang="scss" scoped>
.time-grid {
  display: flex;

  > .btn {
    border: 1px solid rgb(var(--v-theme-tertiary));
    color: rgb(var(--v-theme-secondary));
    border-radius: 32px;
    padding: 9px 15px;
    cursor: pointer;
    transition: color 0.2s ease;

    &.active {
      color: rgb(var(--v-theme-accent));
    }

    &:hover {
      color: rgb(var(--v-theme-accent));
    }

    @media screen and (min-width: 960px) {
      font-size: 14px;
    }
    @media screen and (min-width: 1200px) {
      font-size: inherit;
    }
  }

  > .time-grid-week {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-left: 20px;
  }

  > .time-grid-day {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    padding-right: 20px;
  }
}
</style>
