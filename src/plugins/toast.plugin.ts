import { App } from "vue";
import Vue3Toastify, { ToastContainerOptions } from "vue3-toastify";

const toastOptions: ToastContainerOptions = {
    autoClose: 3000,
}

const toast = {
    install(app: App) {
        app.use(Vue3Toastify, toastOptions);
    }
}

export default toast