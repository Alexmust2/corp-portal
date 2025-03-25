<template>
  <div class="c-textarea-wrapper">
    <h2 v-if="label" class="h2 mb-3">{{ label }}</h2>
    <textarea
      class="c-textarea border_type-1"
      v-model="internalValue"
      :disabled="disabled || loading"
      :class="{ 'no-resize': disableResize || disabled }"
    >
    </textarea>
  </div>
</template>

<script>
export default {
  name: "c-textarea",
  props: {
    modelValue: String,
    disabled: Boolean,
    loading: Boolean,
    label: String,
    disableResize: Boolean,
  },
  data() {
    return {
      internalValue: this.modelValue,
    };
  },
  watch: {
    modelValue(val) {
      this.internalValue = val;
    },
    internalValue(val) {
      this.$emit("update:modelValue", val);
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped src="./styles.scss"></style>
