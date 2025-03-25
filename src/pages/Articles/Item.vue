<template>
  <v-col cols="12" sm="12" md="6" lg="4" xl="3">
    <div @click="openArticle" class="article-card article">
      <c-chip class="category absolute" v-if="!isMobile">
        {{ article.metadata.category }}
      </c-chip>

      <div class="article-image" v-if="!isMobile">
        <v-img :src="image" cover width="100%" class="img" />
      </div>

      <div class="article-actions">
        <div class="author-info" v-if="hasCreator">
          <c-chip v-if="isMobile" class="category mr-2">
            {{ article.metadata.category }}
          </c-chip>
          <c-avatar
            v-if="article.creator"
            v-bind="getAvatarProps(article.creator)"
            size="32"
            class="rounded-circle mr-2"
          ></c-avatar>
          <span class="author-name" v-if="article.creator">
            {{
              xsAndDown
                ? article.creator.first_name[0] + "."
                : article.creator.first_name
            }}
            {{ article.creator.last_name }}
          </span>
        </div>
        <img src="/assets/no-author.png" alt="no-author" v-else />
        <c-EllipsisMenu
          class="ellipsis-menu"
          @delete="handleDelete"
          @edit="handleEdit"
          v-if="isAuthor || isEditCompanyArticles"
          :is-delete-article="true"
        />
      </div>
      <div class="article-body">
        <div class="article-content">
          <h3 :class="{ 'title h3 mb-3': !isMobile, 'title mb-2': isMobile }">
            {{ article.title }}
          </h3>
          <p class="summary">{{ article.summary }}</p>
          <div class="card-meta sm flex-wrap">
            <span class="date">
              {{ formattedDate }} • {{ article.time_to_read || 1 }} мин
            </span>
            <div class="d-flex align-center ga-2">
              <span class="views d-flex align-center article-card__views">
                <v-icon size="small" class="more-options" color="secondary"
                  >mdi-heart</v-icon
                >
                <span class="views-count ml-1">{{ article.likes || 0 }}</span>
              </span>
              <span class="views d-flex align-center article-card__views">
                <v-icon size="small" class="more-options" color="secondary"
                  >mdi-eye</v-icon
                >
                <span class="views-count ml-1">{{ article.views || 0 }}</span>
              </span>
            </div>
          </div>
        </div>

        <div class="article-image--mobile" v-if="isMobile && image">
          <div :style="{ backgroundImage: `url(${image})` }" class="img"></div>
        </div>
      </div>
    </div>
  </v-col>
</template>

<script>
import { getAvatarProps } from "@/globalFunctions/avatarUtils";
import { ROUTE_NAMES } from "@/router/routeNames";
import { useUserStore } from "@/store/user.store";
import articlesCover from "@/assets/articles-cover.png";
import { userHavePermission } from "@/globalFunctions/guardFunctions";
import articlesCoverMobile from "@/assets/articles-cover-mobile.png";

export default {
  name: "ItemWidget",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      months: [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
      ],
    };
  },
  computed: {
    hasCreator() {
      return (
        this.article.creator !== null && this.article.creator !== undefined
      );
    },
    isEditCompanyArticles() {
      return (
        this.article.creator === null &&
        userHavePermission(useUserStore().user, "edit_company_articles")
      );
    },
    isAuthor() {
      return (
        this.hasCreator && this.article.creator.id === useUserStore().user.id
      );
    },

    image() {
      if (this.article.image) {
        return `${process.env.VUE_APP_API_URL}${this.article.image.file_path}`;
      } else {
        return this.isMobile ? articlesCoverMobile : articlesCover;
      }
    },
    userAvatar() {
      return this.article.creator.avatar
        ? `${process.env.VUE_APP_API_URL}${this.article.creator.avatar.file_path}`
        : "";
    },
    isMobile() {
      return this.$vuetify.display.width < 960;
    },
    xsAndDown() {
      return this.$vuetify.display.width < 450;
    },
    formattedDate() {
      const date = new Date(this.article.created_at);
      return `${date.getDate()} ${this.months[date.getMonth()]}`;
    },
  },
  methods: {
    getAvatarProps,
    openArticle() {
      this.$router.push({
        name: ROUTE_NAMES.ARTICLES_SINGLE,
        params: { id: this.article.id },
      });
    },
    handleDelete() {
      this.$emit("article-deleted", this.article.id);
    },
    handleEdit() {
      this.$router.push(`/articles/edit/${this.article.id}`);
    },
  },
};
</script>

<style lang="scss" src="./Item.scss" scoped></style>
