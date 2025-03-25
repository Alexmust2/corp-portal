import { App } from "vue";
import role from "./VRole";
import profile from "./VProfile";

export default {
  install(app: App) {
    app.directive('role', role);
    app.directive('profile', profile);
  }
};