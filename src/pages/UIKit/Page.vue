<template>
  <div id="ui-kit-page" class="block">
    <v-row>
      <v-col cols="2">
        <componentSidebar
          :componentDocumentation="componentDocumentation"
          :activeComponent="activeComponent"
        />
      </v-col>
      <v-col cols="10">
        <h1 class="text-h2 text-center mb-10">UI Kit Documentation</h1>

        <div
          v-for="(component, key) in componentDocumentation"
          :key="key"
          class="mb-15 px-5"
        >
          <span
            :id="slugify(component.title)"
            class="title position-relative w-100 d-inline-block text-h4 mb-5"
          >
            <a class="hash" :href="'#' + slugify(component.title)">#</a>
            {{ component.title }}
          </span>

          <v-row>
            <v-col cols="12" md="6" class="position-relative">
              <div class="example d-flex flex-wrap justify-center ga-5">
                <component
                  v-for="(example, index) in component.examples"
                  :key="index"
                  :is="component.defaultComponent"
                  v-bind="example.props"
                  >{{ example.text }}</component
                >
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <component-details :component="component" />
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <c-btn v-model="isPanelVisible" @click="isPanelVisible = !isPanelVisible"
      >нажми на меня</c-btn
    >
    <c-slide-panel v-model="isPanelVisible" title="Пример панели">
      <p>Содержимое панели</p>
    </c-slide-panel>
  </div>
</template>

<script>
import ComponentSidebar from "./ComponentSidebar.vue";
import ComponentDetails from "./ComponentDetails.vue";
import { dBtn } from "@/components/ui/Btn";
import { dSwitch } from "@/components/ui/Switch";
import { dCheckbox } from "@/components/ui/Checkbox";
import { dInput } from "@/components/ui/Input";
import { dAlert } from "@/components/ui/Alert";
import { dFAQ } from "@/components/ui/FAQ";
import { dUserCard } from "@/components/ui/UserCard";
import { dStatus } from "@/components/ui/Status";
import { dTable } from "@/components/ui/Table";
import { examples, dText } from "@/components/ui/Examples";
import { dAnimation } from "@/components/ui/Animation";
import { dSlidePanel } from "@/components/ui/SlidePanel";
import { dForm } from "@/components/ui/Form";
import { dSelect } from "@/components/ui/Select";
import { dBorderRadius } from "@/components/ui/Examples";
import { dChip } from "@/components/ui/Chip";
import { dChipGroup } from "@/components/ui/ChipGroup";

export default {
  name: "ui-kit",
  components: {
    ComponentSidebar,
    ComponentDetails,
  },
  data() {
    return {
      isPanelVisible: false,
      activeComponent: null,
      showAlert: false,
      selectedChips: [],
      selectedChips2: [],
      componentDocumentation: [
        examples,
        dBtn,
        dSwitch,
        dCheckbox,
        dAlert,
        dFAQ,
        dUserCard,
        dStatus,
        dTable,
        dInput,
        dText,
        dAnimation,
        dSlidePanel,
        dForm,
        dSelect,
        dBorderRadius,
        dChip,
        dChipGroup,
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.observeComponents();
    });
  },
  methods: {
    slugify(text) {
      return text.toLowerCase().replace(/\s+/g, "-");
    },
    observeComponents() {
      this.$nextTick(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                this.activeComponent = entry.target.id;
                this.highlightActive(entry.target.id);
              }
            });
          },
          {
            rootMargin: "0px 0px -50% 0px",
          }
        );

        const components = document.querySelectorAll(".title");

        components.forEach((component) => {
          observer.observe(component);
        });
      });
    },
    highlightActive(activeId) {
      const links = document.querySelectorAll(".component-sidebar a");

      links.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${activeId}`
        );
      });
    },
  },
  computed: {
    formattedDocumentation() {
      return Object.keys(this.componentDocumentation).map((key) => ({
        name: key,
        data: this.componentDocumentation[key],
      }));
    },
  },
};
</script>

<style lang="scss" scoped src="./styles.scss" />
