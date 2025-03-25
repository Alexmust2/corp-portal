<template>
  <div class="block articles-page">
    <div class="filters_container d-flex justify-space-between">
      <SearchInput
        class="input-search"
        v-model="searchQuery"
        placeholder="Поиск"
        :height="isMobile ? 35 : '' "
      ></SearchInput>
      <div v-if="!isMobile">
        <div class="article-sort-wrap d-flex ga-5">
          <c-select
            v-model="selectedSortOption"
            class="sort-select"
            :items="sortOptions"
            hide-details
            width="205"
            placeholder="Сортировать по"
          ></c-select>
          <c-select
            v-model="selectedCategory"
            :items="['Все категории', ...categories]"
            hide-details
            width="205"
            placeholder="Категория"
          ></c-select>
          <c-select
            v-model="selectedTag"
            class="tags-select"
            :items="tags"
            width="205"
            placeholder="Теги"
            multiple
            hide-details
          ></c-select>

          <v-icon v-show="!isMobile && isFiltered" color="gray" size="24"
          class=" clear-filter-icon" @click="clearFilters">mdi-close</v-icon>
        </div>
      </div>
      <div class="select-block d-flex align-center" v-else>
        <v-icon @click="openForm">mdi-tune</v-icon>
        <c-slide-panel v-model="isFormOpen" title="Сортировка">
          <label class="h2">Сортировать по</label>
          <c-select
            v-model="selectedSortOption"
            :items="sortOptions"
            hide-details
          ></c-select>
          <label class="h2">Категория</label>
          <c-select
            v-model="selectedCategory"
            :items="['Без сортировки', ...categories]"
            hide-details
          ></c-select>
          <label class="h2">Тег</label>
          <c-select
            v-model="selectedTag"
            :items="tags"
            multiple
            hide-details
          ></c-select>
          <template #footer>
            <div class="d-flex justify-space-between w-100">
              <div class="w-50">
                <c-btn
                  color="gray"
                  block
                  style="color: rgb(var(--v-theme-white))"
                  @click="closeForm"
                  >Сбросить</c-btn
                >
              </div>
              <div class="w-50 ml-3">
                <c-btn block @click="filterArticles">Применить</c-btn>
              </div>
            </div>
          </template>
        </c-slide-panel>
      </div>
    </div>
    <v-divider v-if="!isMobile" class="mb-4"></v-divider>
    <loader-wrapper :loading="loading" :is-mobile="IsMobile">
      <div class="articles-table">
        <div class="results-count">
          {{ filteredArticles.length }} результат{{ getHintSuffix }} по запросу
        </div>

        <v-row class="mr-1 mb-0">
          <ListWidget
            :articles="filteredArticles"
            @article-deleted="removeArticleFromList"
            @article-selected="onSelectedArticle"
          />
        </v-row></div
    ></loader-wrapper>
  </div>
</template>

<script>
import SearchInput from "@/components/widgets/SearchInput";
import ListWidget from "./List.vue";
import { useHeaderStore } from "@/store/header.store";
import { ROUTE_NAMES } from "@/router/routeNames";
import LoaderWrapper from "@/components/ui/LoaderWrapper/Component.vue";
import { onboardingService } from "@/globalFunctions/onBoarding";
export default {
  name: "ArticlesPage",
  components: {
    ListWidget,
    SearchInput,
    LoaderWrapper,
  },
  data() {
    return {
      searchQuery: "",
      selectedCategory: "Все категории",
      selectedTag: [],
      selectedSortOption: null,
      sortOptions: ["Новые", "Старые", "Просмотры", "Лайки"],
      articles: [],
      isFormOpen: false,
      loading: false,
      resultHintSuffix: "",
    };
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    getHintSuffix() {
      const lastDigit = this.articles.length % 10;
      const lastTwoDigits = this.articles.length % 100;

      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return "ов";
      }

      return lastDigit === 1
        ? ""
        : lastDigit >= 2 && lastDigit <= 4
        ? "а"
        : "ов";
    },
    filteredArticles() {
      let articles = this.articles;

      // Enhanced search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        articles = articles.filter((article) => {
          const titleMatch = article.title.toLowerCase().includes(query);
          const categoryMatch =
            article.metadata.category &&
            article.metadata.category.toLowerCase().includes(query);
          const tagsMatch =
            article.metadata.tags &&
            article.metadata.tags.some((tag) =>
              tag.toLowerCase().includes(query)
            );
          const creatorMatch =
            article.creator &&
            article.creator.full_name &&
            article.creator.full_name.toLowerCase().includes(query);
          return titleMatch || categoryMatch || tagsMatch || creatorMatch;
        });
      }

      // Filter by category
      if (this.selectedCategory && this.selectedCategory !== "Все категории") {
        articles = articles.filter(
          (article) => article.metadata.category === this.selectedCategory
        );
      }

      // Filter by selected tags (multiple)
      if (this.selectedTag && this.selectedTag.length > 0) {
        articles = articles.filter((article) =>
          this.selectedTag.some((tag) => article.metadata.tags.includes(tag))
        );
      }

      // Sorting logic
      articles = articles.slice(); // Create a copy to avoid mutating the original array

      if (this.selectedSortOption === "Новые") {
        articles.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      } else if (this.selectedSortOption === "Старые") {
        articles.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      } else if (this.selectedSortOption === "Просмотры") {
        articles.sort((a, b) => b.views - a.views);
      } else if (this.selectedSortOption === "Лайки") {
        articles.sort((a, b) => b.likes - a.likes);
      }

      return articles;
    },
    categories() {
      return [
        ...new Set(this.articles.map((article) => article.metadata.category)),
      ];
    },
    tags() {
      let articles = this.articles;
      if (this.selectedCategory && this.selectedCategory !== "Все категории") {
        articles = articles.filter(
          (article) => article.metadata.category === this.selectedCategory
        );
      }
      return [...new Set(articles.flatMap((article) => article.metadata.tags))];
    },
    headerStore() {
      return useHeaderStore();
    },
    isFiltered() {
      return (
        this.searchQuery.length > 0 ||
        this.selectedCategory !== "Все категории" ||
        this.selectedTag.length > 0 ||
        this.selectedSortOption
      )
    }
  },

  watch: {
    selectedCategory(newCategory, oldCategory) {
      if (newCategory !== oldCategory) {
        this.selectedTag = [];
      }
    },
  },
  mounted() {
    if (onboardingService.shouldContinueOnboarding('articles')) {
      this.continueOnboarding();
    }
  },

  beforeUnmount() {
    this.headerStore.setHeaderButton();
  },
  methods: {
    parseQueryParams() {
      const queryParams = new URLSearchParams(this.$route.query);

      const tags = queryParams.get("tag");
      if (tags) {
        this.selectedTag = tags.split(",");
      }

      const category = queryParams.get("category");
      if (category) {
        this.selectedCategory = category;
      }

      const sortOption = queryParams.get("sort");
      if (sortOption && this.sortOptions.includes(sortOption)) {
        this.selectedSortOption = sortOption;
      }
    },

    continueOnboarding() {
      onboardingService.startPageOnboarding("articles");
      onboardingService.setRouter(this.$router);
    },

    async removeArticleFromList(articleId) {
      try {
        await this.$API.articleApi.delete(articleId);
        this.articles = this.articles.filter(
          (article) => article.id !== articleId
        );
      } catch (error) {
        console.error("Ошибка при удалении статьи:", error);
      }
    },
    closeForm() {
      this.selectedCategory = "Все категории";
      this.selectedTag = [];
      this.isFormOpen = false;
      this.searchQuery = '';
      this.selectedSortOption = null
    },
    filterArticles() {
      this.isFormOpen = false;
    },
    openForm() {
      this.isFormOpen = true;
    },
    onSelectedArticle(selected, type) {
      if (type === "tags") this.selectedTag = [selected];
      else if (type === "category") this.selectedCategory = selected;
    },
    clearFilters() {
      this.closeForm();
  }
  },
  async created() {
    this.headerStore.setHeaderButton(
      "Создать статью",
      () => this.$router.push({ name: ROUTE_NAMES.ARTICLES_CREATE }),
      !this.isMobile
    );
    this.loading = true;
    // Получаем статьи
    try {
      this.articles = await this.$API.articleApi.getAll();
    } catch (error) {
      console.error("Ошибка при получении статей:", error);
    } finally {
      this.loading = false;
    }

    // Устанавливаем параметры из URL
    this.parseQueryParams();
  },

};
</script>

<style lang="scss" scoped>
.results-count {
  font-size: 14px;
  margin-bottom: 16px;
  color: rgb(var(--v-theme-gray));
}
.article-sort-wrap {
  width: 100%;
  align-items: center;
}

.articles-page {
  min-height: 100%;
  position: relative;
  padding: 0px 4px 0px 20px;

  :deep(.sort-select) {
    input::placeholder {
      opacity: 1;
    }
  }
  :deep(.tags-select) {
    .v-field__input {
      display: flex;
      gap: 0;
      flex-wrap: nowrap;
      align-items: center;
      counter-reset: item -1;
      .v-select__selection-comma {
        display: inline-block;
        width: 0px;
        height: 0px;
        overflow: hidden;
        postition: absolute;
      }
      // if number of tags > 1
      .v-select__selection {
        counter-increment: item;
        text-overflow: ellipsis;
        position: relative;
        margin-right: 0px;
        max-width: 76%;
        &::after {
          animation: slide-up 0.3s ease-in-out;
        }
        // hide all but first one
        &:nth-of-type(n + 2) {
          width: 0;
          opacity: 0;
        }
        // and the last one
        &:last-of-type {
          opacity: 1;
          posision: static;
          // which has increment counter to show total amount of tags
          &::after {
            content: "+" counter(item);
            display: inline-block;
            margin-left: 12px;
            opacity: 0.5;
          }
        }
        &:first-of-type::after {
          content: "";
        }
      }
    }
    input::placeholder {
      opacity: 1;
    }
  }
  @media screen and (min-width: 960px) {
    padding: 0px 20px 20px 20px;
  }
}
.filters_container {
  display: flex;
  align-items: center;
  gap: 1rem;
  @media screen and (min-width: 960px) {
    padding: 12px 0px 12px 0px;
    gap: 16px;
    overflow-x: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  @media screen and (max-width: 959px) {
    padding: 5px 11px 5px 8px;
    margin-bottom: 16px;
    margin-right: 18px;
    border-radius: 12px;
  }
}
.articles-table {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100%;
  height: calc(100vh - 170px);
  @media screen and (min-width: 960px) {
    max-height: calc(
      100vh - var(--v-layout-py) * 2 - var(--v-header-h) - 173px
    );
  }
}
.input-search {
  max-width: 280px;
  min-width: 200px;
  @media screen and (max-width: 959px) {
    max-width: none;
    min-width: none;
    width: calc(100vw - 48px);
    :deep(.v-input__control) {
      .v-field__overlay {
        max-width: 100px;
      }
      height: 35px;

      input {
        height: 35px;
      }
    }
  }
}

@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(50%);
  }
  100% {
    opacity: 0.5;
    transform: translateY(0);
  }
}
</style>