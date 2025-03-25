<template>
  <div class="file-input-wrapper">
    <h2 v-if="label" class="h2 mb3">{{ label }}</h2>
    <div
      v-if="!isMaxFilesReached"
      class="file-input-placeholder"
      @click="triggerFileInput"
      :class="{ 'mb-4': !isMaxFilesReached && files.length > 0 }"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="acceptTypes"
        multiple
        @change="onFileChange"
        style="display: none"
      />
      <div class="placeholder-data">
        <v-icon>mdi-image</v-icon>
        <p>
          Загрузить
          <v-tooltip :text="uploadPlaceholderText">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="x-small"
                >mdi-help-circle-outline</v-icon
              >
            </template>
          </v-tooltip>
        </p>
      </div>
    </div>
    <div class="file-cards" ref="fileCardsContainer">
      <c-FileCard
        v-for="file in files"
        :key="generateFileKey(file)"
        :file="file"
        @delete-file="deleteFile"
      />
    </div>
  </div>
</template>

<script>
import autoAnimate from "@formkit/auto-animate";

export default {
  name: "c-FileInput",
  
  props: {
    modelValue: {
      type: [Array, Object],
      default: () => [],
    },
    extensions: {
      type: Array,
      default: () => [],
    },
    maxSize: {
      type: Number,
      default: 50, // Максимальный размер в МБ
    },
    maxFiles: {
      type: Number,
      default: 100,
    },
    label: String,
  },
  computed: {
    files: {
      get() {
        return Array.isArray(this.modelValue) ? this.modelValue : [this.modelValue];
      },
      set(value) {
        const newValue = value.length === 1 ? value[0] : value;
        this.$emit("update:modelValue", newValue);
      },
    },
    acceptTypes() {
      return this.extensions.length > 0
        ? this.extensions.map((ext) => "." + ext).join(",")
        : "";
    },
    isMaxFilesReached() {
      return this.files.length >= this.maxFiles;
    },
    uploadPlaceholderText() {
      const extensionsText =
        this.extensions.length > 0 ? this.extensions.join(", ") : "любой";
      return `Загрузить до ${this.maxFiles} файлов по ${this.maxSize} МБ. Форматы: ${extensionsText}`;
    },
  },
  mounted() {
    if (this.$refs.fileCardsContainer) {
      autoAnimate(this.$refs.fileCardsContainer);
    }
  },
  methods: {
    onFileChange(event) {
      const selectedFiles = Array.from(event.target.files);
      const validFiles = selectedFiles.filter((file) => {
        const fileSizeMB = file.size / (1024 * 1024);
        const fileExt = file.name.split(".").pop().toLowerCase();
        const isValidSize = fileSizeMB <= this.maxSize;
        const isValidExt =
          this.extensions.length === 0 || this.extensions.includes(fileExt);
        return isValidSize && isValidExt;
      });

      // Ограничение общего количества файлов
      const totalFiles = this.files.length + validFiles.length;
      if (totalFiles > this.maxFiles) {
        validFiles.splice(this.maxFiles - this.files.length);
      }

      // Обновляем файлы через сеттер computed свойства `files`
      this.files = this.files.concat(validFiles);
      event.target.value = ""; // Сброс input
    },
    deleteFile(fileToDelete) {
      this.files = this.files.filter((file) => file !== fileToDelete);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    generateFileKey(file) {
      return `${file.name}-${file.size}-${file.lastModified}`;
    },
  },
};

</script>

<style lang="scss" scoped src="./styles.scss"></style>
