<template>
  <cInput
    prepend-inner-icon="mdi-magnify"
    class="search-input"
    notFocus
    :height="height"
    :hide-details="true"
  />
</template>

<script>
export default {
  name: "c-search-input",
  props: {
    height: {
      type: [Number, String],
      default: 50,
    },
  },
};
</script>

<style lang="scss" scoped>
.search-input {
  --input-height: 50px;
  @media screen and (min-width: 960px) {
    height: 100%;
    max-height: 50px;
    :deep(.v-icon)::before {
      height: 18px;
      width: 18px;
      font-size: 22px;
    }
  }
}
</style>
