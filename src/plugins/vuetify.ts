import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labsComponents from "vuetify/labs/components";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

import { ru } from 'vuetify/locale';

const commonColors = {
  accent: "#89CB1F",
  "on-accent": "#FFFFFF",

  "second-accent": "#6E767A",
  "on-second-accent": "#FFFFFF",

  gray: "#B0B0B0",
  white: "#FFFFFF",
  red: "#EB7171",
}

const commonVariables = {
  "w-sidebar": '300px',
  'layout-px': '40px',
  'layout-py': '20px',
  'layout-gap': '20px',
  'header-h': '76px',

  'shadow-input': "0 4px 4px 0 rgba(176, 176, 176, 0.1)",
  'shadow-card': "0 2px 8px 0 rgba(120, 120, 120, 0.1)",
}

export default createVuetify({
  components: {
    ...components,
    ...labsComponents,
  },
  defaults: {
    VMenu: {
      offset: 4,
    },
  },
  directives,
  icons: {
    defaultSet: "mdi",
    aliases: {
      ...aliases,
    },
    sets: {
      mdi,
    },
  },
  locale: {
    locale: "ru",
    fallback: "en",
    messages: { ru },
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          ...commonColors,

          primary: "#3E3E3E",
          secondary: "#787878",
          tertiary: "#DFDFDF",
          addition: "#B0B0B0",
          'on-addition': "#FFFFFF",

          background: "#FFFFFF",
        },
        variables: {
          ...commonVariables
        },
      },
      dark: {
        dark: true,
        colors: {
          ...commonColors,

          primary: "#FFFFFF",
          secondary: "#E0E0E0",
          tertiary: "#202020",
          addition: "#757575",
          'on-addition': "#FFFFFF",

          background: "#191919",
        },
        variables: {
          ...commonVariables
        },
      },
    },
  },
});
