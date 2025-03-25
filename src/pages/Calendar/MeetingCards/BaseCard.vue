<template>
  <div class="border_type-1">
    <div :class="['card-header', durationClass]">

        <h3 v-tooltip="title" class="title">{{ title }}</h3>
    
      <cEllipsisMenu
        :onEdit="onEdit"
        :onDelete="onDelete"
        v-if="canEditOrDelete"
        :confirm-dialog="confirmDialog"
      />
    </div>
    <slot> </slot>
  </div>
</template>                                                                          

<script>
export default {
  data() {
    return {
      confirmDialog: {
        title: "Удаление встречи",
        text: "Вы уверены, что хотите удалить эту встречу? Все данные о встрече будут утеряны, и действие нельзя будет отменить.",
        confirmButtonText: "Удалить",
        cancelButtonText: "Отменить",
        type: "delete",
      }
    };
  },
  name: "base-card",
  props: {
    title: String,
    time: String,
    canEditOrDelete: Boolean,
    onEdit: Function,
    onDelete: Function,
    
  },
  computed: {
    durationClass() {
      if (!this.time) return "";
      const [start, end] = this.time.split(" - ").map((t) => {
        const [hours, minutes] = t.split(":").map(Number);
        return hours * 60 + minutes; // Перевод времени в минуты
      });
      const duration = end - start; // Длительность встречи в минутах

      if(duration % 15 === 0) return 'm' + duration;

      return "";
    },
  },
};
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;

  > .title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgb(var(--v-theme-primary));
  }
}
</style>
