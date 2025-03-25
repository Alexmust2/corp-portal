<template>
  <v-container v-if="article" fluid>
    <v-row class="flex-nowrap" width="100%">
      <v-col
        :cols="headers.length > 0 && !isMobile ? 8 : 12"
        class="block mr-5 pa-5"
      >
        <div class="header-wrapper">
          <div class="sticky-content">
            <div class="d-flex align-center">
              <v-icon
                icon="mdi-chevron-left"
                class="mr-2"
                @click="$router.push('/articles/')"
              ></v-icon>
              <span>{{ article.metadata.category }}</span>
            </div>
            <button
              v-if="(isAuthor || isEditCompanyArticles) && !isMobile"
              class="edit-btn"
              @click="this.$router.push(`/articles/edit/${this.article.id}`)"
            >
              Редактировать
            </button>
            <div class="tags-wrapper">
              <c-chip
                v-for="(tag, index) in article.metadata.tags"
                :key="index"
                class="tags"
                @click="goToArticlesWithTag(tag)"
                >{{ tag }}</c-chip
              >
            </div>
          </div>
        </div>
        <p :class="[!isMobile ? 'h1' : 'h2', isMobile ? 'mt-12' : '']">
          {{ article.title }}
        </p>
        <div class="time my-3" ref="timeBlock" v-if="isMobile">
          {{ new Date(article.created_at).getDate() }}
          {{ months[new Date(article.created_at).getMonth()] }} •
          {{ article.time_to_read }} мин
        </div>
        <div
          class="image-block"
          :style="{ backgroundImage: `url(${image})` }"
          ref="imageBlock"
        ></div>
        <c-mobile-dropdown
          v-if="isMobile && headers.length"
          ref="mobileDropdown"
          :headers="headers"
          :is-open="isOpen"
          :selected-header="selectedHeader"
          :is-scrolled-past-image="isScrolledPastImage"
          @toggle="toggleDropdown"
          @select="selectHeader"
          :class="{
            'sticky-dropdown': isScrolledPastImage,
            'below-image': !isScrolledPastImage,
          }"
        />
        <div v-if="!isMobile" class="d-flex justify-space-between mb-6">
          <div class="author-info d-flex align-center" v-if="hasCreator">
            <c-avatar
              v-bind="getAvatarProps(article.creator)"
              :size="36"
              class="rounded-circle mr-2"
            ></c-avatar>
            <span class="author-name"
              >{{ article.creator.first_name }}
              {{ article.creator.last_name }}</span
            >
            <span class="time ml-2">
              {{ new Date(article.created_at).getDate() }}
              {{ months[new Date(article.created_at).getMonth()] }} •
              {{ article.time_to_read }} мин</span
            >
          </div>
          <img src="/assets/no-author.png" alt="no-author" v-else />
          <div class="article-info d-flex align-center">
            <div class="view-counter-wrapper mr-5">
              <v-icon icon="mdi-eye" class="mr-1" size="small"></v-icon>
              <span class="views-count">{{ article.views }}</span>
            </div>
            <div
              class="likes-info-wrapper d-flex align-center cursor-pointer"
              :class="article.liked ? 'liked' : ''"
              @click="likeArticle"
            >
              <v-icon icon="mdi-heart" class="mr-1" size="small"></v-icon>
              <span v-if="!article.liked">
                {{ article.likes }}
              </span>
              <span class="likes-count" v-else>{{ article.likes }}</span>
            </div>
          </div>
        </div>
        <el-tiptap
          :content="article.content"
          v-model:content="article.content"
          :extensions="extensions"
          :enable-char-count="false"
          output="json"
          lang="ru"
          :class="!editMode ? 'editor' : 'editor-edit'"
          :readonly="!editMode"
        />
        <div
          v-if="isMobile"
          class="mobile-footer-wrap d-flex justify-space-between"
        >
          <div class="author-info d-flex align-center mb-4" v-if="hasCreator">
            <c-avatar
              v-bind="getAvatarProps(article.creator)"
              :size="36"
              class="rounded-circle mr-2"
            ></c-avatar>
            <span class="author-name"
              >{{ article.creator.first_name }}
              {{ article.creator.last_name }}</span
            >
          </div>
          <div class="article-info d-flex align-center mb-4">
            <v-icon icon="mdi-eye" color="secondary"></v-icon>
            <span class="views-count ml-2">{{ article.views }}</span>
            <div
              class="likes-info-wrapper d-flex align-center px-1 ml-4 cursor-pointer"
              :class="article.liked ? 'liked' : ''"
              @click="likeArticle"
            >
              <v-icon icon="mdi-heart"></v-icon>
              <span class="likes-count" v-if="article.liked">{{
                article.likes
              }}</span>
            </div>
          </div>
        </div>
      </v-col>
      <v-col
        cols="3"
        class="table-of-contents sticky-content pa-0"
        v-if="headers.length > 0 && !isMobile"
      >
        <v-list dense class="header-list block">
          <template v-for="(header, index) in headers" :key="index">
            <v-list-item @click="scrollToHeader(header.text)">
              <v-list-item-content>
                <v-list-item-title
                  class="header-item"
                  :class="header.active ? 'active_header' : ''"
                >
                  {{ header.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider
              v-if="index !== headers.length - 1 && !header.active"
            ></v-divider>
          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog
    class="img-dialog"
    v-model="imgDialog"
    @click="imgDialog = false"
    :max-width="isMobile ? '100%' : '80%'"
  >
    <template v-slot:default>
      <v-img :src="displayImageSrc" max-width="100%" max-height="80dvh" />
    </template>
  </v-dialog>
</template>

<script>
import { useUserStore } from "@/store/user.store";
import {
  Doc,
  Text,
  Paragraph,
  Bold,
  Underline,
  Italic,
  TextAlign,
  FontSize,
  Image,
  Strike,
  BulletList,
  OrderedList,
  Table,
  Link,
  Iframe,
  Blockquote,
  TaskList,
  Indent,
  LineHeight,
  HorizontalRule,
  HardBreak,
  Heading,
  History,
  FormatClear,
  Color,
  SelectAll,
  FontFamily,
  Gapcursor,
  Commands,
  getSuggestionItems,
  renderItems,
} from "element-tiptap-vue3-fixed";
import { useHeaderStore } from "@/store/header.store";
import { getAvatarProps } from "@/globalFunctions/avatarUtils";
import { cMobileDropdown } from "@/components/ui/MobileDropdown";
import articlesCover from '@/assets/articles-cover-hq.png';
import articlesCoverMobile from "@/assets/articles-cover-mobile-hq.png";
import { userHavePermission } from "@/globalFunctions/guardFunctions";
export default {
  name: "articles-single",
  data() {
    return {
      article: null,
      headers: [],
      processedContent: "",
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
      extensions: [
        Doc,
        Text,
        Paragraph,
        Bold,
        Underline.configure({ bubble: true }),
        Italic.configure({ bubble: true }),
        TextAlign.configure({ bubble: true }),
        FontSize,
        Heading,
        Image.configure({ draggable: true }),
        Strike,
        BulletList,
        OrderedList,
        Table.configure({ resizable: true }),
        Link.configure({ bubble: true }),
        Iframe,
        Blockquote,
        TaskList,
        Indent,
        LineHeight,
        HorizontalRule,
        HardBreak,
        History,
        FormatClear,
        Color,
        SelectAll,
        FontFamily,
        Gapcursor,
        Commands.configure({
          suggestion: {
            items: getSuggestionItems,
            render: renderItems,
          },
        }),
      ],
      editorKey: 0,
      imgDialog: false,
      displayImageSrc: null,
      articleImages: [],
      isOpen: false,
      selectedHeader: null,
      activeElement: null,
      isScrolledPastImage: false,
    };
  },
  components: {
    cMobileDropdown,
  },
  computed: {
    authUser() {
      return useUserStore().user;
    },
    hasCreator() {
      return this.article.creator !== null && this.article.creator !== undefined;
    },
    isAuthor() {
      return this.hasCreator && this.article.creator.id === useUserStore().user.id;
    },
    isMobile() {
      return this.$vuetify.display.width < 960;
    },
    isEditCompanyArticles() {
      return this.article.creator === null && userHavePermission(useUserStore().user, "edit_company_articles");
    },
    image() {
      if (this.article.image) {
        return `${process.env.VUE_APP_API_URL}${this.article.image.file_path}`;
      } else {
        return this.isMobile ? articlesCoverMobile : articlesCover;
      }
    },
 
    isCreator() {
      return (
        this.hasCreator &&
        this.authUser &&
        this.article &&
        this.authUser.id == this.article.creator.id
      );
    },
  },
  async created() {
    try {
      this.article = await this.$API.articleApi.getById(this.$route.params.id);
      this.getArticleHeaders();
    } catch (error) {
      console.error("Error fetching article:", error);
    }

    this.$nextTick(() => {
      this.articleImages = document.querySelectorAll(
        ".image-view__body__image"
      );
      this.articleImages.forEach((image) => {
        image.addEventListener("click", this.handleArticleImageClick);
      });
    });
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    window.addEventListener("scroll", this.checkScrollPosition);
    this.checkScrollPosition();
    this.adjustTableWidth();
  },
  updated() {
    this.adjustTableWidth();
  },

  beforeCreate() {
    useHeaderStore().visibility = false;
  },
  beforeUnmount() {
    useHeaderStore().visibility = true;
    useHeaderStore().button;
    document.removeEventListener("click", this.handleClickOutside);
    window.removeEventListener("scroll", this.checkScrollPosition);
    this.articleImages.forEach((image) => {
      image.removeEventListener("click", this.handleArticleImageClick, {
        passive: true,
      });
    });
  },
  watch: {
    article(newArticle) {
      if (newArticle) {
        this.$nextTick(() => {
          this.setupIntersectionObservers();
        });
      }
    },
    isOpen(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.scrollActiveIntoView();
        });
      }
    },
  },
  methods: {
    handleArticleImageClick(event) {
      this.displayImageSrc = event.target.src;
      this.imgDialog = true;
    },
    checkScrollPosition() {
      if (this.$refs.imageBlock) {
        const imageRect = this.$refs.imageBlock.getBoundingClientRect();
        this.isScrolledPastImage = imageRect.bottom <= 0;
      } else if (this.$refs.timeBlock) {
        const timeRect = this.$refs.timeBlock.getBoundingClientRect();
        this.isScrolledPastImage = timeRect.bottom <= 0;
      }
    },
    getAvatarProps,
    async likeArticle() {
      try {
        if (!this.article.liked) {
          await this.$API.articleApi.like(this.article.id);
          this.article.liked = true;
          this.article.likes++;
        } else {
          await this.$API.articleApi.like(this.article.id);
          this.article.liked = false;
          this.article.likes--;
        }
      } catch (error) {
        console.error("Error liking article:", error);
      }
    },
    updateContent(content) {
      console.log(content);
    },
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    adjustTableWidth() {
      this.$nextTick(() => {
        const tables = document.querySelectorAll(
          ".el-tiptap-editor__content table"
        );
        tables.forEach((table) => {
          let maxWidth = 0;
          const rows = table.querySelectorAll("tr");
          rows.forEach((row) => {
            const cells = row.querySelectorAll("th, td");
            let rowWidth = 0;
            cells.forEach((cell) => {
              rowWidth += cell.offsetWidth;
            });
            maxWidth = Math.max(maxWidth, rowWidth);
          });
          table.style.minWidth = `${maxWidth}px`;
        });
      });
    },
    selectHeader(header) {
      
      this.selectedHeader = header.text;
      this.isOpen = false;
      this.scrollToHeader(header.text);

    },
    handleClickOutside(event) {
      if (
        this.$refs.customSelect &&
        !this.$refs.customSelect.contains(event.target)
      ) {
        this.isOpen = false;
      }
    },
    getArticleHeaders() {
      const headers = [];

      const content = this.article.content.content;
      if (content) {
        content.forEach((node) => {
          if (node.type === "heading") {
            headers.push({
              text: node.content[0].text,
              id: node.attrs.id || null,
              active: false,
            });
          }
        });
      }
      this.headers = headers;
    },

    goToArticlesWithTag(tag) {
      this.$router.push({
        path: "/articles",
        query: { tag: tag },
      });
    },
    scrollToHeader(headerText) {
      const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      const offset = 150; // Adjust this value to your desired offset in pixels
      const container = this.isMobile ? document.documentElement : document.querySelector('.v-main');

      if (!container) {
        console.error("Scrolling container (.v-main) not found!");
        return;
      }

      for (const header of headers) {
        if (header.textContent.trim() === headerText.trim()) {
          const headerTop = header.getBoundingClientRect().top + container.scrollTop;
          console.log(headerTop);
          container.scrollTo({
            top: headerTop - offset,
            behavior: "smooth"
          });
          break;
        }
      }
    },

    handleHeaderSelection(selectedHeader) {
      if (selectedHeader) {
        let headerText = selectedHeader.text || selectedHeader;
        if (typeof headerText === "object" && headerText.text) {
          headerText = headerText.text;
        }
        if (typeof headerText === "string") {
          this.scrollToHeader(headerText);
        } else {
          console.log("Invalid headerText:", headerText);
        }
      } else {
        console.log("No header selected");
      }
    },
    setupIntersectionObservers() {
      const headers = document.querySelectorAll(
        ".editor h1, .editor h2, .editor h3, .editor h4, .editor h5, .editor h6"
      );

      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      };

      let visibleHeaders = new Set();

      const callback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleHeaders.add(entry.target);
          } else {
            visibleHeaders.delete(entry.target);
          }
        });

        const topmostHeader = [...visibleHeaders]
          .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];

        if (topmostHeader) {
          this.headers.forEach((header) => {
            header.active = header.text === topmostHeader.textContent;
          });

          this.$nextTick(() => {
            this.scrollActiveIntoView();
          });
        }
      };

      const observer = new IntersectionObserver(callback, options);
      headers.forEach((header) => observer.observe(header));
    },
    scrollActiveIntoView() {
      if (this.$refs.mobileDropdown) {
        this.$refs.mobileDropdown.scrollActiveIntoView();
      }
    },
  },
};
</script>

<style scoped lang="scss">
h2 > strong {
  @media (max-width: 768px) {
    font-size: 14px;
  }
}
:deep(.el-tiptap-editor__menu-bar) {
  display: none !important;
}

:deep(.mover-button) {
  display: none;
}

:deep(.el-tiptap-editor .el-tiptap-editor__content) {
  border: none;
  padding: 0;
}

:deep(.el-tiptap-editor .ProseMirror) {
  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
}
:deep(.el-tiptap-editor__content) {
  table {
    border-radius: 16px;
    font-family: Raleway !important;
    outline: 1px solid rgb(var(--v-theme-tertiary)) !important;
    outline-offset: -2px;

    th {
      position: relative;
      color: rgb(var(--v-theme-secondary));
      font-size: 20px;
      font-weight: 600;
      padding: calc(20px + 8px);
      border: none;
    }

    th::after,
    td::after {
      content: "";
      position: absolute;
      inset: 100% 0 0 0;
      width: 100%;
      height: 1px;
      background-color: rgb(var(--v-theme-secondary));
    }

    th:first-of-type::after,
    td:first-of-type::after {
      inset: 100% 0 0 20px;
      width: calc(100%);
    }

    th:last-of-type::after,
    td:last-of-type::after {
      inset: 100% 20px 0 0;
      width: calc(100% - 20px);
    }

    td {
      font-size: 18px;
      border: none;
      padding: 20px calc(20px + 8px);
      color: rgb(var(--v-theme-primary));
    }
    th:first-child,
    td:first-child {
      padding-left: 20px !important;
    }
    th:last-child,
    td:last-child {
      padding-right: 20px !important;
    }
    td::after {
      background-color: rgb(var(--v-theme-tertiary));
    }
  }
  @media (max-width: 768px) {
    overflow-x: auto;
    &::-webkit-scrollbar {
      height: 4px;
      width: 40px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(176, 176, 176, 1);
      border-radius: 4px;
      width: 40px;
    }

    &::-webkit-scrollbar-button {
      width: 20px;
      background-color: transparent;
    }
    table {
      min-width: 100%;
      width: max-content;
      max-width: none;
    }
    th {
      position: relative;
      color: rgb(var(--v-theme-secondary));
      font-size: 14px !important;
      color: #787878;
      font-weight: 600;
      line-height: 21px;
      font-family: "Open Sans";
      padding: 24.5px 8px !important;
      border: none;
    }
    td {
      font-size: 14px !important;
      border: none;
      padding: 24.5px 8px !important;
      color: #3e3e3e;
      line-height: 21px;
      width: 157px;
      font-family: "Open Sans";
      font-weight: 600;
      vertical-align: middle !important;
      color: rgb(var(--v-theme-primary));
      word-break: break-word;
      hyphens: auto;
    }
  }
}

.header-item {
  list-style-type: none;
  position: relative;
  padding: 8px;
  border-radius: 12px;
}

.sticky-content {
  max-height: auto;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    column-gap: 16px;
  }
}

.c-mobile-dropdown {
  transition: all 0.3s ease;
}

.sticky-dropdown {
  position: fixed;
  top: 55px;
  left: 20px;
  right: 20px;
  z-index: 1000;
  background-color: rgb(var(--v-theme-background));
  padding-top: 20px;
  padding-bottom: 20px;
  margin-top: 0px;
  width: auto;
}

.below-image {
  position: relative;
  margin-top: 20px;
}
.header-list {
  position: sticky;
  top: 0;
  border-radius: 12px;
}

.edit-btn {
  position: absolute;
  top: 20px;
  right: 10px;
  z-index: 1000;
  background: none;
  color: rgb(var(--v-theme-secondary));
  text-decoration: underline;
}

.active_header {
  background-color: rgb(var(--v-theme-accent));
  border: none;
  color: white;
  &__mobile {
    color: rgb(var(--v-theme-accent));
    text-decoration: underline;
  }
}

.tags .v-chip__underlay {
  background: rgb(var(--v-theme-background));
  border: 1px solid rgb(var(--v-theme-secondary));
  cursor: pointer;
}
.tags {
  cursor: pointer;
}

.tags:not(:first-child) {
  margin-left: 8px;
}

.liked {
  color: rgb(var(--v-theme-accent));
  outline: 1px solid rgb(var(--v-theme-tertiary));
  border-radius: 4px;
}

.image-block {
  height: 416px;
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  margin: 30px 0;
}

.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgb(var(--v-theme-background));
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding-top: 20px;
  padding-bottom: 20px;
  transition: height 0.3s ease;
  :deep(.v-icon) {
    width: 20px;
    height: 20px;
    font-size: 36px;
    color: #767676;
  }
}
@media (max-width: 768px) {
  .header-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    padding-left: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-right: 20px;
  }
  :deep(.v-icon) {
    width: 20px;
    height: 20px;
    font-size: 24px !important;
    color: #767676;
  }
  :deep(span) {
    font-size: 14px;
    line-height: 21px;
    font-weight: 400;
  }
}

.tags-wrapper {
  margin-top: 20px;
  display: flex;
  flex-wrap: nowrap;
  overflow: auto;
  -ms-overflow-style: none; // IE and Edge
  scrollbar-width: none;
  :deep(.c-chip) {
    padding: 6.5px 12px;
    height: 37px;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
  }
  @media (max-width: 768px) {
    margin: 0px;
    :deep(.c-chip) {
      padding: 4.5px 8px;
      height: 30px;
      font-size: 14px;
      line-height: 21px;
      font-weight: 400;
    }
  }
}
.likes-info-wrapper > * {
  transition: color 300ms;
}
.likes-info-wrapper {
  padding-inline: 8px;
}
.author-name {
  margin-right: 32px;
}
.view-counter-wrapper {
  color: rgb(var(--v-theme-secondary));
}

@media (max-width: 959px) {
  .header-list {
    background: none;
    color: rgb(var(--v-theme-secondary));
    list-style-type: none;
  }
  .image-block {
    height: 233px;
    background-size: cover;
    background-position: center;
    border-radius: 20px;
  }
  .author-name {
    font-size: 14px;
    color: rgb(var(--v-theme-primary));
  }
  .likes-info-wrapper {
    padding-inline: 4px;
  }
  .mobile-footer-wrap {
    gap: 9px;
    margin-top: 30px;
  }
}
</style>
