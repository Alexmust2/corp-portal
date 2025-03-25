<template>
  <div class="button-group">
    <button
      v-for="(item, index) in items"
      class="button"
      :active-index="activeIndex"
      :key="index"
      :class="{ active: index === activeIndex }"
      :style="{
        height: height + 'px',
      }"
      @click="$emit('group-item-click', index)"
    >
      <span>{{ item.label }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "button-group",
  props: {
    items: {
      type: Array,
      default: () => [
        {
          label: "Default Label 1",
        },
        {
          label: "Default Label 2",
        },
      ],
    },
    height: {
      type: Number,
      default: 45,
    },
    activeIndex: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped src="./styles.scss"></style>
