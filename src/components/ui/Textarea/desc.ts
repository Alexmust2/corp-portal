export const dTextarea = {
    title: "Текстовая область",
    description:
        "Компонент текстовой области, который позволяет пользователям вводить многострочные текстовые данные. Поддерживает настраиваемые атрибуты, такие как placeholder, label, и возможность отключения.",
    defaultComponent: "c-textarea",
    examples: [
        {
            props: { placeholder: "Введите текст...", modelValue: "" },
            description: "Текстовая область с меткой и плейсхолдером."
        },
        {
            props: { disabled: true, placeholder: "Недоступно для ввода" },
            description: "Отключенная текстовая область с плейсхолдером."
        },
        {
            props: { customClass: "custom-textarea-class", modelValue: "Предварительный текст" },
            description: "Текстовая область с кастомным классом и предварительно заполненным текстом."
        },
    ],
    attributeGroups: [
        {
            groupTitle: "Атрибуты",
            attributes: [
                {
                    value: "modelValue",
                    description: "Текущее значение текстовой области.",
                    example: '<c-textarea v-model="userComment" />',
                },
                {
                    value: "label",
                    description: "Метка, отображаемая над текстовой областью.",
                    example: '<c-textarea label="Комментарий" />',
                },
                {
                    value: "placeholder",
                    description: "Текст, отображаемый при пустом поле ввода.",
                    example: '<c-textarea placeholder="Введите текст..." />',
                },
                {
                    value: "customClass",
                    description: "Пользовательский класс для стилизации компонента.",
                    example: '<c-textarea custom-class="custom-textarea" />',
                },
                {
                    value: "disabled",
                    description: "Делает текстовую область недоступной для ввода.",
                    example: '<c-textarea disabled />',
                },
            ],
        },
    ],
};
