<template>
  <div class="ellipsis-menu" @click.stop="toggleMenu" ref="triggerElement">
    <v-icon>mdi-dots-horizontal</v-icon>
    <Teleport to="body">
      <div
        v-if="isMenuVisible"
        :class="['menu-content', menuPosition]"
        :style="menuStyles"
        ref="menuContent"
      >
        <button v-if="onEdit" class="menu-item" @click.stop="handleEdit">
          Редактировать
        </button>
        <div v-if="onEdit && onDelete" class="separator"></div>
        <button class="menu-item" @click="showModal = true">Удалить</button>
      </div>
    </Teleport>
  </div>

  <ConfirmModal
    :options="computedDialogOptions"
    @confirm="handleDelete"
    v-model="showModal"
  />
</template>

<script>
export default {
  name: "c-ellipsis-menu",
  props: {
    onEdit: {
      type: Function,
      default: null,
    },
    onDelete: {
      type: Function,
      default: null,
    },
    isDeleteFile: {
      type: Boolean,
      default: false,
    },
    isDeleteArticle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isMenuVisible: false,
      menuPosition: "right",
      menuStyles: {},
      isDeleteDialogVisible: false,
      showModal: false,
    };
  },
  computed: {
    computedDialogOptions() {
      if (this.isDeleteFile) {
        return {
          title: "Удаление файла",
          text: "Вы уверены, что хотите удалить этот файл?",
          confirmText: "Удалить",
          cancelText: "Отменить",
          type: "delete",
        };
      }
      if (this.isDeleteArticle) {
        return {
          title: "Удаление статьи",
          text: "Вы уверены, что хотите удалить эту статью? Данное действие невозможно отменить.",
          confirmText: "Удалить",
          cancelText: "Отменить",
          type: "delete",
        };
      }
      return this.defaultDialogOptions || {
        title: "Удаление встречи",
        text: "Вы уверены, что хотите удалить эту встречу? Все данные о встрече будут утеряны, и действие нельзя будет отменить.",
        confirmText: "Удалить",
        cancelText: "Отменить",
        type: "delete",
      };
    },
  },
  methods: {
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible;
      if (this.isMenuVisible) {
        this.$nextTick(() => {
          requestAnimationFrame(() => {
            this.adjustPosition();
            const event = new CustomEvent("menu-opened", { detail: this });
            window.dispatchEvent(event);
          });
        });
      }
    },
    handleEdit() {
      this.isMenuVisible = false;
      if (this.onEdit) this.onEdit();
    },
    handleDelete() {
      this.isMenuVisible = false;
      if (this.onDelete) this.onDelete();
      this.showModal = false;
    },
    adjustPosition() {
      const menu = this.$refs.menuContent;
      const trigger = this.$refs.triggerElement;
      if (menu && trigger) {
        const triggerRect = trigger.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();

        let left = triggerRect.left;
        let top = triggerRect.bottom;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Check if menu goes off the screen to the right
        if (left + menuRect.width > screenWidth) {
          left = triggerRect.right - menuRect.width;
          this.menuPosition = "left";
        } else {
          this.menuPosition = "right";
        }

        // Adjust top position if the menu goes off the screen vertically
        if (top + menuRect.height > screenHeight) {
          top = triggerRect.top - menuRect.height;
        }
        if (top < 0) {
          top = 10; // Add padding
        }

        this.menuStyles = {
          position: "absolute",
          top: `${top}px`,
          left: `${left}px`,
          zIndex: 1000,
        };
      }
    },
    onOutsideClick(event) {
      if (
        !this.$el.contains(event.target) &&
        !(
          this.$refs.menuContent &&
          this.$refs.menuContent.contains(event.target)
        )
      ) {
        this.isMenuVisible = false;
        this.showModal = false;
      }
    },
    onMenuOpened(event) {
      if (event.detail !== this) {
        this.isMenuVisible = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.onOutsideClick);
    window.addEventListener("menu-opened", this.onMenuOpened);
    window.addEventListener("resize", this.adjustPosition);
    window.addEventListener("scroll", this.adjustPosition);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.onOutsideClick);
    window.removeEventListener("menu-opened", this.onMenuOpened);
    window.removeEventListener("resize", this.adjustPosition);
    window.removeEventListener("scroll", this.adjustPosition);
  },
  watch: {
    isMenuVisible(newValue) {
      if (!newValue) {
        this.isDeleteDialogVisible = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped src="./styles.scss"></style>
