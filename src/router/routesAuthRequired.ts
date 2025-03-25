import { lazyLoad } from "./index";
import { ROUTE_NAMES } from "./routeNames";

export const routesAuthRequired = [
  {
    path: "/",
    name: ROUTE_NAMES.HOME,
    component: lazyLoad("Home"),
  },
  {
    path: "/checklists",
    name: ROUTE_NAMES.CHECKLISTS,
    component: lazyLoad("CheckList"),
    meta: {
      title: "Чек листы",
      requiresPermissions: "admin",
    },
  },
  {
    path: "/chat",
    name: ROUTE_NAMES.CHAT,
    component: lazyLoad("Messenger"),
    meta: {
      title: "Чаты",
    },
  },
  {
    path: "/chat/:id",
    name: ROUTE_NAMES.CHAT_ID,
    component: lazyLoad("Messenger"),
  },

  {
    path: "/user/:id",
    name: ROUTE_NAMES.USER,
    component: lazyLoad("UserView.vue"),
  },
  {
    path: "/user/:id/edit",
    name: ROUTE_NAMES.USER_EDIT,
    component: lazyLoad("UserEdit"),
  },
  {
    path: "/settings",
    name: ROUTE_NAMES.SETTINGS,
    component: lazyLoad("Settings"),
    meta: {
      title: "Настройки профиля",
    },
  },
  {
    path: "/users",
    name: ROUTE_NAMES.USERS,
    component: lazyLoad("UsersTable"),
    meta: {
      title: "Пользователи",
    },
  },
  {
    path: "/panel",
    name: ROUTE_NAMES.PANEL,
    component: lazyLoad("AdminPanel"),
    meta: {
      title: "Панель администратора",
      requiresPermissions: "admin",
    },
  },
  {
    path: "/panel/support",
    name: ROUTE_NAMES.SUPPORT_TICKET,
    component: lazyLoad("AdminPanel/SupportTicket"),
    meta: {
      title: "Обработка заявок поддержки",
      requiresPermissions: "admin",
    },
  },
  {
    path: "/test",
    name: ROUTE_NAMES.TEST,
    component: lazyLoad("Test"),
    meta: {
      title: "Лаборатория",
      requiresPermissions: "admin",
    },
  },
  {
    path: "/profile",
    name: ROUTE_NAMES.PROFILE,
    component: lazyLoad("Profile"),
  },
  {
    path: "/calendar",
    name: ROUTE_NAMES.CALENDAR,
    component: lazyLoad("Calendar"),
    meta: {
      title: "Переговорные",
    },
  },
  {
    path: "/articles",
    name: ROUTE_NAMES.ARTICLES,
    component: lazyLoad("Articles"),
    meta: {
      title: "Статьи",
    },
  },
  {
    path: "/articles/edit/:id",
    name: ROUTE_NAMES.ARTICLES_EDIT,
    component: lazyLoad("Articles/create"),
  },
  {
    path: "/articles/create",
    name: ROUTE_NAMES.ARTICLES_CREATE,
    component: lazyLoad("Articles/create"),
  },
  {
    path: "/articles/:id",
    name: ROUTE_NAMES.ARTICLES_SINGLE,
    component: lazyLoad("Articles/[id]"),
  },
  {
    path: "/statements",
    name: ROUTE_NAMES.STATEMENTS,
    component: lazyLoad("Statements"),
    meta: {
      title: "Заявления",
    },
  },
  {
    path: "/statements/processing",
    name: ROUTE_NAMES.STATEMENTS_PROCESSING,
    component: lazyLoad("Statements/Processing"),
    meta: {
      title: "Обработка заявлений",
      requiresPermissions: "statements_processing",
    },
  },
  {
    path: "/support",
    name: ROUTE_NAMES.SUPPORT,
    component: lazyLoad("Support"),
    meta: {
      title: "Поддержка",
    },
  },
  {
    path: "/animations",
    name: ROUTE_NAMES.ANIMATIONS,
    component: lazyLoad("Animations"),
    meta: {
      title: "Анимации",
      requiresPermissions: "admin",
    },
  },
  {
    path: "/ui",
    name: ROUTE_NAMES.UI_KIT,
    component: lazyLoad("UIKit"),
    meta: {
      title: "UI Kit",
      requiresPermissions: "admin",
    },
  },
];
