export const dSlidePanel = {
    title: "Панель слайда",
    description:
        "Компонент панели, которая выезжает справа на десктопе и снизу на мобильных устройствах. Позволяет отображать контент в боковой панели с адаптивным поведением.",
    defaultComponent: "c-slide-panel",
    attributeGroups: [
        {
            groupTitle: "Атрибуты",
            attributes: [
                {
                    value: "modelValue",
                    description: "Управляет видимостью панели. Используется с `v-model`.",
                    example: '<c-slide-panel v-model="isPanelVisible"></c-slide-panel>',
                },
                {
                    value: "title",
                    description: "Заголовок панели, отображаемый в верхней части.",
                    example: '<c-slide-panel title="Мой заголовок"></c-slide-panel>',
                },
            ],
        },
        {
            groupTitle: "Слоты",
            attributes: [
                {
                    value: "default",
                    description: "Слот для основного содержимого панели.",
                    example:
                        '<c-slide-panel v-model="isPanelVisible"><p>Контент панели</p></c-slide-panel>',
                },
            ],
        },
    ],
};
