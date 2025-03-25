<template>
  <div class="collage-container">
    <div
      v-for="(block, index) in layout"
      :key="index"
      :class="['collage-item', block.type]"
    >
      <imageBlock
        v-if="block.type === 'image'"
        :src="block.src"
        :alt="block.alt"
      />

      <contentBlock
        v-else
        :icon="block.icon"
        :text="block.text"
        :color="block.color"
        :reverse="block.reverse"
        :textAboveIcon="block.textAboveIcon"
      />
    </div>
  </div>
</template>

<script>
import imageBlock from "./imageBlock";
import contentBlock from "./contentBlock";
import layouts from "./mobileLayout";

export default {
  name: "MobileCollage",
  components: {
    imageBlock,
    contentBlock,
  },
  data() {
    return {
      layouts,
      layout: [],
    };
  },
  methods: {
    generateLayout() {
      const layoutIndex = Math.floor(Math.random() * this.layouts.length);
      this.layout = this.layouts[layoutIndex];
    },
  },
  created() {
    this.generateLayout();
  },
};
</script>

<style lang="scss" src="./mobileCollage.scss" scoped></style>
