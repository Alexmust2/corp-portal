<template>
  <div>
    <div class="wrapper">
      <div class="block block_form mb-md-5">
        <div>
          <h1 class="h1 mb-3">Поддержка</h1>

          <div class="lg mb-7 paragraph">
            Если Вы столкнулись с проблемами работы сайта, <br />
            напишите о них нам, мы обязательно поможем!
          </div>
          <c-btn size="sm" @click="openForm">Заполнить форму</c-btn>
        </div>
        <cAnimation
          :animationName="isMobile ? 'support' : 'team_building'"
          class="animate mx-auto"
        />
      </div>
      <div class="block block-faq">
        <h2 class="h2 pb-5">Популярные вопросы</h2>
        <div :class="{ 'faq-wrapper': !isMobile }">
          <template v-if="!isMobile">
            <div class="faq-col">
              <div v-for="faq in evenFaqs" :key="faq.title">
                <c-FAQ :title="faq.title">
                  {{ faq.answer }}
                </c-FAQ>
              </div>
            </div>
            <div class="faq-col">
              <div v-for="faq in oddFaqs" :key="faq.title">
                <c-FAQ :title="faq.title">
                  {{ faq.answer }}
                </c-FAQ>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="d-flex flex-column ga-4">
              <div v-for="faq in faqData.faqs" :key="faq.title">
                <c-FAQ :title="faq.title">
                  {{ faq.answer }}
                </c-FAQ>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <c-slide-panel v-model="isFormOpen" title="Форма заявки" @close="closeForm">
      <div class="form-item">
        <h2 class="h2">Тип проблемы</h2>
        <cSelect v-model="supportRequest.type" :items="problemTypes" />
      </div>

      <div class="form-item">
        <h2 class="h2">Опишите проблему</h2>
        <cTextarea v-model="supportRequest.description" />
      </div>

      <div class="form-item">
        <h2 class="h2">Прикрепите скриншоты</h2>
        <c-FileInput v-model="supportRequest.files" :maxFiles="8" />
      </div>
      <template #footer>
        <c-btn :disabled="isSubmitDisabled" block @click="sendRequest"
          >Отправить</c-btn
        >
      </template>
    </c-slide-panel>
  </div>
</template>

<script>
import faqData from "./faqs.json";
import { onboardingService } from "@/globalFunctions/onBoarding";
export default {
  name: "supportPage",
  data() {
    return {
      isFormOpen: false,
      supportRequest: {
        type: null,
        description: null,
        files: [],
      },
      problemTypes: [
        "Проблемы с оформлением",
        "Технические неполадки",
        "Проблемы с навигацией",
        "Проблемы с доступом к функциям",
        "Другая проблема",
        "Хочу похвалить разработчиков <3",
      ],
      faqData: faqData,
    };
  },
  computed: {
    isSubmitDisabled() {
      return !this.supportRequest.type || !this.supportRequest.description;
    },
    evenFaqs() {
      return this.faqData.faqs.filter((faq, index) => index % 2 === 0);
    },
    oddFaqs() {
      return this.faqData.faqs.filter((faq, index) => index % 2 !== 0);
    },
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
  },
  methods: {
    openForm() {
      this.isFormOpen = true;
    },
    closeForm() {
      this.isFormOpen = false;
    },
    sendRequest() {
      if (!this.isSubmitDisabled) {
        const formData = new FormData();

        formData.append("type", this.supportRequest.type);
        formData.append("description", this.supportRequest.description);

        let files = this.supportRequest.files;
        if (!Array.isArray(files)) {
          files = [files];
        }

        files.forEach((file) => {
          formData.append("files", file);
        });

        this.$API.supportApi
          .send(formData)
          .then(() => {
            this.closeForm();
            this.supportRequest = { type: null, description: null, files: [] };
          })
          .catch((error) => {
            console.error("Ошибка при отправке запроса:", error);
          });
      }
    },
    continueOnboarding() {
      onboardingService.startPageOnboarding("support");
      onboardingService.setRouter(this.$router);
    },
  },
};
</script>

<style lang="scss" scoped src="./styles.scss" />
