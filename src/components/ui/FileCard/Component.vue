<template>
  <div class="file-card" v-if="isVisible">
    <div class="file-icon">
      <v-dialog
        v-if="isImage && imageAvailable"
        v-model="isImageOverlayVisible"
      >
        <template #activator="{ props }">
          <div class="image-container" v-bind="props">
            <div class="hover-icon">
              <v-icon>mdi-magnify</v-icon>
            </div>
            <v-img
              :src="computedImageSrc"
              :lazy-src="computedImageSrc"
              alt="File Image"
              @error="onImageError"
              @click.stop="isImageOverlayVisible = true"
              cover
              :aspect-ratio="1"
              class="image-preview"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center"  justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </div>
        </template>
        <template #default>
          <v-img
            class="image-overlay"
            @click="isImageOverlayVisible = false"
            :src="computedImageSrc"
            alt="File Image"
            @error="onImageError"
          />
        </template>
      </v-dialog>
      <v-icon v-else-if="isImage && !imageAvailable">mdi-image-outline</v-icon>
      <v-icon v-else-if="isArchive">mdi-folder-zip-outline</v-icon>
      <!-- <v-icon v-else-if="isChatFiles">{{ iconFileFormat }}</v-icon> -->
      <v-icon v-else>mdi-file-document-outline</v-icon>
    </div>
    <div class="file-info">
      <div class="name-block">
        <div class="h3 file-name">{{ fileName }}</div>
        <!-- <div class="h3 file-name" v-if="isChatFiles">{{ fileShortName }}</div> -->
      </div>
      <div class="d-flex align-center">
        <div class="body">{{ formattedSize }}</div>
        <!-- <v-divider v-if="isChatFiles" vertical class="mx-2" />
        <div v-if="isChatFiles" class="body">{{ formattedDate }}</div> -->
      </div>
    </div>
    <div class="ellipsis-menu">
      <cEllipsisMenu
        v-if="!isServerFile"
        :is-delete-file="true"
        :onDelete="handleDelete"
      />
      <v-icon
        class="cursor-pointer"
        v-else
        @click.prevent="downloadFile(file)"
        @touchstart.prevent="downloadFile(file)"
        >mdi-download</v-icon
      >
    </div>
    <!-- Невидимый img для дополнительного использования -->
    <img
      v-if="isImage"
      :src="computedImageSrc"
      alt=""
      class="hidden-image"
      @error="onImageError"
    />
  </div>
</template>

<script>
export default {
  name: "c-FileCard",
  props: {
    file: {
      type: [File, Object],
      required: true,
    },
    // isChatFiles: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  data() {
    return {
      isVisible: true,
      imageSrc: null,
      imageAvailable: true,
      isImageOverlayVisible: false,
    };
  },
  computed: {
    // Определяем, является ли файл изображением
    isImage() {
      if (this.isServerFile) {
        return this.file.file_type && this.file.file_type.startsWith("image/");
      }
      return this.file.type && this.file.type.startsWith("image/");
    },

    isArchive() {
      const extension = this.fileName.split(".").pop().toLowerCase();
      return ["zip", "rar"].includes(extension);
    },

    // Форматируем размер файла
    formattedSize() {
      const size = this.isServerFile ? this.file.size : this.file.size;
      const units = ["B", "KB", "MB", "GB", "TB"];
      let unitIndex = 0;
      let sizeInUnits = size;
      while (sizeInUnits >= 1024 && unitIndex < units.length - 1) {
        sizeInUnits /= 1024;
        unitIndex++;
      }
      return sizeInUnits.toFixed(1) + " " + units[unitIndex];
    },

    formattedDate() {
      const date = new Date(
        this.isServerFile ? this.file.upload_date : this.file.last_modified
      );

      const day = date.getDate();
      const month = date.toLocaleString("ru", { month: "short" }).slice(0, 3);
      const year = date.getFullYear();

      return `${day} ${month}. ${year}`;
    },
    // Определяем, является ли файл объектом с сервера
    isServerFile() {
      return this.file && typeof this.file === "object" && this.file.file_path;
    },
    // Определяем имя файла
    fileName() {
      return this.isServerFile ? this.file.original_name : this.file.name;
    },
    fileShortName() {
      const fullName = this.isServerFile
        ? this.file.original_name
        : this.file.name;
      return fullName.split(".").slice(0, -1).join(".");
    },
    // Вычисляем источник изображения
    computedImageSrc() {
      if (this.isServerFile) {
        return process.env.VUE_APP_API_URL + this.file.file_path;
      } else {
        return this.imageSrc;
      }
    },
  },
  mounted() {
    if (this.isImage) {
      if (this.isServerFile) {
        // Для файлов с сервера используем file_path
        // Дополнительно можно добавить базовый URL, если нужно
        // Например: this.imageSrc = this.baseUrl + this.file.file_path
        // Но в computedImageSrc уже это сделано
      } else {
        // Для загруженных файлов создаём временный URL
        this.imageSrc = URL.createObjectURL(this.file);
      }
    }
  },
  beforeUnmount() {
    if (this.imageSrc) {
      URL.revokeObjectURL(this.imageSrc);
    }
  },
  methods: {
    async downloadFile(file) {
      try {
        const response = await this.$axios.get(file.file_path, {
          responseType: "blob",
        });

        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.download = file.original_name;
        document.body.appendChild(link);
        link.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        console.error("Download error:", error);

        if (error.isAxiosError) {
          console.error(
            "Axios error:",
            error.response?.status,
            error.config?.url
          );
        }
      }
    },
    onImageError() {
      this.imageAvailable = false;
    },
    handleDelete() {
      this.$emit("delete-file", this.file);
    },
  },
};
</script>

<style lang="scss" scoped src="./styles.scss"></style>
