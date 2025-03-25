import introJs from "intro.js";
import "intro.js/minified/introjs.min.css";

class OnboardingService {
  constructor() {
    this.isOnboarding = false;
    this.currentStep = 0;
    this.intro = null;
    this.steps = {
      home: [
        // Шаги для домашней страницы
        {
          element: ".header",
          intro: `
         <div class="custom-intro-content">
          <img src="assets/illustrations/successful_action.png" alt="header" class="intro-image">
          <h3>Настройка профиля и панель уведомлений</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          <p>
Нажмите на иконку своего профиля в правом верхнем углу. Здесь можно загрузить фото, указать контакты и настроить получение уведомлений.</p>
          <div class="intro-footer">
<button class=" intro-button">Далее</button>
          </div>
        </div>
      `,
          position: "right",
          tooltipClass: "customTooltip header-tooltip-right",
        },
        {
          element: ".header",
          intro: `
            <div class="custom-intro-content">
              <img src="assets/illustrations/notifications.png" alt="header" class="intro-image">
              <h3>Уведомления</h3>
                      <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
              <p>В верхней панели сайта находятся уведомления, где вы можете видеть важные сообщения о компании. Здесь же можно настроить, о каких событиях или сообщениях вы хотите получать оповещения. </p>
               <div class="intro-footer">
                <button class="intro-button">Понятно</button>
              </div>
            </div>
          `,
          position: "right",
          tooltipClass: "customTooltip header-tooltip-right",
        },
        {
          element: ".sidebar",
          intro: `
             <div class="custom-intro-content">
            <img src="assets/illustrations/successful_action.png" alt="sidebar" class="intro-image">
              <h3>Основное меню и навигация</h3>
                      <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
              <p>Слева – список вкладок. Здесь находятся все основные разделы портала. Некоторые из них могут быть сгруппированы подразделами. Данное меню настраивается ролями и может быть для разных пользователей уникальным. Давайте изучим все разделы нашей платформы.</p>
              <div class="intro-footer">
                <div class="intro-progress"></div>
                <button class="intro-button">Далее</button>
              </div>
            </div>
          `,
          position: "right",
        },
        {
          element: '.router-link[href="/chat"]',
          intro: `
            <div class="custom-intro-content">
              <img src="assets/illustrations/messages.png" alt="sidebar" class="intro-image">
              <h3>Мессенждер</h3>
                      <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
              <p>Начнём с первого раздела - Мессенджер и нажмем на кнопку раздела.</p>
            </div>
          `,
          position: "right",
        },
      ],
      messenger: [
        {
          element: ".empty-chat-container, .block",
          intro: `
            <div class="custom-intro-content">
              <img src="assets/illustrations/messages.png" alt="messenger" class="intro-image">
              <h3>Мессенджер</h3>
                      <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
              <p>В разделе "Мессенджер" можно отправлять сообщения коллегам, обмениваться файлами и создавать групповые чаты. Чтобы написать сообщение, нажмите "Создать чат", выберите сотрудника и начните переписку.</p>
              <div class="intro-footer">
                <button class="intro-button">Далее</button>
              </div>
            </div>
          `,
          position: "bottom-left",
        },
        {
          element: '.router-link[href="/articles"]',
          intro: `
            <div class="custom-intro-content">
              <img src="assets/illustrations/training-ful.png" alt="sidebar" class="intro-image">
              <h3>База знаний</h3>
                      <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
              <p>Следующий раздел «База знаний». В данном разделе собраны полезные материалы для сотрудников. Нажмите на него.</p>
            </div>
          `,
          position: "right",
        },
      ],
      articles: [
        {
          element: ".articles-page",
          intro: `
                <div class="custom-intro-content">
                  <img src="assets/illustrations/training-ful.png" alt="articles" class="intro-image">
                  <h3>База знаний</h3>
                          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
                  <p>Вы можете искать информацию по ключевым словам и категориям.</p>
                  <div class="intro-footer">
                    <button class="intro-button">Исследовать</button>
                  </div>
                </div>
              `,
          position: "left",
        },
        {
          element: ".header",
          intro: `
                <div class="custom-intro-content">
                  <img src="assets/illustrations/training-ful.png" alt="articles" class="intro-image">
                  <h3>База знаний</h3>
                          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
                  <p>Если хотите поделиться важной информацией – создайте статью! Давайте посмотрим, этот функционал.</p>
                </div>
              `,
          position: "bottom-left",
        },
        {
          element: '.has-children, .router-link[href="/statements"]',
          intro: `
                <div class="custom-intro-content">
                  <img src="assets/illustrations/statements.png" alt="sidebar" class="intro-image">
                  <h3>Заявки</h3>
                          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
                  <p>В разделе "Заявки" можно подавать различные типы запросов в разные подразделения компании, например, офис-менеджерам, бухгалтерию, HR…</p>
                </div>
              `,
          position: "right",
        },
      ],
      articles_create: [
        {
          element: ".editor",
          intro: `
                <div class="custom-intro-content">
                  <img src="/assets/illustrations/training-ful.png" alt="articles" class="intro-image">
                  <h3>База знаний</h3>
                          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
                  <p>Здесь вы можете написать свою статью, легко редактировать текст, добавлять заголовки, абзацы и форматировать содержание. Настройте шрифт, цвет и выравнивание текста для удобства.</p>
                  <div class="intro-footer">
                    <button class="intro-button">Следующий шаг</button>
                  </div>
                </div>
              `,
          position: "right",
        },
        {
          element: ".form",
          intro: `
                <div class="custom-intro-content">
       <img src="/assets/illustrations/training-ful.png" alt="articles" class="intro-image">
                  <h3>База знаний</h3>
                          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
                  <p>Параметры статьи - это место для настройки основных параметров статьи. Здесь вы можете задать название, выбрать категорию и тег, указать автора (вас или компанию). Также есть возможность загрузить обложку, чтобы сделать статью более привлекательной и информативной.</p>
                  <div class="intro-footer">
                    <button class="intro-button">Далее</button>
                  </div>
                </div>
              `,
          position: "left",
        },
      ],

      statements: [
        {
          element: ".empty-statements-container, .v-table__wrapper",
          intro: `
            <div class="custom-intro-content">
              <img src="assets/illustrations/statements.png" alt="statements" class="intro-image">
              <h3>Заявки</h3>
                      <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
              <p>При нажатии сверху на кнопку "Подать заявление" и заполнения необходимой формы вы сможете отслеживать статус своей заявки в этом же разделе.</p>
              <div class="intro-footer">
                <button class="intro-button">Понятно</button>
              </div>
            </div>
          `,
          position: "bottom",
        },
        {
          element: '.router-link[href="/calendar"]',
          intro: `
            <div class="custom-intro-content">
              <img src="assets/illustrations/calendar.png" alt="sidebar" class="intro-image">
              <h3>Переговорные</h3>
                      <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
              <p>В разделе «Переговорные» можно бронировать переговорные комнаты для деловых встреч с коллегами.</p>
            </div>
          `,
          position: "right",
        },
      ],
      calendar: [
        {
          element: ".calendar-view",
          intro: `
            <div class="custom-intro-content">
              <img src="assets/illustrations/calendar.png" alt="calendar" class="intro-image">
              <h3>Переговорные</h3>
                      <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
              <p>Календарь и табло с карточками событий. Здесь можно быстро проверить, занята ли переговорная комната в нужное время и выбрать свободный слот для вашего события. Вся информация отображается на неделю, но при необходимости можно переключиться на один день, чтобы удобнее сфокусироваться на доступных временных интервалах.</p>
              <div class="intro-footer">
                <button class="intro-button">Ознакомиться</button>
              </div>
            </div>
          `,
          position: "left",
        },
        {
          element: '.router-link[href="/users"]',
          intro: `
            <div class="custom-intro-content">
              <img src="assets/illustrations/users.png" alt="users" class="intro-image">
              <h3>Пользователи</h3>
                      <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
              <p>Раздел «Пользователи» состоит из актуализированного списка всех сотрудников компании для быстрого доступа к их контактам и информации.</p>
            </div>
          `,
          position: "right",
        },
      ],
      users: [
        {
          element: ".filters_container",
          intro: `
            <div class="custom-intro-content">
              <img src="assets/illustrations/users.png" alt="users" class="intro-image">
              <h3>Пользователи</h3>
                      <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
              <p>Чтобы найти коллегу и узнать контактную информацию о нем, воспользуйтесь адаптивным поиском в верхнем левом углу экрана</p>
              <div class="intro-footer">
                <button class="intro-button">Узнать больше</button>
              </div>
            </div>
          `,
          position: "bottom-left",
        },
        {
          element: ".filters_container",
          intro: `
            <div class="custom-intro-content">
              <img src="assets/illustrations/users.png" alt="users" class="intro-image">
              <h3>Пользователи</h3>
                      <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
              <p>Если вы не помните ФИО сотрудника, можно воспользоваться фильтрами по отделам, должностям и другим критериям</p>
               <div class="intro-footer">
                <button class="intro-button">Далее</button>
              </div>
            </div>
          `,
          position: "right",
          tooltipClass: "customTooltip header-tooltip-right",
        },
        {
          element: '.sidebar-footer-link[href="/support"]',
          intro: `
            <div class="custom-intro-content">
              <img src="assets/illustrations/support.png" alt="sidebar" class="intro-image">
              <h3>Поддержка</h3>
                      <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
              <p>Если у вас возникли вопросы, откройте раздел «Поддержка».</p>
            </div>
          `,
          position: "right",
        },
      ],
      support: [
        {
          element: ".wrapper",
          intro: `
            <div class="custom-intro-content">
              <img src="assets/illustrations/support.png" alt="support" class="intro-image">
              <h3>Поддержка</h3>
                      <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
              <p>Попробуйте найти ответ в блоке часто задаваемых вопросов или создайте заявку, если проблема требует вмешательства специалиста.</p>
              <div class="intro-footer">
                <button class="intro-button">Дальше</button>
              </div>
            </div>
          `,
          position: "bottom-left",
        },

        {
          element: ".header",
          intro: `
            <div class="custom-intro-content">
              <img src="assets/illustrations/successful_action.png" alt="header" class="intro-image">
              <h3>Завершение</h3>
                      <svg
            xmlns="http://www.w3.org/2000/svg"
            width="103"
            height="8"
            viewBox="0 0 103 8"
            fill="none"
          >
            <path
              d="M1 7C15.682 2.47226 56.4369 -3.86658 102 7"
              stroke="#89CB1F"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
              <p>Поздравляем, вы ознакомились с основными возможностями корпоративного портала! Вы всегда можете вернуться к обучению, нажав кнопку на главной странице.</p>
                 <div class="intro-footer">
                <button class="intro-button">Завершение</button>
              </div>
            </div>
          `,
          position: "bottom",
          tooltipClass: "customTooltip header-tooltip-center",
        },
      ],
    };

    this.linkSteps = {};

    // Определение маршрутов для следующих страниц
    this.nextPages = {
      home: "messenger",
      messenger: "articles",
      articles: ["articles_create", "statements"],
      articles_create: "articles",
      statement: "calendar",
      calendar: "users",
      users: "support",
      support: null,
      // Конец onboarding
    };

    // Глобальный обработчик событий для кнопок в интро
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("intro-button")) {
        this.nextStep();
      }
    });
  }

  start(page) {
    if (!page || !this.steps[page]) {
      return;
    }
    this.startPageOnboarding(page);
  }

  startPageOnboarding(page) {
    if (!this.steps[page] || this.steps[page].length === 0) {
      return;
    }

    this.isOnboarding = true;
    this.currentPage = page;
    this.currentStep = 0;

    // Инициализация IntroJS
    this.intro = introJs();

    // Настройка плавных переходов между шагами
    this.configureIntroJsTransitions();
    this.intro.setOptions({
      steps: this.steps[page],
      showBullets: false,
      showButtons: false,
      showProgress: false,
      exitOnOverlayClick: false,
      exitOnEsc: true,
      tooltipClass: "customTooltip",
      highlightClass: "customHighlight",
      showStepNumbers: false,
      disableInteraction: false,
      scrollToElement: true,
      overlayOpacity: 0.5,
      skipButton: false,
      hideTooltipOnClick: false,
    });
    // Обработчик изменения шага
    this.intro.onafterchange(() => {
      this.currentStep = this.intro._currentStep;
      this.adjustContainerStyles();
      this.markCurrentStepLinkElement([
        "/chat",
        "/articles",
        "/statements",
        "/calendar",
        "/users",
        "/support",
      ]);

      if (this.currentPage === "articles" && this.currentStep === 1) {
        const helperLayer = document.querySelector(".introjs-helperLayer");
        if (helperLayer) {
          helperLayer.classList.add("button-highlight");
        }
      } else {
        const helperLayer = document.querySelector(".introjs-helperLayer");
        if (helperLayer) {
          helperLayer.classList.remove("button-highlight");
        }
      }

      const pageTransitions = {
        home: {
          3: {
            route: "/chat",
            nextPage: "messenger",
            waitSelector: ".empty-chat-container, .block",
          },
        },
        messenger: {
          1: {
            route: "articles",
            nextPage: "articles",
            waitSelector: ".articles-page",
          },
        },
        articles: {
          1: {
            route: "articles/create",
            nextPage: "articles_create",
            waitSelector: ".editor",
          },
          2: {
            route: "/statements",
            nextPage: "statements",
            waitSelector: ".empty-statements-container, .v-table__wrapper",
          },
        },
        articles_create: {
          1: {
            route: "/articles",
            nextPage: "articles",
          },
        },
        statements: {
          1: {
            route: "/calendar",
            nextPage: "calendar",
            waitSelector: ".calendar-view",
          },
        },
        calendar: {
          1: {
            route: "/users",
            nextPage: "users",
            waitSelector: ".filters_container",
          },
        },
        users: {
          1: {
            route: "/support",
            nextPage: "support",
            waitSelector: ".wrapper",
          },
        },

        // Добавьте другие переходы по мере необходимости
      };

      const currentPageTransitions = pageTransitions[this.currentPage] || {};
      const transition = currentPageTransitions[this.currentStep];

      if (transition) {
        // Находим helperLayer и делаем его прозрачным для кликов
        const helperLayer = document.querySelector(".introjs-helperLayer");
        const helpButton = document.querySelector(".button");

        if (helperLayer || helpButton) {
          // Делаем слой прозрачным для кликов
          helperLayer.style.pointerEvents = "auto";

          // Находим элемент для перехода
          const routerLink = document.querySelector(
            `.router-link[href="${transition.route}"]`
          );

          // Добавляем обработчик клика
          const clickHandler = () => {
            // Закрываем текущий шаг intro.js
            if (this.intro) {
              this.intro.exit();
            }

            // Выполняем переход на следующую страницу
            this.navigateTo(transition.route, routerLink);

            // Ждем загрузки следующей страницы и запускаем onboarding
            this.waitForPageAndStartOnboarding(
              transition.waitSelector,
              transition.nextPage
            );
          };
          // Добавляем обработчик клика к helperLayer
          helperLayer.addEventListener("click", clickHandler, { once: true });
          helperLayer.style.cursor = "pointer";
          if (helpButton) {
            helpButton.addEventListener("click", clickHandler, { once: true });
          }
        }
      }
    });

    // Обработчик завершения
    this.intro.oncomplete(() => {
      this.completePageOnboarding(this.currentPage);
    });

    // Обработчик выхода
    this.intro.onexit(() => {
      this.isOnboarding = false;
    });

    this.intro.start();
  }

  adjustContainerStyles() {
    const currentElement = this.intro._introItems[this.currentStep].element;
    if (!currentElement || !currentElement.classList) return;

    const helperLayer = document.querySelector(".introjs-helperLayer");
    if (!helperLayer) return;

    // Check for specific container classes and apply corresponding helper classes
    if (currentElement.classList.contains("filters_container")) {
      helperLayer.classList.add("isFilterContainer");
    } else if (currentElement.classList.contains("v-table__wrapper")) {
      helperLayer.classList.add("isStatementContainer");
    }
  }
  configureIntroJsTransitions() {
    // Добавляем CSS для плавных переходов
    if (!document.getElementById("introjs-transitions-css")) {
      const style = document.createElement("style");
      style.id = "introjs-transitions-css";
      style.textContent = `
        .introjs-helperLayer {
          transition: all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
          opacity: 0;
        }
        
        @keyframes helperLayerFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        .introjs-tooltip {
          transition: opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), 
                      transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), 
                      left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), 
                      top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
        }
        
        .introjs-overlay {
          transition: opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Сохраняем оригинальный метод перехода между шагами
    const originalShowElement = this.intro._showElement;

    if (originalShowElement && !this.intro._transitionsConfigured) {
      this.intro._transitionsConfigured = true;

      // Переопределяем метод для плавного перехода
      this.intro._showElement = function (targetElement) {
        const currentTooltip = document.querySelector(".introjs-tooltip");
        const helperLayer = document.querySelector(".introjs-helperLayer");

        // Add transitioning class to helperLayer
        if (helperLayer) {
          helperLayer.classList.add("introjs-helperLayer--transitioning");
        }

        // Если есть текущий тултип, сделаем его плавное исчезновение
        if (currentTooltip) {
          // Сохраняем текущее положение тултипа
          const rect = currentTooltip.getBoundingClientRect();
          currentTooltip.style.position = "fixed";
          currentTooltip.style.left = rect.left + "px";
          currentTooltip.style.top = rect.top + "px";

          // Добавляем класс для анимации исчезновения
          currentTooltip.style.opacity = "0";
          currentTooltip.style.transform = "scale(0.8)";

          // Задержка перед показом нового элемента
          setTimeout(() => {
            originalShowElement.call(this, targetElement);

            // Анимируем появление нового тултипа
            setTimeout(() => {
              const newTooltip = document.querySelector(".introjs-tooltip");
              if (newTooltip) {
                newTooltip.style.opacity = "0";
                newTooltip.style.transform = "scale(0.8)";

                setTimeout(() => {
                  newTooltip.style.opacity = "1";
                  newTooltip.style.transform = "scale(1)";

                  // Remove transitioning class after animation completes
                  setTimeout(() => {
                    const helperLayer = document.querySelector(
                      ".introjs-helperLayer"
                    );
                    if (helperLayer) {
                      helperLayer.classList.remove(
                        "introjs-helperLayer--transitioning"
                      );
                    }
                  }, 500); // Match this with the transition duration
                }, 50);
              }
            }, 50);
          }, 300);
        } else {
          originalShowElement.call(this, targetElement);

          // Remove transitioning class after animation completes
          setTimeout(() => {
            const helperLayer = document.querySelector(".introjs-helperLayer");
            if (helperLayer) {
              helperLayer.classList.remove(
                "introjs-helperLayer--transitioning"
              );
            }
          }, 500); // Match this with the transition duration
        }
      };
    }
  }
  nextStep() {
    if (this.intro) {
      if (this.currentPage === "articles_create" && this.currentStep === 1) {
        // Exit the current intro
        this.intro.exit();
        // Очищаем элементы IntroJS перед навигацией
        this.clearIntroJsElements();
        // Navigate to the articles page
        this.navigateTo("/articles");
        setTimeout(() => {
          this.startPageOnboarding("articles");
          // Skip to the second step since we're continuing from articles_create
          if (this.intro) this.intro.goToStep(3);
        }, 500);
        return;
      }
      if (this.currentPage === "statements" && this.currentStep === 0) {
        const hasChildrenElement = document.querySelector(".has-children");
        if (hasChildrenElement) {
          // Click on the has-children element
          hasChildrenElement.click();

          // Wait for DOM to update after the click
          setTimeout(() => {
            // Refresh the intro to ensure it targets the correct elements
            if (this.intro) {
              // Get the current steps
              const currentSteps = this.steps[this.currentPage];

              // Update the intro with refreshed steps
              this.intro.setOptions({
                steps: currentSteps,
              });

              // Now proceed to the next step
              this.intro.nextStep();
            }
          }, 500); // Give enough time for DOM changes to complete

          return; // Return early to prevent the immediate nextStep() call below
        }
      }

      this.intro.nextStep();
    }
  }

  completePageOnboarding() {
    const introElements = document.querySelectorAll(
      ".introjs-helperLayer, .introjs-showElement, .introjs-fixParent, .introjs-overlay, .introjs-tooltip"
    );
    introElements.forEach((el) => {
      el.classList.add("introjs-hidden");
    });
    this.isOnboarding = false;
    this.currentStep = 0;
    this.intro = null;
  }

  // Добавьте этот метод для очистки элементов IntroJS
  clearIntroJsElements() {
    // Добавляем класс для предотвращения мерцания при переходе
    document.body.classList.add("introjs-navigationChanging");

    // Находим все элементы IntroJS
    const introElements = document.querySelectorAll(
      ".introjs-helperLayer, .introjs-showElement, .introjs-fixParent, .introjs-overlay, .introjs-tooltip"
    );

    // Добавляем класс hidden для плавного исчезновения
    introElements.forEach((el) => {
      el.classList.add("introjs-hidden");
    });

    // Удаляем элементы после завершения анимации
    setTimeout(() => {
      introElements.forEach((el) => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });

      // Удаляем класс после завершения перехода
      document.body.classList.remove("introjs-navigationChanging");
    }, 300);

    // Удаляем все кастомные выделения
    const customHighlights = document.querySelectorAll(".customHighlight");
    customHighlights.forEach((el) => {
      el.classList.remove("customHighlight");
    });
  }

  waitForElement(selector) {
    return new Promise((resolve, reject) => {
      // Проверяем, существует ли селектор
      if (!selector) {
        reject(new Error("Empty selector provided to waitForElement"));
        return;
      }

      // Проверяем, существует ли элемент уже
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      // Устанавливаем таймаут для предотвращения бесконечного ожидания
      const timeout = setTimeout(() => {
        observer.disconnect();
        reject(
          new Error(
            `Element with selector "${selector}" not found after timeout`
          )
        );
      }, 10000); // 10 секунд таймаут

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          clearTimeout(timeout);
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }
  // Улучшенная версия метода, которая работает с текущим шагом IntroJS
  markCurrentStepLinkElement(hrefArray) {
    if (!this.intro || !Array.isArray(hrefArray) || !hrefArray.length) {
      return;
    }

    // Получаем текущий элемент из IntroJS
    const currentElement = this.intro._introItems[this.currentStep].element;

    // Проверяем, является ли элемент ссылкой или содержит ссылку
    if (currentElement) {
      let targetAnchor;

      // Если сам элемент - ссылка
      if (currentElement.tagName === "A") {
        targetAnchor = currentElement;
      } else {
        // Ищем ссылку внутри элемента
        targetAnchor = currentElement.querySelector("a");
      }
      const helperLayer = document.querySelector(".introjs-helperLayer");
      // Если нашли ссылку и её href в нашем массиве
      if (
        targetAnchor &&
        hrefArray.includes(targetAnchor.getAttribute("href"))
      ) {
        // Находим introjs-helperLayer для текущего шага

        if (helperLayer) {
          helperLayer.classList.add("isLink");
          helperLayer.style.cursor = "pointer";
        }
      } else {
        helperLayer.classList.remove("isLink");
        helperLayer.style.cursor = "";
      }
    }
  }
  navigateTo(route, routerLink) {
    this.clearIntroJsElements();

    // Если есть активный intro, завершаем его
    if (this.intro) {
      this.intro.exit();
      this.intro = null;
    }

    // Используем window.router или глобальный роутер, если доступен
    if (window.router) {
      window.router.push(route);
    } else if (routerLink) {
      // Если роутер недоступен, просто кликаем на ссылку
      routerLink.click();
    } else {
      // Если ничего не сработало, пробуем использовать window.location
      window.location.href = route;
    }
  }

  waitForPageAndStartOnboarding(waitSelector, nextPage) {
    setTimeout(async () => {
      try {
        if (!waitSelector) {
          this.startPageOnboarding(nextPage);
          return;
        }

        // Ждем, пока появится элемент на следующей странице
        await this.waitForElement(waitSelector);

        if (nextPage === "messenger") {
          setTimeout(() => {
            this.startPageOnboarding(nextPage);
          }, 500); // Задержка в 1 секунду для полной загрузки messenger
        } else {
          this.startPageOnboarding(nextPage);
        }
      } catch (error) {
        // Попытка запустить onboarding даже если элемент не найден
        this.startPageOnboarding(nextPage);
      }
    }, 500);
  }
  // Проверка, нужно ли продолжить onboarding на конкретной странице
  shouldContinueOnboarding(page) {
    return this.isOnboarding && this.steps[page] && this.steps[page].length > 0;
  }

  // Геттеры для доступа к состоянию
  getIsOnboarding() {
    return this.isOnboarding;
  }

  getCurrentStep() {
    return this.currentStep;
  }

  // Метод для установки роутера извне
  setRouter(router) {
    window.router = router;
  }

  // Метод для принудительного завершения onboarding
  endOnboarding() {
    if (this.intro) {
      this.intro.exit();
    }
    this.isOnboarding = false;
    this.currentStep = 0;
  }
}

const onboardingService = new OnboardingService();
export { onboardingService };
