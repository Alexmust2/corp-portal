import { DirectiveBinding, h, createApp } from "vue";
import { cUserCard } from "@/components/ui/UserCard";
import vuetify from "@/plugins/vuetify"; // Ensure the path is correct

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const clickHandler = () => {
      // Create container for the component
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.zIndex = "1000";
      document.body.appendChild(container);

      // Calculate position
      const rect = el.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const space = {
        top: rect.top,
        bottom: viewportHeight - rect.bottom,
        left: rect.left,
        right: viewportWidth - rect.right,
      };

      const padding = 30;
      const mobileThreshold = 959;
      const isMobile = viewportWidth <= mobileThreshold;
      const cardWidth = isMobile ? 450 : 350;
      const cardHeight = isMobile ? 190 : 157;
      const minLeftMargin = isMobile ? 0 : 225;

      let left = rect.right + padding;
      let top = rect.top;

      if (space.right < cardWidth && space.left >= cardWidth) {
        left = rect.left - cardWidth - padding;
      }
      if (space.bottom < cardHeight && space.top >= cardHeight) {
        top = rect.top - cardHeight - padding;
      }
      if (space.right < cardWidth && space.left < cardWidth) {
        left = Math.max(
          minLeftMargin,
          Math.min(rect.left, viewportWidth - cardWidth)
        );
      }
      if (space.bottom < cardHeight && space.top < cardHeight) {
        top = Math.max(
          padding,
          Math.min(rect.bottom + padding, viewportHeight - cardHeight - padding)
        );
      }

      left = Math.max(
        minLeftMargin,
        Math.min(left, viewportWidth - cardWidth - padding)
      );

      container.style.left = isMobile ? `10%` : `30%`;
      container.style.top = `${top}px`;

      // Function to close the card
      const closeCard = () => {
        document.removeEventListener("click", outsideClickListener);
        document.removeEventListener("touchstart", outsideTouchListener);
        app.unmount();
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      };

      // Click listener for closing when clicking outside
      const outsideClickListener = (event: MouseEvent) => {
        if (!container.contains(event.target as Node) && el) {
          closeCard();
        }
      };

      // Touch listener to close if tapping outside immediately
      const outsideTouchListener = (event: TouchEvent) => {
        if (!container.contains(event.target as Node) && el) {
          closeCard();
        }
      };

      // Add event listeners
      setTimeout(() => {
        document.addEventListener("click", outsideClickListener);
        document.addEventListener("touchstart", outsideTouchListener, { passive: true });
      }, 0);

      // Create Vue app instance
      const app = createApp({
        render: () =>
          h(cUserCard, {
            ...binding.value,
            onClose: closeCard,
          }),
      });

      app.use(vuetify);
      app.mount(container);
    };

    el.addEventListener("click", clickHandler);
    (el as any)._clickHandler = clickHandler;
  },

  beforeUnmount(el: HTMLElement) {
    const clickHandler = (el as any)._clickHandler;
    if (clickHandler) {
      el.removeEventListener("click", clickHandler);
      delete (el as any)._clickHandler;
    }
  },
};
