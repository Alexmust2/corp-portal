export const links = [
    {
        route: "/",
        icon: "mdi-home",
        title: "Главная",
    },
    {
        route: "/chat",
        icon: "mdi-message-outline",
        title: "Мессенджер",
        permission: "",
        matchPrefix: true,
        showUnreadMessageCounter: true,
    },
    {
        route: "/articles",
        icon: "mdi-newspaper-variant-outline",
        title: "База знаний",
        permission: "",
        matchPrefix: true,
    },
    {
        route: "",
        icon: "mdi-file-document-outline",
        title: "Заявления",
        children: [
            {
                route: "/statements",
                icon: "mdi-newspaper",
                title: "Мои заявления",
                permission: "",
            },
            {
                route: "/statements/processing",
                icon: "mdi-newspaper-variant-outline",
                title: "Обработка заявлений",
                permission: "statements_processing",
            },
        ],
    },
    {
        route: "/calendar",
        icon: "mdi-laptop-account",
        title: "Переговорки",
        permission: "",
    },
    {
        route: "/users",
        icon: "mdi-account-multiple-outline",
        title: "Пользователи",
    },
    {
        route: "",
        icon: "mdi-security",
        title: "Админка",
        permission: "admin",
        children: [
            {
                route: "/panel",
                icon: "mdi-hand-back-right-outline",
                title: "Настройка ролей",
                permission: "admin",
            },
            {
                route: "/panel/support",
                icon: "mdi-face-agent",
                title: "Заявки в поддержку",
                permission: "admin",
            },
        ],
    },
];

