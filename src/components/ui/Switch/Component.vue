<template>
  <div @click="toggle">
  <!-- table view switch -->
    <div v-if="tableViewSwitch" class="table-switch">

      <div class="dots">
        <span :class="{active: !isChecked}" class="dot" v-for="n in 6" :key="n"></span>
      </div>

      <div class="lines">
        <span :class="{active: isChecked}" class="line" v-for="n in 4" :key="n"></span>
      </div>

    </div>
    <!-- default switch -->
    <div
      v-else
      class="switch-container"
      :class="{ absolute: isPositioned }"
      :style="[switchStyles, positionStyles]"
      
    >
      <div
        class="switch-circle"
        :class="{ active: isChecked }"
        :style="circleStyles"
      >
        <v-icon v-if="withIcons" class="circle-icon">
          {{ isChecked ? "mdi-weather-night" : "mdi-white-balance-sunny" }}
        </v-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "c-switch",
  props: {
    modelValue: Boolean,
    withIcons: Boolean,
    top: [Boolean, String],
    right: [Boolean, String],
    bottom: [Boolean, String],
    left: [Boolean, String],
    tableViewSwitch: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      isChecked: this.modelValue,
    };
  },
  computed: {
    isPositioned() {
      return this.top || this.right || this.bottom || this.left;
    },
    positionStyles() {
      const styles = {};
      if (this.top) styles.top = this.top === true ? "0" : this.top;
      if (this.right) styles.right = this.right === true ? "0" : this.right;
      if (this.bottom) styles.bottom = this.bottom === true ? "0" : this.bottom;
      if (this.left) styles.left = this.left === true ? "0" : this.left;
      return styles;
    },
    switchStyles() {
      const theme = this.$vuetify.theme.global.current;
      return {
        backgroundColor: this.isChecked
          ? theme.colors.accent + '4D'
          : theme.colors.gray + '4D',
      };
    },
    circleStyles() {
      const theme = this.$vuetify.theme.global.current;
      return {
        backgroundColor: this.isChecked
          ? theme.colors.accent
          : theme.colors.white,
      };
    },
  },
  methods: {
    toggle() {
      this.isChecked = !this.isChecked;
      this.$emit("update:modelValue", this.isChecked);
    },
  },
  watch: {
    modelValue(val) {
      this.isChecked = val;
    },
  },
};
</script>

<style lang="scss" scoped src="./styles.scss"></style>
