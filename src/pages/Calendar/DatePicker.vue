<template>
  <div class="custom-date-picker">
    <v-menu
      :model-value="menu"
      transition="scale-transition"
      offset-y
      location-strategy="connected"
      origin="auto"
      :close-on-content-click="false"
      :close-on-backdrop-click="false"
    >
      <template #activator="{ props }">
        <v-text-field
          v-model="displayDate"
          v-bind="props"
          :readonly="true"
          @click="menu = true"
          dense
          hide-details
          outlined
        />
      </template>

      <v-date-picker
        v-model="internalSelectedDate"
        :min="min"
        :max="max"
        @update:modelValue="onDateSelected"
        hide-header
        hide-weekdays
      />
    </v-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "DatePicker",
  props: {
    modelValue: String as PropType<string | null>,
    min: String,
    max: String,
  },
  emits: ["update:modelValue", "date-selected"],
  data() {
    return {
      menu: false,
      internalSelectedDate: null as Date | null,
      displayDate: "",
    };
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newVal: string | null) {
        if (newVal) {
          const [year, month, day] = newVal.split("-").map(Number);
          const d = new Date(year, month - 1, day, 12);
          this.internalSelectedDate = d;
          this.displayDate = this.formatDateAsString(d, "ru-RU");
        } else {
          this.internalSelectedDate = null;
          this.displayDate = "";
        }
      },
    },
  },
  methods: {
    onDateSelected(value: Date | null) {
      if (!value) {
        this.internalSelectedDate = null;
        this.displayDate = "";
        this.$emit("update:modelValue", null);
        this.$emit("date-selected", null);
        this.menu = false;
        return;
      }

      const correctedDate = new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate(),
        12
      );

      const formatted = this.formatYyyyMmDd(correctedDate);
      this.$emit("update:modelValue", formatted);
      this.$emit("date-selected", correctedDate);

      this.displayDate = this.formatDateAsString(correctedDate, "ru-RU");
      this.internalSelectedDate = correctedDate;
      this.menu = false;
    },
    formatYyyyMmDd(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    formatDateAsString(date: Date, locale: string): string {
      if (!date) return "";
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        day: "numeric",
      };
      return date.toLocaleDateString(locale, options).toUpperCase();
    },
  },
});
</script>
<style lang="scss" scoped></style>
