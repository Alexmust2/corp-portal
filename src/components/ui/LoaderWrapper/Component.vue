<template>
  <transition name="fade" mode="out-in">
    <div v-if="loading" key="loading" class="loading-overlay">
      <div class="loading-content">
        <v-progress-circular
          :size="isMobile ? 40 : 60"
          :width="isMobile ? 4 : 6"
          color="rgba(137, 203, 31, 1)"
          indeterminate
          class="loading-spinner"
        ></v-progress-circular>
        <div class="loading-text">{{ loadingText }}</div>
      </div>
    </div>
    <div v-else key="content" class="fade-in">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: "LoadingWrapper",
  props: {
    loading: {
      type: Boolean,
    },
    loadingText: {
      type: String,
      default: "Загрузка данных...",
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  loadingText: {
    type: String,
    default: "Загрузка данных...",
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
};
</script>

<style scoped>
.loading-overlay {
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading-spinner {
  display: inline-block;
  animation: spin 2s linear infinite;
}

.loading-text {
  margin-top: 16px;
  font-size: 18px;
  font-weight: 400;
  font-family: "Open Sans";
  color: rgba(137, 203, 31, 1);
  @media screen and (max-width: 768) {
    font-size: 16px;
  }
}

.loading-content {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading-spinner {
  display: inline-block;
  animation: spin 2s linear infinite;
}

.loading-text {
  margin-top: 16px;
  font-size: 18px;
  font-weight: 400;
  font-family: "Open Sans";
  color: rgba(137, 203, 31, 1);
  @media screen and (max-width: 768) {
    font-size: 16px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-in {
  animation: fadeIn 0.5s;
  width: inherit;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
