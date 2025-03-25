<template>
  <div class="image-block">
    <img :src="src" :alt="alt" />
  </div>
</template>

<script>
export default {
  name: "image-block",
  props: {
    src: String,
    alt: String,
  },
};
</script>

<style lang="scss" scoped>
.image-block {
  display: flex;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
