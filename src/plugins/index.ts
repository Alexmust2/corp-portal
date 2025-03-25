import vuetify from './vuetify'
import pinia from '../store'
import axios from "./axios.plugin";
import customDirectives from "@/directives";
import router from "../router";
import { App } from 'vue';
import toast from './toast.plugin';

export function registerPlugins(app: App) {
  app
    .use(toast)
    .use(axios)
    .use(customDirectives)
    .use(vuetify)
    .use(pinia)
    .use(router)
}