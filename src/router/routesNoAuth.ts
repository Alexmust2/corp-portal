import { lazyLoad } from "./index";
import { ROUTE_NAMES } from "./routeNames";

export const routesNoAuth = [
  {
    path: "/auth",
    name: ROUTE_NAMES.AUTH,
    component: lazyLoad("Auth"),
    meta: {
      title: "Страница авторизации",
    },
  },
];
