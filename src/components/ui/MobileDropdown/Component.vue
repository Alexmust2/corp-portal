<template>
  <div
    :class="['custom-select', { 'mb-5': !isScrolledPastImage }]"
    ref="customSelect"
  >
    <div
      :class="{
        'select-header': !isOpen,
        'select-header__active': isOpen,
      }"
      @click="$emit('toggle')"
    >
      <span class="select-text">
        {{ selectedHeader || "Содержание" }}
      </span>
      <v-icon
        class="isOpen_icon"
        :icon="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
      ></v-icon>
    </div>
    <div v-if="isOpen" class="select-dropdown" ref="selectDropdown">
      <div
        v-for="(header, index) in headers"
        :key="index"
        class="select-item"
        :class="{ active: header.active }"
        @click="$emit('select', header)"
        :ref="
          (el) => {
            if (header.active) activeElement = el;
          }
        "
      >
        {{ header.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MobileDropdown",
  props: {
    headers: Array,
    isOpen: Boolean,
    selectedHeader: String,
    isScrolledPastImage: Boolean,
  },
  data() {
    return {
      activeElement: null,
    };
  },
  methods: {
    scrollActiveIntoView() {
      if (this.activeElement && this.$refs.selectDropdown) {
        const dropdownRect = this.$refs.selectDropdown.getBoundingClientRect();
        const activeRect = this.activeElement.getBoundingClientRect();

        if (
          activeRect.top < dropdownRect.top ||
          activeRect.bottom > dropdownRect.bottom
        ) {
          this.activeElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    },
  }
};
</script>

<style scoped lang="scss">
.select-dropdown {
  background-color: rgb(var(--v-theme-background));
  border: 1px solid rgb(var(--v-theme-tertiary));
  border-top: none;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow-y: auto;
  z-index: 9;
  max-height: 130px;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}


.custom-select {
  position: relative;
  margin-top: 20px;
  width: 100%;
}

.select-header,
.select-header__active {
  display: flex;
  position: relative;
  z-index: 10;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 8px;
  border: 1px solid rgb(var(--v-theme-tertiary));
  transition: position 0.3s ease;
  background-color: rgb(var(--v-theme-background));
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  font-family: "Open Sans";
  color: #767676;
}

.select-header__active {
  border-bottom: none;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.select-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 8px;
}
.select-item {
  padding: 0px 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 8px;
  font-family: "Open Sans";
  line-height: 21px;
  color: #787878;

  &:hover {
    background-color: rgba(var(--v-theme-secondary), 0.1);
  }

  &.active {
    color: rgb(var(--v-theme-accent));
    text-decoration: underline;
  }
}
.isOpen_icon {
  font-size: 24px !important;
}
</style>
