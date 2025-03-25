<template>
  <div class="editor-container block">
    <v-icon
      class="position-absolute t-0 l-0"
      v-if="!isMobile"
      @click="$router.go(-1)"
      >mdi-chevron-left</v-icon
    >
    <el-tiptap
      :content="newArticle.content"
      :extensions="extensions"
      ref="editor"
      :enable-char-count="true"
      output="json"
      lang="ru"
      class="editor"
      placeholder="Введите текст сюда..."
      @onUpdate="onEditorUpdate"
      editorMenubarClass="editor-menubar"
      :key="editorKey"
      @onCreate="onCreate"
      v-if="!isMobile"
    >
    </el-tiptap>
    <c-form headerPadding="0" :border="false && !isMobile" :key="formKey">
      <template #header>
        <div
          :class="isMobile ? 'd-flex align-center w-100' : ''"
          class="header-input"
          :style="{ height: `${menuBarHeight + 2}px` }"
        >
          <v-icon v-if="isMobile" @click="$router.go(-1)"
            >mdi-chevron-left</v-icon
          >
          <div class="h1 header-text">Параметры статьи</div>
        </div>
      </template>
      <div>
        <c-input
          v-model="newArticle.title"
          label="Название статьи"
          placeholder="Название"
          :key="titleKey"
          maxlength="254"
        />
      </div>
      <div>
        <div class="h2 label">Выбрать категорию</div>
        <c-select
          :items="categories"
          :outlined="true"
          class="no-border"
          v-model="newArticle.category"
          item-title="name"
          item-value="name"
          placeholder="Категория"
          :create="true"
          is-combobox
        />
      </div>
      <div>
        <div class="h2 label">Выбрать тег</div>
        <c-select
          :items="tags"
          :outlined="true"
          class="no-border"
          v-model="newArticle.tags"
          item-title="name"
          item-value="name"
          placeholder="Тег"
          is-combobox
          :create="true"
          multiple
        />
      </div>
      <div>
        <div class="h2 label">Автор статьи</div>
        <c-select
          :items="authors"
          :outlined="true"
          class="no-border"
          v-model="newArticle.creator_id"
          item-title="name"
          item-value="value"
        />
      </div>
      <div class="file-upload">
        <div class="form-item mb-6">
          <h2 class="h2 mb-3">Обложка статьи</h2>
          <c-FileInput
            :extensions="['jpeg', 'jpg', 'png']"
            class="file-input-centered"
            :max-files="1"
            v-model="newArticle.file"
          />
        </div>
      </div>
      <template #footer>
        <div class="d-flex ga-3">
          <c-btn @click="$router.go(-1)" class="flex-1-1-0 btn-cancel">
            Отменить
          </c-btn>
          <c-btn
            color="accent"
            @click="isEditPage ? updateArticle() : submitArticle()"
            :disabled="
              !newArticle.title ||
              !newArticle.category ||
              !newArticle.tags.length ||
              !newArticle.content
            "
            class="flex-1-1-0"
          >
            {{ isEditPage ? "Обновить" : "Готово" }}
          </c-btn>
        </div>
      </template>
    </c-form>
  </div>
</template>

<script>
import { useHeaderStore } from "@/store/header.store";
import {
  Doc,
  Text,
  Paragraph,
  Heading,
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
import { useUserStore } from "@/store/user.store";
import { ROUTE_NAMES } from "@/router/routeNames";
import { onboardingService } from "@/globalFunctions/onBoarding";

export default {
  name: "article-create-page",
  data() {
    return {
      categories: [],
      tags: [],
      authors: [
        {
          id: 1,
          name: "От лица компании",
          value: null,
          selected: true,
        },
        {
          id: 2,
          name: "От моего лица",
          value: useUserStore().user.id,
          selected: true,
        },
      ],
      editorKey: 0,
      extensions: this.getExtensions(),
      newArticle: this.getNewArticle(),
      titleKey: 0,
      isEditPage: false,
      menuBarHeight: 0,
      formKey: 0,
      editor: null,
      isCompany: false,
    };
  },
  computed: {
    headerStore() {
      return useHeaderStore();
    },
    charactersCount() {
      return this.$refs.editor?.characters;
    },
    isMobile() {
      return this.$vuetify.display.width < 960;
    },
    messageBoxTitle() {
      return document.querySelector(".el-message-box__title");
    },
  },
  watch: {
    "$vuetify.display.width": "checkMenuBarHeight",
    "$vuetify.display.height": "checkMenuBarHeight",
    messageBoxTitle() {
      this.messageBoxTitle.classList.add("h2");
    },
    "newArticle.creator_id": {
      immediate: true,
      handler(newValue) {
        this.isCompany = newValue == null;
      },
    },
  },
  beforeCreate() {
    useHeaderStore().visibility = false;
  },
  beforeUnmount() {
    this.headerStore.visibility = true;
    this.headerStore.button;
  },
  async mounted() {
    await this.fetchCategoriesAndTags();
    this.setupEditorHeader();
    await this.loadArticleData();
    this.editor = this.$refs.editor;
    this.menuBarHeight = this.getMenuBarHeight();
  },
  methods: {
    checkMenuBarHeight() {
      this.menuBarHeight = this.getMenuBarHeight();
    },
    onEditorUpdate(val) {
      this.content = val;
      this.newArticle.content = val;
    },
    getMenuBarHeight() {
      const menubarByClass = document.querySelector(".editor-menubar");

      return menubarByClass ? menubarByClass.clientHeight - 30 : 0;
    },
    onImageChange(file) {
      this.newArticle.image_url = file;
    },
    async urlToFile(url, fileName) {
      const response = await fetch(url);
      const data = await response.blob();
      return new File([data], fileName, { type: data.type });
    },
    continueOnboarding() {
      onboardingService.startPageOnboarding("articles_create");
      onboardingService.setRouter(this.$router);
    },

    submitArticle() {
      const formData = this.createFormData();
      const headers = this.getHeaders();
      this.$API.articleApi
        .create(formData, { headers })
        .then((response) => {
          console.log("Статья успешно отправлена:", response);
          this.$router.push({ name: ROUTE_NAMES.ARTICLES });
        })
        .catch((error) => {
          console.error("Ошибка при отправке статьи:", error);
        });
    },
    updateArticle() {
      const formData = this.createFormData();
      const headers = this.getHeaders();
      this.$API.articleApi
        .update(this.$route.params.id, formData, { headers })
        .then(() => {
          this.$router.push({ name: ROUTE_NAMES.ARTICLES });
        })
        .catch((error) => {
          console.error("Ошибка при обновлении статьи:", error);
        });
    },
    updateFieldValue(val, field) {
      if (Array.isArray(val)) {
        this.newArticle[field.model] = val.map((item) =>
          typeof item === "object" ? item[field.value] : item
        );
      } else {
        this.newArticle[field.model] =
          typeof val === "object" ? val[field.value] : val;
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.$el.querySelector('input[type="file"]').click();
    },
    getExtensions() {
      return [
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
      ];
    },
    getNewArticle() {
      return {
        title: "",
        category: null,
        creator_id: useUserStore().user.id,
        tags: [],
        content: ``,
        image_url: null,
      };
    },
    async fetchCategoriesAndTags() {
      try {
        const res = await this.$API.articleApi.getCategoriesAndTags();
        this.categories = res.categories;
        this.tags = res.tags;
      } catch (error) {
        console.error("Ошибка при получении категорий и тегов:", error);
      }
    },
    setupEditorHeader() {
      let editorHeader = document.querySelector(".el-tiptap-editor__menu-bar");
      if (editorHeader) {
        editorHeader.style.display = "flex";
      }
    },
    async loadArticleData() {
      const articleId = this.$route.params.id;
      if (articleId) {
        this.isEditPage = true;
        try {
          const articleData = await this.$API.articleApi.getById(articleId);

          if (
            !articleData.creator ||
            articleData.creator.id === useUserStore().user.id
          ) {
            this.newArticle = {
              title: articleData.title,
              creator_id: articleData.creator ? articleData.creator.id : null,
              content: articleData.content,
              image_url:
                articleData.image && articleData.image.file_path
                  ? process.env.VUE_APP_API_URL + articleData.image.file_path
                  : "",
              category: null,
              tags: [],
            };

            if (articleData.image && articleData.image.file_path) {
              const file = await this.urlToFile(
                this.newArticle.image_url,
                "article-cover.jpg"
              );
              this.newArticle.file = [file];
            } else {
              this.newArticle.file = [];
            }

            if (articleData.metadata) {
              if (articleData.metadata.category) {
                this.newArticle.category =
                  typeof articleData.metadata.category === "string"
                    ? articleData.metadata.category
                    : articleData.metadata.category.name;
              }

              if (articleData.metadata.tags) {
                this.newArticle.tags = articleData.metadata.tags.map((tag) =>
                  typeof tag === "object" ? tag.name : tag
                );
              }
            }

            this.editorKey++;
            this.titleKey++;
          } else {
            this.$router.push({ name: ROUTE_NAMES.ARTICLES });
          }
        } catch (error) {
          this.$router.push({ name: ROUTE_NAMES.ARTICLES });
          console.error("Ошибка при получении данных статьи:", error);
        }
      }
    },

    createFormData() {
      console.log(this.newArticle, "this.newArticle.title");
      const formData = new FormData();
      formData.append("title", this.newArticle.title);
      const charCount = Number(this.editor.characters) || 0;
      formData.append("charachterCount", charCount);
      formData.append(
        "category",
        this.newArticle.category.name
          ? this.newArticle.category.name
          : this.newArticle.category
      );
      formData.append("from_company", this.isCompany);
      formData.append("content", JSON.stringify(this.newArticle.content));
      formData.append(
        "tags",
        JSON.stringify(
          this.newArticle.tags.map((tag) =>
            typeof tag === "object" ? tag.id : tag
          )
        )
      );

      if (this.newArticle.file) {
        formData.append("file", this.newArticle.file);
      }
      return formData;
    },
    getHeaders() {
      return {
        "Content-Type": "multipart/form-data",
        file: this.newArticle.file ? this.newArticle.file : "",
      };
    },
  },
  setup() {
    const onCreate = ({ editor }) => {
      editor.commands.focus();
    };
    return { onCreate };
  },
};
</script>

<style lang="scss" src="./styles.scss"></style>
