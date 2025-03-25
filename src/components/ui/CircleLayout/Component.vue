<template>
  <div class="circle-container" >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "CircleLayout",
  props: {
    marginX: {
      type: Number,
      default: 0, // Horizontal margin in percentages
    },
    marginY: {
      type: Number,
      default: 0, // Vertical margin in percentages
    },
    animationDuration: {
      type: Number,
      default: 2000, // Total animation duration in milliseconds
    },
    parallaxStrength: {
      type: Number,
      default: 20, // Maximum offset for parallax in pixels
    },
  },
  data() {
    return {
      parallaxData: [], // For storing parallax data for each element
    };
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
  },
  mounted() {
    this.positionChildren();
    this.createResizeObserver();
    this.setupParallax();
  },
  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.removeParallax();
  },
  methods: {
    createResizeObserver() {
      const parent = this.$el.parentNode;
      this.resizeObserver = new ResizeObserver(() => {
        this.positionChildren();
      });
      this.resizeObserver.observe(parent);
    },
    positionChildren() {
      const container = this.$el;
      const parent = container.parentNode;

      // Ensure the parent has relative positioning
      if (window.getComputedStyle(parent).position === "static") {
        parent.style.position = "relative";
      }

      // Get parent container dimensions
      const parentWidth = parent.clientWidth;
      const parentHeight = parent.clientHeight;

      // Margins in percentages of parent dimensions
      const marginXValue = (this.marginX / 100) * parentWidth;
      const marginYValue = (this.marginY / 100) * parentHeight;

      // Calculate ellipse dimensions
      const width = parentWidth + 2 * marginXValue;
      const height = parentHeight + 2 * marginYValue;
      const radiusX = width / 2;
      const radiusY = height / 2;

      // Set container dimensions
      container.style.width = `${width}px`;
      container.style.height = `${height}px`;
      container.style.position = "absolute";
      container.style.left = "50%";
      container.style.top = "50%";
      container.style.transform = "translate(-50%, -50%)";

      const children = container.children;
      const total = children.length;

      // Get child element dimensions (assuming they are the same)
      let childWidth = 0;
      let childHeight = 0;
      if (children.length > 0) {
        const childRect = children[0].getBoundingClientRect();
        childWidth = childRect.width;
        childHeight = childRect.height;
      }

      const positions = this.isMobile
        ? [
            { x: -0.5, y: -0.7 }, // Верхний левый (Переговорные)
            { x: 0.6, y: -0.7 }, // Верхний правый (Пользователи)
            { x: -0.6, y: 0 }, // Средний левый (Заявления)
            { x: 0.7, y: 0 }, // Средний правый (Поддержка)
            { x: -0.5, y: 0.7 }, // Нижний левый (Статьи)
            { x: 0.6, y: 0.7 }, // Нижний правый (Пользователи)
          ]
        : [
            { x: -0.7, y: -0.5 }, // Верхний левый (Переговорные)
            { x: 0.7, y: -0.5 }, // Верхний правый (Пользователи)
            { x: 0.85, y: 0 }, // Средний правый (Поддержка)
            { x: 0, y: 0.7 }, // Нижний центр (Есть идея?)
            { x: -0.7, y: 0.5 }, // Нижний левый (Статьи)
            { x: -0.8, y: 0 }, // Средний левый (Заявления)
            { x: 0.7, y: 0.5 }, // Нижний правый (Пользователи)
          ];
      if (this.animationDuration === 0) {
        // No animation
        for (let i = 0; i < total; i++) {
          const child = children[i];
          // const angle = (2 * Math.PI * i) / total;
          const position = positions[i % positions.length];

          // Position on the ellipse
          const x = radiusX + (width / 2) * position.x - childWidth / 2;
          const y = radiusY + (height / 2) * position.y - childHeight / 2;

          // Set styles
          child.style.position = "absolute";
          child.style.left = `${x}px`;
          child.style.top = `${y}px`;
          child.style.opacity = "1";
        }
      } else {
        const totalDuration = this.animationDuration;
        const singleDuration = totalDuration / total;

        for (let i = 0; i < total; i++) {
          const child = children[i];
          const position = positions[i % positions.length];

          // Final position on the ellipse
          const x = radiusX + (width / 2) * position.x - childWidth / 2;
          const y = radiusY + (height / 2) * position.y - childHeight / 2;

          // Set initial styles
          child.style.position = "absolute";
          child.style.left = `${x}px`;
          child.style.top = `${y}px`;
          child.style.opacity = "0";

          // Delay for sequential fade-in
          const delay = singleDuration * i;

          // Start opacity animation after delay
          setTimeout(() => {
            this.animateOpacity(child, singleDuration);
          }, delay);
        }
      }
    },
    animateOpacity(child, duration) {
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        let progress = elapsed / duration;
        if (progress > 1) progress = 1;

        // Apply easing function (cubic ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        // Update opacity
        child.style.opacity = easedProgress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    },
    setupParallax() {
      if (this.isMobile) {
        return;
      }
      const container = this.$el;
      const children = container.children;
      const total = children.length;

      // Generate random directions for each element
      this.parallaxData = [];
      for (let i = 0; i < total; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        this.parallaxData.push({ dx, dy });
      }

      // Add mouse event listener
      this.handleMouseMove = this.handleMouseMove.bind(this);
      window.addEventListener("mousemove", this.handleMouseMove);
    },
    removeParallax() {
      window.removeEventListener("mousemove", this.handleMouseMove);
    },
    handleMouseMove(event) {
      // if (!this.isParallaxEnabled) return;
      const containerRect = this.$el.getBoundingClientRect();
      const mouseX =
        event.clientX - containerRect.left - containerRect.width / 2;
      const mouseY =
        event.clientY - containerRect.top - containerRect.height / 2;

      const maxOffset = this.parallaxStrength;

      const children = this.$el.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const { dx, dy } = this.parallaxData[i];

        // Calculate offset
        const offsetX = (dx * mouseX * maxOffset) / window.innerWidth;
        const offsetY = (dy * mouseY * maxOffset) / window.innerHeight;

        // Apply offset
        child.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    },
  },
};
</script>
