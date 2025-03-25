<template>
  <div class="processing-card border_type-1 d-flex flex-column">
    <div>
      <div class="d-flex justify-space-between pb-2">
        <div class="card-header d-flex align-center">
          <c-avatar
            v-bind="getAvatarProps(data.user)"
            :size="36"
            class="rounded-circle mr-2"
          ></c-avatar>
          <div>{{data.user?.first_name}} {{data.user?.last_name}}</div>
        </div>
        <c-chip class="chip" :color="statusClass">{{ data.status }}</c-chip>
      </div>
      <div class="d-flex justify-space-between">
        <h3 class="statement-card-type">{{ data.type }}</h3>
        <div class="date-text">{{ formattedDate(data.created_at) }}</div>
      </div>
    </div>
    <div class="d-flex justify-space-between mt-auto">
      <div class="last-changes">Последние изменения</div>
      <div class="date-text">{{ formattedDate(data.updated_at) }}</div>
    </div>
  </div>
</template>

<script>
import { getAvatarProps } from '@/globalFunctions/avatarUtils';

export default {
  name: "StatementsCard",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    statusClass() {
      const statusColors = {
        Обработана: "accent",
        "В работе": "secondary",
        Отклонено: "red",
        Отправлена: "primary",
        Закуплено: "secondary",
        Выдано: "accent",
      };
      return statusColors[this.data.status] || "default";
    },
  },
  methods: {
    getAvatarProps,
    formattedDate(date) {
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      const timeOptions = { hour: "2-digit", minute: "2-digit" };
      const formattedDate = new Date(date).toLocaleDateString("ru-RU", options);
      const formattedTime = new Date(date).toLocaleTimeString(
        "ru-RU",
        timeOptions
      );
      return `${formattedDate} в ${formattedTime}`;
    },
  },
};
</script>

<style lang="scss" scoped src="./styles.scss" />
