<template>
  <div
    :class="['c-chip', colorClass, { clickable: isClickable, selected: isSelected }]"
    @click="handleClick"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'c-chip',
  inject: ['chipGroup'],
  props: {
    color: {
      type: String,
      default: 'primary',
      validator: (value) => ['accent', 'red', 'secondary', 'primary'].includes(value),
    },
    value: {
      type: [String, Number],
      default: null,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      uniqueId: Math.random().toString(36).substr(2, 9),
    };
  },
  computed: {
    chipValue() {
    if (this.value !== null) {
      return this.value;
    } else if (this.$slots.default && this.$slots.default()?.[0]?.text) {
      return this.$slots.default()?.[0].text.trim();
    } else {
      return this.uniqueId;
    }
  },
    colorClass() {
      return this.isClickable
        ? `c-chip--${this.color}`
        : `c-chip--${this.color}-inactive`;
    },
    isClickable() {
      return this.clickable || (this.chipGroup && typeof this.chipGroup.selectChip === 'function');
    },
    isSelected() {
      if (!this.chipGroup) return false;
      const model = this.chipGroup.modelValue;
      return this.chipGroup.multiple
        ? model.includes(this.chipValue)
        : model === this.chipValue;
    },
  },
  methods: {
    handleClick(event) {
      if (this.chipGroup) {
        this.chipGroup.selectChip(this.chipValue);
      } else if (this.isClickable) {
        // this.$emit('click', event);
        console.log(event);
        
      }
    },
  },
};
</script>

<style lang="scss" src="./styles.scss" />
