<template>
  <div class="form" :class="[`form--padding-${formPadding}`, { 'border_type-1': !isMobile && border }]">
    <div
      class="form_header"
      :class="[
        `form_header--padding-${headerPadding}`
      ]"
      v-if="$slots.header"
    >
      <slot name="header"></slot>
    </div>
    <div
      class="form_content"
      :class="[
        `form_content--padding-${contentPadding}`
      ]"
      :style="{ height: `${contentHeight}` }"
    >
      <slot></slot>
    </div>
    <div
      class="form_footer"
      :class="[
        `form_footer--padding-${footerPadding}`
      ]"
      v-if="$slots.footer"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "c-form",
  computed:{
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
  },
  props: {
    border: {
      type: Boolean,
      default: true,
    },
    contentHeight: {
      type: Number,
    },
    formPadding: {
      type: Number,
      default: 30,
    },
    headerPadding: {
      type: Number,
      default: 32,
    },
    contentPadding: {
      type: Number,
      default: 32,
    },
    footerPadding: {
      type: Number,
      default: 32,
    },
  },
};
</script>

<style lang="scss" src="./styles.scss" scoped></style>
