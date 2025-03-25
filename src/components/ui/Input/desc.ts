export const dInput = {
  title: "Input",
  description:
    "Компонент текстового поля для ввода данных. Поддерживает двустороннее связывание через v-model, возможность добавления иконок и кастомизацию состояний.",
  defaultComponent: "c-input",
  examples: [
    {
      text: "Базовый инпут",
      props: { hint: "Ваше имя" },
    },
    {
      text: "Инпут с иконкой внутри",
      props: { prependInnerIcon: "mdi-magnify", success: true },
    },
    {
      text: "Инпут с ошибкой",
      props: {
        error: true,
        errorMessage: "Неверный формат",
      },
    },
  ],
  attributeGroups: [
    {
      groupTitle: "properties (свойства)",
      attributes: [
        {
          value: 'success',
          example: '<c-input success />',
        },
        {
          value: 'error',
          example: '<c-input error />',
        },
        {
          value: "type",
          example: '<c-input type="email" />',
        },
        {
          value: "placeholder",
          example: '<c-input placeholder="Введите ваш текст" />',
        },
        {
          value: "prepend-icon",
          example: '<c-input prepend-icon="mdi-magnify" />',
        },
        {
          value: "append-icon",
          example: '<c-input append-icon="mdi-eye" />',
        },
        {
          value: 'errorMessage',
          example: '<c-input errorMessage="Поле обязательно для заполнения" />',
        },
        {
          value: 'helpMessage',
          example: '<c-input helpMessage="Поле обязательно для заполнения" />',
        },
        {
          value: 'reserveSpace',
          example: '<c-input reserveSpace />',
        },
        {
          value: 'block',
          example: '<c-input block />',
        }
      ],
    },
    {
      groupTitle: 'emits (события)',
      attributes: [
        {
          value: "v-model",
          example: '<c-input v-model="username" />',
        },
        {
          value: 'update:modelValue',
          example: '<c-input @update:modelValue="()=>{}" />',
        },
        {
          value: 'enter-pressed',
          example: '<c-input @enter-pressed="()=>{}" />',
        },
        {
          value: 'click:prepend-icon',
          example: '<c-input @click:prepend-icon="()=>{}" />',
        },
        {
          value: 'click:append-icon',
          example: '<c-input @click:append-icon="()=>{}" />',
        }
      ]
    },
  ],
};
