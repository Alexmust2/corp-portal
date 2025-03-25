import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import { registerPlugins } from "./plugins";
import "vuetify/styles";
import api from "./api";
import * as components from "@/components/ui";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import ElementTiptapPlugin from "element-tiptap-vue3-fixed";
import "element-tiptap-vue3-fixed/lib/style.css";

import "./pages/UIKit/styles.scss";

const app = createApp(App);
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}
app.use(ElementPlus);
app.use(ElementTiptapPlugin);
registerPlugins(app);

Object.entries(components).forEach(([name, component]) => {
  app.component(name, component);
});

app.config.globalProperties.$API = api;
app.mount("#app");
