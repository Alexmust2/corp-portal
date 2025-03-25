<template>
  <c-form
    :contentPadding="contentPadding"
    :formPadding="isMobile ? '30' : 'bottom-20'"
    :footerPadding="footerPadding"
    :headerPadding="isMobile ? 20 : 0"
    contentHeight="100%"
  >
    <template #header>
      <slot name="header"></slot>
    </template>
    <div class="settings-form">
      <span
        class="align-self-end position-absolute text-caption"
        style="color: rgb(var(--v-theme-tertiary))"
        >{{ userId }} ID</span
      >
      <slot></slot>
    </div>
    <template #footer>
      <div class="form-actions">
        <c-btn
          class="form-action"
          v-if="showCancel && !isMobile"
          color="addition"
          block
          @click="onCancel"
        >
          Отменить изменения
        </c-btn>
        <c-btn class="form-action" block @click="onSave" :disabled="isSaveDisabled">Сохранить</c-btn>
      </div>
    </template>
  </c-form>
</template>

<script>
import headerVisibilityMixin from "@/mixins/headerVisibilityMixin";
import { useUserStore } from "@/store/user.store";

export default {
  props: {
    showCancel: {
      type: Boolean,
      default: true,
    },
    contentPadding: {
      type: String,
      default: "20",
    },
    footerPadding: {
      type: String,
      default: "20",
    },
    isSaveDisabled: Boolean,
  },
  mixins: [headerVisibilityMixin],
  computed: {
    userId() {
      return useUserStore().user.id;
    },
  },
  methods: {
    onCancel() {
      this.$emit("cancel");
    },
    onSave() {
      this.$emit("save");
    },
  },
};
</script>

<style scoped>
.settings-form {
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 30px;
  height: 100%;
  /* @media screen and (min-width: 960px) {
    gap: 20px;
  } */
}

.form-actions {
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.form-action {
  flex: 1;
  text-wrap: nowrap;
  min-width: 250px;
}
</style>
