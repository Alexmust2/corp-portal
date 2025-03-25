<template>
  <button :class="buttonClasses" :disabled="isDisabled" :style="buttonColor">
    <template v-if="prependIcon && !isIconOnly">
      <v-icon :icon="prependIcon" class="prepend-icon"></v-icon>
    </template>

    <span v-if="!isIconOnly && !isLoading" class="button-text">
      <slot />
    </span>

    <template v-if="appendIcon && !isIconOnly">
      <v-icon :icon="appendIcon" class="append-icon"></v-icon>
    </template>

    <template v-if="isIconOnly && !isLoading">
      <v-icon :icon="icon" class="icon-only"></v-icon>
    </template>
  </button>
</template>

<script>
export default {
  name: "c-btn",
  props: {
    customClass: String,
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg"].includes(value),
    },
    color: {
      type: String,
      default: "accent",
    },
    icon: String,
    prependIcon: String,
    appendIcon: String,
    disabled: Boolean,
    isLoading: Boolean,
    block: Boolean,
  },
  computed: {
    buttonClasses() {
      return [
        "button",
        `size-${this.size}`,
        this.customClass,
        {
          "icon-only-button": this.isIconOnly,
          "is-loading": this.isLoading,
          disabled: this.isDisabled,
          "btn-block": this.block,
        },
      ];
    },
    isIconOnly() {
      return this.icon;
    },
    isDisabled() {
      return this.disabled || this.isLoading;
    },
    buttonColor() {
      return {
        backgroundColor: `rgb(var(--v-theme-${this.color}))`,
        color: `rgb(var(--v-theme-on-${this.color}))`,
      };
    },
  },
};
</script>

<style lang="scss" scoped src="./styles.scss"></style>
