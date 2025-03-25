<template>
  <div class="c-date-picker-wrapper" :style="wrapperStyles">
    <h2 v-if="label" class="h2 mb-3">{{ label }}</h2>
    <v-date-input
      v-model="internalValue"
      v-bind="$attrs"
      :class="[
        'c-date-picker',
        { 'w-100': block, success: isFocused || success },
      ]"
      :prepend-icon="null"
      :hide-actions="true"
      hide-details="auto"
      :min="minDate"
      :max="maxDate"
      @focus="onFocus"
      @blur="onBlur"
    />
  </div>
</template>

<script>
export default {
  name: "c-date-input",
  inheritAttrs: false,
  props: {
    modelValue: Date,
    block: Boolean,
    success: Boolean,
    label: String,
    width: [String, Number],
    downwardsOnly: {
      type: Boolean,
      default: false,
    },
    upwardsOnly: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      localValue: null,
      isFocused: false,
    };
  },
  computed: {
    internalValue: {
      get() {
        return this.modelValue ?? this.localValue;
      },
      set(val) {
        if (this.modelValue !== undefined) {
          this.$emit("update:modelValue", val);
        } else {
          this.localValue = val;
        }
      },
    },
    minDate() {
      return this.upwardsOnly ? new Date().toISOString().split("T")[0] : null;
    },
    maxDate() {
      return this.downwardsOnly ? new Date().toISOString().split("T")[0] : null;
    },
  },
  methods: {
    onFocus() {
      this.isFocused = true;
    },
    onBlur() {
      this.isFocused = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.c-date-picker-wrapper {
  flex: 1 1 auto;
}
</style>
