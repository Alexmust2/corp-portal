<template>
  <div v-if="!disabled" class="refresh">
    <div
      @touchstart="handleTouchStart"
      @touchmove.prevent="handleTouchMove"
      @touchend="handleTouchEnd"
      class="pull-to-refresh-container"
    >
      <div
        class="pull-to-refresh-icon"
        :style="{ opacity: pullDistance > 0 || isRefreshing ? 1 : 0 }"
      >
        <v-icon v-if="!isPulledToMax && !isRefreshing">mdi-arrow-down</v-icon>
        <v-icon v-else-if="!isRefreshing">mdi-arrow-up</v-icon>
        <v-icon v-else class="spin">mdi-reload</v-icon>
      </div>
      <div
        class="pull-to-refresh-content"
        :style="{ transform: `translateY(${pullDistance}px)` }"
        :class="{ 'no-transition': isDragging }"
      >
        <slot></slot>
      </div>
    </div>
  </div>
  <div v-else>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pullDistance: 0,
      startY: 0,
      isPulledToMax: false,
      isRefreshing: false,
      maxPullDistance: 100, // Maximum pull distance in pixels
    };
  },
  computed: {
    isDragging() {
      return this.pullDistance > 0 && !this.isRefreshing;
    },
  },
  methods: {
    handleTouchStart(event) {
      if (this.disabled || this.isRefreshing) return;
      // Only start if at the top
      if (window.scrollY > 0) return;

      this.startY = event.touches[0].clientY;
      this.pullDistance = 0;
      this.isPulledToMax = false;
    },
    handleTouchMove(event) {
      if (this.disabled || this.isRefreshing) return;
      if (window.scrollY > 0) return;

      const currentY = event.touches[0].clientY;
      const deltaY = currentY - this.startY;

      if (deltaY > 0) {
        this.pullDistance = Math.min(deltaY, this.maxPullDistance);

        if (this.pullDistance >= this.maxPullDistance) {
          this.isPulledToMax = true;
        } else {
          this.isPulledToMax = false;
        }
      }
    },
    handleTouchEnd() {
      if (this.disabled || this.isRefreshing) return;

      if (this.isPulledToMax) {
        this.isRefreshing = true;
        // Start the reload animation
        setTimeout(() => {
          location.reload();
        }, 500); // Adjust delay as needed
      } else {
        // Animate back to 0
        this.pullDistance = 0;
      }
    },
  },
  watch: {
    pullDistance(newVal) {
      if (newVal === 0) {
        this.isRefreshing = false;
      }
    },
  },
};
</script>

<style scoped>

.pull-to-refresh-container {
  overflow: hidden;
  position: relative;
}

.pull-to-refresh-content {
  transition: transform 0.3s ease;
}

.pull-to-refresh-content.no-transition {
  transition: none;
}

.pull-to-refresh-icon {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.3s ease;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
