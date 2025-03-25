<template>
  <aside class="component-sidebar">
    <a
      v-for="(component, key) in componentDocumentation"
      :key="key"
      :href="'#' + slugify(component.title)"
      :class="{ active: activeComponent === slugify(component.title) }"
    >
      {{ component.title }}
    </a>
  </aside>
</template>

<script>
export default {
  name: "ComponentSidebar",
  props: {
    componentDocumentation: Array,
    activeComponent: String,
  },
  methods: {
    slugify(text) {
      return text.toLowerCase().replace(/\s+/g, "-");
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  color: inherit;
  text-decoration: none;
}
.component-sidebar {
  position: sticky;
  top: 0;
  bottom: 0;
  left: 20px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  a {
    opacity: 0.8;
    transition: opacity 0.3s, border-right 0.3s;
    border-right: 2px solid transparent;
  }
  a:hover,
  a.active {
    opacity: 1;
    border-color: rgb(var(--v-theme-accent));
  }
}
</style>
