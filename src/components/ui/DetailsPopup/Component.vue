<template>
  <div class="button-item">
    <c-btn
      v-if="link"
      size="sm"
      @click="togglePopup"
      ref="triggerButton"
      :prepend-icon="icon"
      class="circle-button"
      >{{ title }}</c-btn
    >
    <div v-else class="button-item">
      <c-btn
        size="sm"
        color="second-accent"
        @click="togglePopup"
        ref="triggerButton"
        :prepend-icon="icon"
        class="action-button"
        :class="{ 'action-button_toggled': isVisible }"
        >{{ title }}</c-btn
      >
    </div>
    <teleport to="body">
      <div
        v-if="isVisible"
        class="details-popup block border_type-1"
        :style="popupStyle"
        ref="popup"
      >
        <div class="image">
          <img :src="img ? img : 'assets/illustrations/training.png'" @load="onContentLoaded" />
        </div>
        <div class="content">
          <h3 class="h3">{{ title }}</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          <div>{{ description }}</div>
        </div>
        <div>
          <div>
            <c-btn v-if="link" @click="navigateToSection" size="sm"
              >Перейти в раздел</c-btn
            >
            <div v-else class="button-block">
              <c-btn @click="requestFaster" size="sm" :disabled="isRequestSent">
                {{ isRequestSent ? "Запрос принят!" : "Хочу быстрее" }}
              </c-btn>
              <v-tooltip
                :text="'Нажмите, чтобы отправить запрос на приоритетное добавление этого раздела.'"
              >
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" color="addition"
                    >mdi-help-circle-outline</v-icon
                  >
                </template>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
export default {
  name: "DetailsPopup",
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    img: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isVisible: false,
      popupStyle: {},
      popupId: `popup-${Math.random().toString(36).substr(2, 9)}`,
      isRequestSent: false,
    };
  },
  methods: {
    onContentLoaded() {
      this.adjustPosition();
    },
    togglePopup() {
      this.emitCloseEvent(); // Закрывает все остальные попапы перед открытием
      this.isVisible = !this.isVisible;
      if (this.isVisible) {
        this.$nextTick(() => {
          this.adjustPosition();
        });
      }
    },
    adjustPosition() {
      const triggerRect = this.$refs.triggerButton.$el.getBoundingClientRect();
      const popupEl = this.$refs.popup;

      // Default width
      const defaultWidth = 400;

      // Calculate available space
      const spaceBelow = window.innerHeight - triggerRect.bottom - 8;
      const spaceAbove = triggerRect.top - 32;

      // Initial positioning
      let top = triggerRect.bottom + 8; // Default to opening downwards
      let left = triggerRect.left;
      let width = Math.min(defaultWidth, window.innerWidth - 16);
      let maxHeight = spaceBelow; // Default maxHeight to space below

      // Adjust horizontal position if necessary
      if (left + width > window.innerWidth - 8) {
        left = window.innerWidth - width - 8;
        if (left < 8) {
          left = 8;
          width = window.innerWidth - 16;
        }
      }

      // Decide where to open the popup
      if (spaceAbove > spaceBelow) {
        // Open upwards
        maxHeight = spaceAbove;
        top = triggerRect.top - 8; // We'll adjust this after rendering
      }

      // Apply initial styles
      this.popupStyle = {
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        maxWidth: `${width}px`,
        maxHeight: `${maxHeight}px`,
        zIndex: 1000,
        overflowY: "auto",
      };

      // Adjust position after rendering to get actual height
      this.$nextTick(() => {
        if (spaceAbove > spaceBelow) {
          const popupHeight = popupEl.offsetHeight;
          top = triggerRect.top - popupHeight - 8;
          this.popupStyle.top = `${top}px`;
        }
      });
    },
    handleClickOutside(event) {
      if (
        this.isVisible &&
        this.$refs.popup &&
        !this.$refs.popup.contains(event.target) &&
        !this.$refs.triggerButton.$el.contains(event.target)
      ) {
        this.isVisible = false;
      }
    },
    emitCloseEvent() {
      window.dispatchEvent(
        new CustomEvent("close-all-popups", {
          detail: { popupId: this.popupId },
        })
      );
    },
    navigateToSection() {
      window.location.href = this.link;
    },
    requestFaster() {
      this.isRequestSent = true;
      this.$emit("request-faster");
      console.log("Запрос на ускорение отправлен");
    },
    handleCloseAllPopups(event) {
      if (event.detail.popupId !== this.popupId) {
        this.isVisible = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside, {
      capture: true,
    });
    window.addEventListener("close-all-popups", this.handleCloseAllPopups);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside, {
      capture: true,
    });
    window.removeEventListener("close-all-popups", this.handleCloseAllPopups);
  },
};
</script>

<style lang="scss" scoped src="./styles.scss" />
