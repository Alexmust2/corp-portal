<template>
  <div class="border_type-1">
    <div class="faq-title" @click="toggle" :style="isOpen ? 'border-bottom: 1px solid rgb(var(--v-theme-tertiary))' : ''">
      <span>{{ title }}</span>
      <v-icon class="faq-icon">
        {{ isOpen ? 'mdi-minus-circle' : 'mdi-plus-circle' }}
      </v-icon>
    </div>
    <div ref="content" class="faq-content">
      <div class="faq-text" v-if="isOpen">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import autoAnimate from '@formkit/auto-animate';

export default {
  name: 'c-FAQ',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  mounted() {
    if (this.$refs.content) {
      autoAnimate(this.$refs.content);
    }
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>


<style lang="scss" scoped src="./styles.scss"></style>
