import { DirectiveBinding } from 'vue';

// Определение типа функции-обработчика длительного нажатия
interface LongPressHandler {
  (e: Event): void;
}

export const longPress = {
  // Хук mounted вызывается, когда директива привязывается к элементу
  mounted(el: HTMLElement, binding: DirectiveBinding<LongPressHandler>) {
    // Проверка, что значение директивы является функцией
    if (typeof binding.value !== 'function') {
      console.warn(`Ожидается функция в качестве значения директивы v-long-press`);
      return;
    }

    let pressTimer: number | null = null;
    // Установка задержки: используем аргумент директивы или значение по умолчанию 2000мс
    const delay = (binding.arg && !isNaN(Number(binding.arg))) ? Number(binding.arg) : 300;

    // Функция, вызываемая при начале нажатия
    const start = (e: Event) => {
      // Игнорируем нажатия правой кнопкой мыши
      if (e.type === 'click' && (e as MouseEvent).button !== 0) {
        return;
      }

      // Устанавливаем таймер для определения длительного нажатия
      if (pressTimer === null) {
        pressTimer = window.setTimeout(() => {
          handler(e);
        }, delay);
      }
    };

    // Функция для отмены длительного нажатия
    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    // Обработчик длительного нажатия
    const handler = (e: Event) => {
      binding.value(e);
    };

    el.addEventListener("mousedown", cancel);  // Отмена нажатия мышью
    el.addEventListener("touchstart", start); // Начало касания на тачскрине
    el.addEventListener("click", cancel);     // Отмена при клике (короткое нажатие)
    el.addEventListener("mouseout", cancel);  // Отмена при уходе курсора с элемента
    el.addEventListener("touchend", cancel);  // Отмена при завершении касания
    el.addEventListener("touchmove", cancel); // Отмена при движении пальца по экрану
  }
};