<template>
  <div ref="animationContainer" v-bind="$attrs"/>
</template>

<script>
import lottie from "lottie-web";

export default {
  name: "c-animation",
  props: {
    animationName: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.loadAnimationData();
  },
  methods: {
    async loadAnimationData() {
      try {
        const response = await fetch(`/animations/${this.animationName}.json`);
        if (!response.ok) {
          throw new Error(`Ошибка загрузки файла: ${response.statusText}`);
        }
        const animationData = await response.json();

        lottie.loadAnimation({
          container: this.$refs.animationContainer,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: animationData.default || animationData,
        });
      } catch (error) {
        console.error(
          `Ошибка при загрузке анимации ${this.animationName}:`,
          error
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
