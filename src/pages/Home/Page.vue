<template>
  <div class="page-container block">
    <div class="section-title-container">
      <div class="content-container">
        <div class="text-container">
          <div class="title">
            <div class="h1">Корпоративный портал</div>
            <div class="title-underline">
              <svg
                class="line"
                xmlns="http://www.w3.org/2000/svg"
                width="304"
                height="20"
                viewBox="0 0 304 20"
                fill="none"
              >
                <path
                  d="M2 18C45.61 5.92602 166.664 -10.9775 302 18"
                  stroke="#89CB1F"
                  stroke-width="4"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <div class="description-text">
              Удобный и интуитивный корпоративный портал для эффективной
              коммуникации и оптимизации процессов внутри компании. Все статьи,
              ресурсы и материалы под рукой. Откройте для себя возможности для
              еще более эффективной работы со своим порталом!
            </div>
          </div>
          <c-btn
            size="sm"
            class="training-btn d-none d-md-block"
            @click="onBoarding"
          >
            Начать обучение
          </c-btn>
        </div>
        <div class="image-container">
          <div class="image-wrapper border_type-1">
            <img src="assets/man_home.png" class="image" />
            <CircleLayout
              :marginX="2"
              :marginY="0"
              :animationDuration="1500"
              :parallaxStrength="10"
            >
              <DetailsPopup
                v-for="popup in displayedPopups"
                :key="popup.id"
                :title="popup.title"
                :description="popup.description"
                :link="popup.link"
                :icon="popup.icon"
                :img="popup.img"
              />
            </CircleLayout>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="h2 pt-4 coming-block">
        <div>Скоро будет</div>
      </div>
      <div class="buttons-container">
        <DetailsPopup
          v-for="(popup, index) in comingPopups"
          :key="index"
          :title="popup.title"
          :description="popup.description"
          :link="popup.link"
          :icon="popup.icon"
          @request-faster="requestFaster(popup.title)"
          :img="popup.img"
        />
      </div>
    </div>

    <!-- <div class="training-btn">
      <c-btn class="d-md-none" block @click="onBoarding">Начать обучение</c-btn>
    </div> -->
  </div>
</template>

<script>
import { onboardingService } from "@/globalFunctions/onBoarding";
export default {
  name: "home-page",
  data() {
    return {
      popups: [
        {
          title: "Поддержка",
          description:
            "Платформа для получения технической и административной помощи, с функцией создания заявок в службу поддержки.",
          link: "/support",
          icon: "mdi-comment-question-outline",
          img: "assets/illustrations/support.png",
        },
        {
          title: "Уведомления",
          description:
            "Центр уведомлений, где отображаются все важные сообщения и напоминания, позволяя сотрудникам оставаться в курсе корпоративных событий и задач.",
          link: "/settings",
          icon: "mdi-alert-circle-outline",
          img: "assets/illustrations/notifications.png",
        },
        {
          title: "Мессенджер",
          description:
            "Централизованная система для обмена сообщениями и управления коммуникацией между сотрудниками, включая текстовые чаты, передачу файлов и мультимедиа.",
          link: "/chat",
          icon: "mdi-message-text-outline",
          img: "assets/illustrations/messages.png",
        },
        {
          title: "Статьи",
          description:
            "Библиотека полезных статей и инструкций, направленных на помощь сотрудникам в работе с внутренними системами и ресурсами компании.",
          link: "/articles",
          icon: "mdi-newspaper-variant-outline",
          img: "assets/illustrations/directory.png",
        },

        {
          title: "Заявления",
          description:
            "Централизованная система для подачи и отслеживания заявлений сотрудников, включая отпускные заявки, командировки и прочие служебные запросы.",
          link: "/statements",
          icon: "mdi-file-document-outline",
          img: "assets/illustrations/statements.png",
        },
        {
          title: "Переговорные",
          description:
            "Раздел для бронирования переговорных комнат, с удобной системой выбора доступного времени и помещения, позволяющий организовать встречи и обсуждения без накладок.",
          link: "/calendar",
          icon: "mdi-laptop-account",
          img: "assets/illustrations/feedback.png",
        },
        {
          title: "Сотрудники",
          description:
            "Каталог всех сотрудников компании, с возможностью поиска и фильтрации по отделам, должностям и другим критериям для быстрого доступа к контактам и информации.",
          link: "/users",
          icon: "mdi-account-multiple-outline",
          img: "assets/illustrations/team_building.png",
        },
      ],
      comingPopups: [
        {
          title: "Справочники",
          description:
            "Это многофункциональный инструмент, который объединяет в себе коллекции таблиц и блоков с данными, позволяя легко создавать и редактировать их.",
          link: "",
          img: "assets/illustrations/directory.png",
          icon: "mdi-bookmark-box-multiple-outline",
        },
        {
          title: "Медиагалерея",
          description:
            "Безопасное облачное хранилище для файлов компании, с поддержкой структурированной системы папок и удобным доступом к документам.",
          link: "",
          img: "assets/illustrations/gallery.png",
          icon: "mdi-play-outline",
        },
        {
          title: "Кабинет сборщика",
          description:
            "Инструмент для сотрудников, ответственных за сбор и обработку данных, с удобной навигацией и возможностью анализа.",
          link: "",
          img: "assets/illustrations/collector.png",
          icon: "mdi-wrench-outline",
        },
        {
          title: "Кухня",
          description:
            "Раздел для удобного заказа и оплаты завтраков, обедов и другой продукции через QR-код.",
          link: "",
          img: "assets/illustrations/kitchen.png",
          icon: "mdi-silverware-fork-knife",
        },
        {
          title: "Система обучения",
          description:
            "Платформа для обучения сотрудников, с доступом к курсам, тестам и прогрессу, направленная на развитие и повышение квалификации.",
          link: "",
          img: "assets/illustrations/training.png",
          icon: "mdi-school-outline",
        },
      ],
      currentContent: [],
      animationInterval: null,
    };
  },
  created() {
    // Передаем экземпляр роутера в сервис onboarding
    onboardingService.setRouter(this.$router);
  },

  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    displayedPopups() {
      const filteredPopups = this.popups.filter(
        (popup) => popup.title !== "Уведомления"
      );
      if (this.isMobile) {
        return filteredPopups.slice(0, 6);
      } else {
        return this.popups.slice(0, 7);
      }
    },
    remainingPopups() {
      return this.popups.filter(
        (popup) => !this.displayedPopups.includes(popup)
      );
    },
  },
  // mounted() {
  //   this.initializeContent();
  //   this.startAnimation();
  // },
  // beforeUnmount() {
  //   this.stopAnimation();
  // },
  methods: {
    onBoarding() {
      if (this.isMobile) {
        return false;
      }
      this.startOnboarding();
    },
    startOnboarding() {
      onboardingService.setRouter(this.$router);
      onboardingService.startPageOnboarding("home");
    },
    requestFaster(title) {
      try {
        this.$axios.post("/api/request-faster", { page: title });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped src="./styles.scss" />
