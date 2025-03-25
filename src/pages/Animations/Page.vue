<template>
  <div class="animations-page block">
    <cAnimation
      v-for="(animation, index) in animations"
      :key="index"
      :animationName="animation"
      class="custom-animation-class"
    />
  </div>
</template>

<script>
export default {
  name: "animations-page",
  data() {
    return {
      animations: [
        "divan",
        "notifications",
        "successful_action",
        "support",
        "team_building",
      ]
    };
  },
};
</script>
<style lang="scss" scoped>
.animations-page {
  display: flex;
  flex-direction: column;
}
.custom-animation-class {
  width: 300px;
  height: 300px;
}
</style>
