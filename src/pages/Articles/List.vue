<template>
  <ItemWidget
    v-for="article in articles"
    :key="article.id"
    :article="article"
    @article-deleted="onArticleDeleted"
    @article-selected="onArticleSelected"
  />
</template>

<script>
import ItemWidget from "./Item.vue";

export default {
  name: "ListWidget",
  components: {
    ItemWidget,
  },
  props: {
    articles: Array,
  },
  methods: {
    onArticleDeleted(articleId) {
      this.$emit("article-deleted", articleId);
    },
    onArticleSelected(selected, type) {
      this.$emit("article-selected", selected, type);
    },
  },
};
</script>
