<template>
  <div class="c-chip-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "c-chip-group",
  props: {
    modelValue: {
      type: [Array, String, Number],
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  provide() {
    return {
      chipGroup: this,
    };
  },
  methods: {
    selectChip(value) {
      let newValue;
      if (this.multiple) {
        newValue = Array.isArray(this.modelValue) ? [...this.modelValue] : [];
        const index = newValue.indexOf(value);
        if (index === -1) {
          newValue.push(value);
        } else {
          newValue.splice(index, 1);
        }
      } else {
        newValue = value;
      }
      this.$emit("update:modelValue", newValue);
    },
    addChip(value) {
      if (Array.isArray(this.modelValue) && !this.modelValue.includes(value)) {
        this.$emit("update:modelValue", [...this.modelValue, value]);
      }
    },
  },
  mounted() {
    if (this.multiple && this.$slots.default) {
      const children = this.$slots.default();
      children.forEach((child) => {
        if (child.type?.name === "c-chip" && child.props?.value) {
          this.addChip(child.props.value);
        }
      });
    }
  },
};
</script>

<style lang="scss" src="./styles.scss"></style>