<template>
  <div :class="isWide ? 'c-wide' : 'c-single'">
    <div :class="[`c-${size}`, color]">
      <div
        v-if="imageClass"
        alt="Image block"
        :class="['c-image', imageClass]"
      />
      <span :class="['c-text', textClass]">
        {{ text }}
      </span>
      <v-icon :class="['c-icon', iconClass]" v-if="icon">{{ icon }}</v-icon>
    </div>
  </div>
  <div v-if="isWide" class="c-block" />
</template>
<script>
export default {
  name: "c-block",
  props: {
    size: {
      type: String,
      default: 'medium'
    },
    imageClass: String,
    text: String,
    icon: String,
    textPosition: String,
    iconPosition: String,
    random: Boolean,
    color: String,
    isWide: Boolean,
  },
  computed: {
    textClass() {
      return `c-${this.random ? this.getRandomTextPositionClass() : this.textPosition}`;
    },
    iconClass() {
      return `c-${this.random
        ? this.getOppositePositionClass()
        : this.iconPosition}`;
    },
  },
  data() {
    return {
      randomTextPosition: "",
      topPositions: ["top-left", "top-center", "top-right"],
      bottomPositions: ["bottom-left", "bottom-center", "bottom-right"],
    };
  },
  methods: {
    getRandomTextPositionClass() {
      const allPositions = [...this.topPositions, ...this.bottomPositions];

      const randomPosition = allPositions[Math.floor(Math.random() * allPositions.length)];
      this.randomTextPosition = randomPosition;

      return randomPosition;
    },
    getOppositePositionClass() {
      let oppositePosition;

      if (this.topPositions.includes(this.randomTextPosition)) {
        const randomBottom = this.bottomPositions[Math.floor(Math.random() * this.bottomPositions.length)];
        oppositePosition = randomBottom;
      } else {
        const randomTop = this.topPositions[Math.floor(Math.random() * this.topPositions.length)];
        oppositePosition = randomTop;
      }

      return oppositePosition;
    },
  },
};
</script>

<style lang="scss" scoped src="./styles.scss" />
