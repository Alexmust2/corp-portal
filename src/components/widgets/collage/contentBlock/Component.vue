<template>
  <div class="content-block" :style="blockStyle">
    <div v-if="textAboveIcon">
      <div class="text d-block text-no-wrap">{{ text }}</div>
      <v-icon :size="!isMobile ? '48':'24'" class="icon">{{ icon }}</v-icon>
    </div>
    <div v-else>
      <v-icon :size="!isMobile ? '48':'24'" class="icon">{{ icon }}</v-icon>
      <div class="text d-block text-no-wrap">{{ text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "content-block",
  props: {
    icon: String,
    text: String,
    color: String,
    textAboveIcon: Boolean,
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    blockStyle() {
      return {
        backgroundColor: this.getColor(this.color),
        color: this.getTextColor(this.color),
      };
    },
  },
  methods: {
    getColor(colorName) {
      const colors = this.$vuetify.theme.global.current.colors;
      return colors[colorName];
    },
    getTextColor(colorName) {
      const onColorName = `on-${colorName}`;
      const colors = this.$vuetify.theme.global.current.colors;
      return colors[onColorName];
    },
  },
};
</script>

<style lang="scss" scoped>
.content-block {
  position: relative;
  width: 100%;
  height: 100%;

  > div {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
    padding: 10%;
  }

  .text {
    font-weight: 600;
    font-size: clamp(0.625rem, -0.0312rem + 3.1818vw, 0.84375rem);
    line-height: 114%;
    letter-spacing: -0.02em;

    @media screen and (min-width: 960px) {
      font-size: 22px;
      line-height: 150%;
    }
  }
}
</style>
