<template>
  <div class="collage-container" ref="collageContainer">
    <div
      v-for="(block, index) in layout"
      :key="index"
      :class="['collage-item', block.type, { 'span-2': block.span === 2 }]"
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
        :textAboveIcon="block.textAboveIcon"
      />
    </div>
  </div>
</template>

<script>
import imageBlock from "./imageBlock";
import contentBlock from "./contentBlock";
import layoutTemplate from "./desktopLayout";
import imagesVariants from "./imagesVariants";

export default {
  name: "DesktopCollage",
  components: {
    imageBlock,
    contentBlock,
  },
  data() {
    return {
      imagesVariants,
      layoutTemplate,
      layout: [],
    };
  },
  methods: {
    generateLayout() {
      const imagesVariantIndex = Math.floor(
        Math.random() * this.imagesVariants.length
      );
      const images = [...this.imagesVariants[imagesVariantIndex]];

      let imageIndex = 0;
      this.layout = this.layoutTemplate.map((block) => {
        if (block.type === "image") {
          const src = images[imageIndex % images.length];
          imageIndex++;
          return {
            ...block,
            src,
            alt: `Изображение ${imageIndex}`,
          };
        } else {
          return block;
        }
      });
    },
  },
  created() {
    this.generateLayout();
  },
};
</script>

<style lang="scss" src="./desktopCollage.scss" scoped></style>
