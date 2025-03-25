import { createRouter, createWebHistory } from "vue-router";
import { authGuard, titleGuard, permissionsGuard } from "./guards";
import { ROUTE_NAMES } from "./routeNames";
import { routesAuthRequired } from "./routesAuthRequired";
import { routesNoAuth } from "./routesNoAuth";

export function lazyLoad(view:string) {
  return () => import(`@/pages/${view}`);
}

const notFoundRoute = {
  path: '/:catchAll(.*)*',
  name: ROUTE_NAMES.NOT_FOUND,
  component: lazyLoad('NotFound'),
};

const routes = [
  ...routesAuthRequired.map(route => ({
    ...route,
    meta: { ...(route.meta || {}), requiresAuth: true },
  })),
  ...routesNoAuth.map(route => ({
    ...route,
    meta: { ...(route.meta || {}), requiresAuth: false },
  })),
  notFoundRoute,
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const path = to.path.replace(/\/+/g, "/");
  if (path !== to.path) {
    next({ path: path, query: to.query, hash: to.hash });
  } else {
    next();
  }
});

router.beforeEach(authGuard);
router.beforeEach(permissionsGuard);
router.beforeEach(titleGuard);

export default router;
