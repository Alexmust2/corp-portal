import { useUserStore } from "@/store/user.store";
import { useNotificationsStore } from "@/store/notifications.store";
import { userHavePermission } from "@/globalFunctions/guardFunctions"
import pinia from '@/store';
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useAuthStore } from "@/store/auth.store";
import { ROUTE_NAMES } from "./routeNames";

export async function authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const token = localStorage.getItem("token");
  const endpoint = localStorage.getItem("endpoint");
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const notificationsStore = useNotificationsStore();

  if (token) {
    await userStore.getUserByToken().then(() => {
      if (!endpoint) {
        notificationsStore.subscribeToNotifications();
      }
    });
  } else {
    userStore.setUser(null);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }
      } catch (error) {
      console.error("Failed to unsubscribe from push notifications", error);
      }
  }

  const user = userStore.user;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // @ts-ignore
  if (user && user.password && to.name === "auth") {
    return next({ name: ROUTE_NAMES.HOME });
  }

  // @ts-ignore
  if (user && !user.password) {
    if (to.name !== "auth") {
      authStore.setCurrentStep("setPassword");
      return next({ name: "auth" });
    } else {
      if (authStore.currentStep !== "setPassword") {
        authStore.setCurrentStep("setPassword");
      }
      return next();
    }
  }

  if (requiresAuth && !user) {
    if (to.name !== "auth") {
      authStore.setCurrentStep("login");
      return next({ name: "auth" });
    } else {
      if (authStore.currentStep !== "login") {
        authStore.setCurrentStep("login");
      }
      return next();
    }
  }
  next();
}

export async function permissionsGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const userStore = useUserStore(pinia);
  const token = localStorage.getItem("token");

  if (!userStore.user && token) {
    await userStore.getUserByToken();
  }

  if (to.meta.requiresPermissions) {
    // @ts-ignore
    const hasPermission = userHavePermission(userStore.user, (to.meta.requiresPermissions as string));
    if (!hasPermission) {
      return next('/');
    }
  }

  next();
}

export function titleGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  document.title = typeof to.meta.title === 'string' ? to.meta.title : "Корпоративный портал";
  next();
}
