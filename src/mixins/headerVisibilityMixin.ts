import { useHeaderStore } from "@/store/header.store";
import { defineComponent } from "vue";
import { RouteLocationNormalized } from "vue-router";

export default defineComponent({
  computed: {
    isMobile(): boolean {
      return (this as any).$vuetify.display.smAndDown;
    },
  },
  watch: {
    $route(to: RouteLocationNormalized, from: RouteLocationNormalized) {
      if (this.isMobile && from.name === 'settings' && to.name !== 'settings') {
        useHeaderStore().visibility = true;
      }
    },
  },
  created() {
    if (this.isMobile) {
      useHeaderStore().visibility = false;
    }
  },
  beforeUnmount() {
    if (this.isMobile) {
      useHeaderStore().visibility = true;
    }
  },
})
