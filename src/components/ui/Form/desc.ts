export const dForm = {
    title: "Форма",
    description:
        "Компонент панели для отображения форм или другого содержимого. Используется как самостоятельный компонент или внутри `cSlidePanel`. Предоставляет единый стиль и структуру для форм.",
    defaultComponent: "cForm",
    attributeGroups: [
        {
            groupTitle: "Атрибуты",
            attributes: [
                {
                    value: "formPadding",
                    description:
                        "Кастомизирует отступы сверху и снизу для всей панели. Допустимые значения: `0`, `30` (по умолчанию).",
                    example: '<c-form formPadding="0"></c-form>',
                },
                {
                    value: "headerPadding",
                    description:
                        "Кастомизирует отступы слева и справа для хедера. Допустимые значения: `0`, `32` (по умолчанию).",
                    example: '<c-form headerPadding="0"></c-form>',
                },
                {
                    value: "contentPadding",
                    description:
                        "Кастомизирует отступы слева и справа для основного содержимого. Допустимые значения: `0`, `32` (по умолчанию).",
                    example: '<c-form contentPadding="0"></c-form>',
                },
                {
                    value: "footerPadding",
                    description:
                        "Кастомизирует отступы слева и справа для футера. Допустимые значения: `0`, `32` (по умолчанию).",
                    example: '<c-form footerPadding="0"></c-form>',
                },
            ],
        },
        {
            groupTitle: "Слоты",
            attributes: [
                {
                    value: "header",
                    description: "Слот для содержимого хедера панели.",
                    example:
                        '<c-form><template #header>header</template></c-form>',
                },
                {
                    value: "default",
                    description: "Слот для основного содержимого панели.",
                    example: '<c-form><p>Контент формы</p></c-form>',
                },
                {
                    value: "footer",
                    description: "Слот для содержимого футера панели.",
                    example:
                        '<c-form><template #footer><button>Отправить</button></template></c-form>',
                },
            ],
        },
    ],
};
