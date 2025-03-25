<template>
    <v-img
      :width="width"
      aspect-ratio="1/1"
      cover
      alt="photo"
      :src="computedImageSrc"
    ></v-img>
</template>
<script>
export default {
  name: "c-GalleryImage",
  props: {
    width: {
      type: Number,
      default: 300,
    },
    file: {
      type: [File, Object],
      required: true,
    },
  },
  data() {
    return {
      imageSrc: null,
    };
  },
  computed: {
    isServerFile() {
      return this.file && typeof this.file === "object" && this.file.file_path;
    },
    isImage() {
      if (this.isServerFile) {
        return this.file.file_type && this.file.file_type.startsWith("image/");
      }
      return this.file.type && this.file.type.startsWith("image/");
    },

    computedImageSrc() {
      if (this.isServerFile) {
        return process.env.VUE_APP_API_URL + this.file.file_path;
      } else {
        return this.imageSrc;
      }
    },
  },
};
</script>
<style lang="scss"></style>
