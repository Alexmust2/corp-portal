/* eslint-disable no-console */

import { register } from "register-service-worker";

register(`/dev-service-worker.js`, {
  ready() {
    console.log("Service worker is active.");
  },
  registered(registration) {
    console.log("Service worker has been registered.");
    registration.update();

    // Отправляем переменную окружения в Service Worker
    if (registration.active) {
      registration.active.postMessage({
        type: "SET_API_URL",
        apiUrl: process.env.VUE_APP_API_URL, 
      });
    } else {
      navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
        serviceWorkerRegistration.active?.postMessage({
          type: "SET_API_URL",
          apiUrl: process.env.VUE_APP_API_URL,
        });
      });
    }
  },
  cached() {
    console.log("Content has been cached for offline use.");
  },
  updatefound() {
    console.log("New content is downloading.");
  },
  updated(registration) {
    console.log("New content is available; please refresh.");
    document.dispatchEvent(
      new CustomEvent("swUpdated", { detail: registration })
    );
  },
  offline() {
    console.log(
      "No internet connection found. App is running in offline mode."
    );
  },
  error(error) {
    console.error("Error during service worker registration:", error);
  },
});
