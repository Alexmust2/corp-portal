import { defineStore } from "pinia";

interface HeaderButtonProps {
  text: string,
  onClick: () => void
}

interface HeaderStateProps {
  visibility: boolean,
  button: HeaderButtonProps | null
  visibleButtonOnMobile: boolean,
}

export const useHeaderStore = defineStore("header", {
  state: (): HeaderStateProps => ({
    visibility: true,
    button: null,
    visibleButtonOnMobile: true
  }),

  getters: {},

  actions: {
    setHeaderVisibility(visible: boolean) {
      this.visibility = visible;
    },

    setHeaderButton(text?: string, onClick?: () => void, visibleOnMobile: boolean = true) {
      this.button = text && onClick ? { text, onClick } : null;
      this.visibleButtonOnMobile = visibleOnMobile;
    }
  }
});
