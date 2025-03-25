<template>
  <c-form
    class="slide-panel"
    :class="{ open: visible }"
    v-touch="{ right: onSwipeRight }"
    v-click-outside="{
      handler: closePanel,
      closeConditional: closeConditional,
      include: includeElements,
    }"
  >
    <template #header>
      <div class="slide-panel_header" v-if="!$slots.header">
        <button @click="closePanel">
          <v-icon size="x-large" color="secondary">{{ closeIcon }}</v-icon>
        </button>
        <h2 class="title h1">{{ title }}</h2>
      </div>
      <slot name="header" :close-panel="closePanel" />
    </template>

    <slot></slot>

    <template #footer>
      <slot name="footer"></slot>
    </template>
  </c-form>
</template>

<script>
export default {
  name: "slide-panel",
  props: {
    modelValue: Boolean,
    title: String,
  },
  emits: ["update:modelValue"],
  data() {
    return {
      visible: this.modelValue,
      isHistoryPushed: false,
    };
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    closeIcon() {
      return this.isMobile ? "mdi-chevron-left" : "mdi-close";
    },
  },
  watch: {
    modelValue(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("update:modelValue", val);
      
      if (!val && this.isHistoryPushed) {
        window.history.back();
        this.isHistoryPushed = false;
      }
    },
  },
  methods: {
    closePanel() {
      this.visible = false;
    },
    onSwipeRight() {
      if (!this.isHistoryPushed) {
        window.history.pushState({ panelOpened: true }, '');
        this.isHistoryPushed = true;
      }
      this.closePanel();
    },
    closeConditional(event) {
      return this.visible && !this.$el.contains(event.target);
    },
    includeElements() {
      return [...document.querySelectorAll(".v-overlay-container")];
    },
    handleEsc(event) {
      if (event.key === "Escape") {
        this.closePanel();
      }
    },
    handlePopState(event) {
      if (this.visible) {
        this.visible = false;
      }
      if (!event.state || !event.state.panelOpened) {
        this.isHistoryPushed = false;
      }
    },
  },
  mounted() {
    document.addEventListener("keydown", this.handleEsc);
    window.addEventListener("popstate", this.handlePopState);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleEsc);
    window.removeEventListener("popstate", this.handlePopState);
  },
};
</script>

<style lang="scss" src="./styles.scss" scoped></style>
