import { withModuleId } from "@/lib/course-lesson-builder";

export const moduleSixTasks = withModuleId("6", [
  {
    id: "6.1",
    title: "Загрузка файлов",
    summary: "Загрузить файл через setInputFiles и проверить UI-результат.",
    context: "Upload взаимодействует с input[type=file], но тестовый файл должен быть контролируемым и храниться в каталоге fixtures.",
    theory: ["setInputFiles задаёт файл напрямую без системного file picker.", "После выбора проверьте видимое имя или сообщение о загрузке."],
    steps: ["Откройте upload exercise на Expand Testing.", "Создайте небольшой fixture файл внутри проекта.", "Найдите file input и передайте путь через setInputFiles.", "Проверьте filename или подтверждение загрузки и очистите временный результат."],
    files: ["tests/fixtures/sample.txt", "tests/labs/upload.spec.ts"],
definitionOfDone: ["Файл выбран через setInputFiles.", "UI подтверждает файл по имени или сообщению.", "Временные файлы очищаются."],
    hints: ["Не автоматизируйте native file picker.", "Стройте путь от testDir/fixtures, а не от текущего shell cwd.", "После выбора проверьте имя в UI или значение input.files."],
    commands: ["npm run test -- tests/labs/upload.spec.ts"],
  },
  {
    id: "6.2",
    title: "Скачивание файлов",
    summary: "Перехватить download event, сохранить файл и проверить его содержимое.",
    context: "Скачивание начинается асинхронно после действия UI. Ожидание нужно создать до клика, иначе событие можно пропустить.",
    theory: ["page.waitForEvent('download') следует зарегистрировать до триггера.", "testInfo.outputPath даёт изолированную папку артефактов теста."],
    steps: ["Откройте download exercise на Expand Testing.", "Создайте ожидание download event перед кликом.", "Сохраните файл в testInfo.outputPath.", "Проверьте suggested filename и ожидаемый фрагмент содержимого."],
    files: ["tests/labs/download.spec.ts"],
definitionOfDone: ["Download event перехвачен без гонки.", "Файл сохранён в outputPath.", "Имя и содержимое файла проверены без системного абсолютного пути."],
    hints: ["Сначала создайте Promise ожидания, потом выполняйте click.", "Используйте download.suggestedFilename().", "Сохраните через download.saveAs(testInfo.outputPath(filename)) и прочитайте node:fs."],
    commands: ["npm run test -- tests/labs/download.spec.ts"],
  },
  {
    id: "6.3",
    title: "Диалоговые окна браузера",
    summary: "Обработать alert, confirm или prompt до их вызова.",
    context: "Native dialog блокирует страницу до ответа. Handler, установленный после действия, не успеет обработать уже открытое окно.",
    theory: ["page.on('dialog') устанавливается до действия-триггера.", "Dialog предоставляет type/message и методы accept/dismiss."],
    steps: ["Откройте dialog exercise на SUT.", "Зарегистрируйте handler до click.", "Проверьте type и message и примите/отклоните dialog согласно сценарию.", "Проверьте результат на странице."],
    files: ["tests/labs/dialogs.spec.ts"],
definitionOfDone: ["Dialog handler установлен до триггера.", "Проверены ожидаемый type/message.", "После accept/dismiss проверяется UI."],
    hints: ["Подпишитесь на dialog event до click.", "Сохраните dialog, чтобы проверить message.", "Вызовите правильный accept/dismiss и дождитесь результата страницы."],
    commands: ["npm run test -- tests/labs/dialogs.spec.ts"],
  },
  {
    id: "6.4",
    title: "Работа с iframe",
    summary: "Найти и проверить элемент внутри frameLocator.",
    context: "Iframe имеет отдельный document context. Верхнеуровневый locator не должен зависеть от внутренней вложенности frame.",
    theory: ["frameLocator создаёт scoped locator внутри iframe.", "Для frame и внутренних элементов действуют обычные web-first assertions."],
    steps: ["Откройте iframe exercise на Expand Testing.", "Найдите iframe по title, role или устойчивому атрибуту.", "Получите внутренний control через frameLocator.", "Выполните действие и проверьте результат."],
    files: ["tests/labs/iframe.spec.ts"],
definitionOfDone: ["Внутренний элемент найден через frameLocator.", "Frame выбран устойчивым локатором.", "Проверено ожидаемое состояние страницы."],
    hints: ["Сначала локализуйте сам iframe в верхнем document.", "Затем стройте locator внутри frameLocator.", "Не используйте nth(frame), если доступен title или test id."],
    commands: ["npm run test -- tests/labs/iframe.spec.ts"],
  },
  {
    id: "6.5",
    title: "Новые вкладки и popup",
    summary: "Перехватить новую Page до клика, проверить её и закрыть.",
    context: "Popup создаёт отдельную Page в BrowserContext. Если начать ожидание после клика, быстрое событие можно пропустить.",
    theory: ["context.waitForEvent('page') наблюдает появление вкладки.", "Promise события создаётся до действия, открывающего страницу."],
    steps: ["Откройте popup exercise в пределах SUT.", "Подготовьте ожидание context page event.", "Нажмите trigger и дождитесь новой Page.", "Проверьте title/URL и закройте popup через finally."],
    files: ["tests/labs/popup.spec.ts"],
definitionOfDone: ["Новая вкладка перехвачена до клика.", "Проверены target page и её состояние.", "Popup закрывается даже при ошибке assertion."],
    hints: ["Ожидание и click удобно объединить в Promise.all.", "Сохраните результат ожидания в переменную Page.", "Поместите проверку в try, а page.close в finally."],
    commands: ["npm run test -- tests/labs/popup.spec.ts"],
  },
  {
    id: "6.6",
    title: "Shadow DOM",
    summary: "Найти элемент web component и понять ограничение closed shadow root.",
    context: "Shadow DOM инкапсулирует внутреннюю разметку. Playwright проходит open roots автоматически, а closed root намеренно скрывает внутреннюю реализацию.",
    theory: ["Локаторы Playwright работают с элементами open shadow root.", "XPath не является безопасным способом обхода closed shadow root."],
    steps: ["Откройте Shadow DOM exercise на SUT.", "Найдите custom element и доступный control.", "Используйте role/label locator, не длинный внутренний CSS path.", "Отметьте, какой элемент недоступен из-за closed root и почему."],
    files: ["tests/labs/shadow-dom.spec.ts"],
definitionOfDone: ["Элемент open shadow root найден устойчивым locator.", "Closed root описан как контрактное ограничение, без brittle hacks.", "Проверено наблюдаемое поведение компонента."],
    hints: ["Начните с публичной роли/имени control.", "Не зависите от закрытой внутренней структуры.", "Если root closed, проверяйте публичное поведение custom element."],
    commands: ["npm run test -- tests/labs/shadow-dom.spec.ts"],
  },
  {
    id: "6.7",
    title: "Геолокация и разрешения",
    summary: "Создать browser context с координатами и проверить UI-реакцию.",
    context: "Геолокация принадлежит browser context, поэтому coordinates и permissions задаются до открытия страницы.",
    theory: ["browser.newContext принимает geolocation.", "geolocation permission выдаётся origin тестируемого сайта."],
    steps: ["Определите geo exercise внутри Expand Testing.", "Создайте отдельный context с заданными координатами.", "Выдайте geolocation permission только для SUT origin.", "Откройте страницу и проверьте данные, показанные интерфейсом."],
    files: ["tests/labs/geolocation.spec.ts"],
definitionOfDone: ["Context создан с явными координатами.", "Permission ограничен origin SUT.", "UI показывает соответствующий результат."],
    hints: ["Передайте coordinates при newContext.", "Используйте context.grantPermissions до навигации.", "Не добавляйте внешние geo сервисы: работайте только с утверждённой SUT."],
    commands: ["npm run test -- tests/labs/geolocation.spec.ts"],
  },
  {
    id: "6.8",
    title: "Перехват и мокинг сети",
    summary: "Подменить API ответы через page.route и проверить success/error UI.",
    context: "Route interception позволяет воспроизводимо проверять loading, success и failure состояния без зависимости от нестабильного внешнего ответа.",
    theory: ["page.route перехватывает matching request до сети.", "route.fulfill задаёт status, headers и body контролируемого ответа."],
    steps: ["Выберите Notes App API request в рамках текущей SUT.", "Установите route handler до навигации или действия.", "Подмените успешный ответ и проверьте UI.", "Подмените 500 и проверьте состояние ошибки.", "Ограничьте intercept нужным endpoint и очистите его после теста."],
    files: ["tests/labs/network-mocking.spec.ts"],
definitionOfDone: ["Запрос перехвачен до отправки.", "Success и error responses проверяются отдельно.", "Новые внешние домены не добавлены."],
    hints: ["Сначала найдите запрос через network panel или request event.", "Установите route до действия, вызывающего запрос.", "Используйте fulfill с минимальным валидным body и разными status codes."],
    commands: ["npm run test -- tests/labs/network-mocking.spec.ts"],
  },
  {
    id: "6.9",
    title: "Visual Regression: Notes App и скриншоты",
    summary: "Использовать toHaveScreenshot() для сравнения визуального состояния, настроить maxDiffPixels и маскирование динамических элементов.",
    context: "В реальных проектах важна стабильность UI, поэтому сравнение скриншотов помогает обнаружить регрессии.",
    theory: [
      "toHaveScreenshot создает baseline и сравнивает с текущим экраном.",
      "maxDiffPixels задаёт допустимое отклонение, mask позволяет скрыть меняющиеся части."
    ],
    steps: [
      "Запустите тест, вызовите expect(page).toHaveScreenshot({ maxDiffPixels: 10, mask: [locator] }).",
      "Сохраните baseline в playwright-report/screenshots.",
      "Смоделируйте изменение UI и убедитесь, что тест падает при превышении diff."
    ],
    files: ["tests/ui/visual-regression.spec.ts"],
    definitionOfDone: [
      "baseline сохранён, тест сравнивает текущий скриншот и проходит при небольших различиях.",
      "При изменении UI тест корректно фиксирует регрессию."
    ],
    hints: [
      "Исключайте динамические элементы (таймер, даты) через mask.",
      "Настройте playwright config для reuseExistingScreenshots при CI.",
      "Обновляйте baseline командой `--update-snapshots` после осознанных изменений UI."
    ],
    commands: ["npm run test -- tests/ui/visual-regression.spec.ts"]
  },
  {
    id: "6.10",
    title: "Эмуляция сред: Мобильные девайсы и троттлинг сети",
    summary: "Проверить Notes App на мобильном устройстве через эмуляцию Playwright.",
    context: "Начнём с воспроизводимой мобильной проверки реального интерфейса Notes App, без неподдерживаемой искусственной задержки сети.",
    theory: [
      "Playwright поддерживает готовые device descriptors (iPhone, Pixel).",
      "Новый browser context изолирует настройки мобильного теста."
    ],
    steps: [
      "Создайте контекст с устройством: await browser.newContext({ ...devices['iPhone 13'] }).",
      "Откройте /notes/app в новой странице context.",
      "Проверьте видимость Login и Create an account, затем закройте context."
    ],
    files: ["tests/ui/mobile-throttle.spec.ts"],
    definitionOfDone: [
      "Тесты проходят на эмулированном мобильном устройстве.",
      "Проверка использует только Notes App на Expand Testing."
    ],
    hints: [
      "Используйте готовые константы из playwright.devices.",
      "Закрывайте созданный context после теста.",
      "Проверяйте viewport и userAgent, чтобы убедиться, что эмуляция применилась."
    ],
    commands: ["npm run test -- tests/ui/mobile-throttle.spec.ts"]
  },
  {
    id: "6.11",
    title: "Drag-and-Drop на Expand Testing",
    summary: "Выполнить drag-and-drop на специальной странице Expand Testing.",
    context: "Системный clipboard зависит от разрешений ОС и не нужен для этой темы. Используем воспроизводимую учебную страницу /drag-and-drop.",
    theory: [
      "page.dragAndDrop позволяет переместить элемент на целевой.",
      "Перед переносом нужно проверить, что источник и цель видимы."
    ],
    steps: [
      "Откройте явной навигацией /drag-and-drop.",
      "Найдите source и target на этой странице.",
      "Выполните await page.dragAndDrop(source, target).",
      "Подтвердите, что элемент переместился (изменился DOM)."
    ],
    files: ["tests/lab/drag-and-drop.spec.ts"],
    definitionOfDone: [
      "dragAndDrop перемещает элемент и проверяется его новое положение."
    ],
    hints: [
      "Убедитесь, что элементы имеют уникальные селекторы для drag.",
      "Проверьте видимый результат после drop через expect.",
      "Страница использует стабильные id `column-a` и `column-b`, потому что для этих зон нет доступных имён."
    ],
    commands: ["npm run test -- tests/lab/drag-and-drop.spec.ts"]
  }
]);
