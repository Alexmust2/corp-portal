<template>
  <v-list-item
    v-bind="props"
    :class="['date-item', { 'item-active': props.selected }]"
    @mouseenter="$emit('hover', item.value)"
    @mouseleave="$emit('hover', null)"
  >
    <template #prepend>
      <v-icon
        :class="{ 'icon-visible': isHovered || props.selected }"
        icon="mdi-check"
        color="primary"
      />
    </template>
  </v-list-item>
</template>

<script>
export default {
  name: "TimeSelectItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
    props: {
      type: Object,
      required: true,
    },
    isHovered: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["hover"],
};
</script>

<style scoped>
.date-item {
  position: relative;
}

.v-icon {
  position: absolute;
  left: 8px;
  opacity: 0;
}

.v-list-item:hover,
.v-list-item:focus-within,
.v-list-item:active,
.v-list-item:focus {
  background-color: transparent !important;
}

.date-item:hover .v-icon,
.item-active .v-icon {
  opacity: 1;
}

:deep(.v-list-item__overlay) {
  display: none !important;
}

.item-active {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
}

.icon-visible {
  opacity: 1 !important;
}

:deep(.v-list-item:hover),
:deep(.v-list-item:focus),
:deep(.v-list-item:active),
:deep(.v-list-item--active) {
  background-color: transparent !important;
}

:deep(.item-active) {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
}

:deep(.item-active) .v-icon {
  opacity: 1 !important;
}
</style>
