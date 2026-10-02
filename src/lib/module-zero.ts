export type LessonTerm = {
  term: string;
  definition: string;
  analogy?: string;
};

export type CodeExample = {
  title: string;
  description?: string;
  language: "json" | "typescript" | "bash" | "yaml" | string;
  code: string;
};

export type LessonCodeSnippet = {
  file: string;
  language: CodeExample["language"];
  code: string;
  description: string;
};

export type LessonStep =
  | string
  | {
      instruction: string;
      snippets?: LessonCodeSnippet[];
    };

export type CourseLesson = {
  moduleId: string;
  id: string;
  slug: string;
  title: string;
  summary: string;
  reuseHint?: string;
  terms?: LessonTerm[];
  context: string;
  theory: string[];
  steps: LessonStep[];
  files: string[];
  definitionOfDone: string[];
  hints: [string, string, string];
  downloadPath?: string;
  externalLink?: { href: string; label: string };
  video?: {
    src: string;
    title: string;
    description: string;
  };
  codeExamples?: CodeExample[];
  solutionExamples?: CodeExample[];
  commandGroups?: {
    title: string;
    description: string;
    commands: string[];
  }[];
  commands?: string[];
};

export const moduleZeroTasks: CourseLesson[] = [
  {
    moduleId: "0",
    id: "0.1",
    slug: "0-1",
    title: "Первый запуск автоматизации",
    summary:
      "Увидеть работающий браузерный сценарий своими глазами ещё до настройки проекта.",
    video: {
      src: "/course-media/lesson-0-1.mp4",
      title: "Видео к уроку 0.1",
      description:
        "Посмотрите вводное видео перед первым запуском автоматизации.",
},
    context:
      "До того как настраивать окружение, терминал и конфигурационные файлы, важно увидеть конечную цель: робот самостоятельно открывает настоящий браузер, переходит на страницу приложения и проверяет результат. Готовый демонстрационный скрипт позволяет ощутить магию автоматизации в первые же минуты курса.",
    terms: [
      {
        term: "Браузерная автоматизация",
        definition:
          "Управление настоящим браузером с помощью программного кода без необходимости кликать мышью вручную.",
        analogy:
          "Робот-пылесос: вы нажимаете одну кнопку, а он сам объезжает всю комнату и убирает пыль по заданному маршруту.",
},
      {
        term: "Терминал",
        definition:
          "Окно, в которое мы вводим короткие текстовые команды, чтобы попросить компьютер выполнить действие.",
        analogy:
          "Стойка выдачи в кафе: вы ясно называете заказ, а кухня его выполняет.",
      },
      {
        term: "npx",
        definition:
          "Команда npm, которая временно запускает нужный инструмент, даже если он ещё не установлен в проекте.",
        analogy:
          "Прокат инструмента: можно взять дрель для одной задачи, не покупая целую мастерскую.",
      },
      {
        term: "Chromium",
        definition:
          "Быстрый браузерный движок с открытым исходным кодом, на базе которого работают Google Chrome, Microsoft Edge и Playwright.",
        analogy:
          "Двигатель автомобиля на испытательном стенде: он выполняет всю тяговую работу, даже если с машины сняты декоративные панели кузова.",
},
    ],
    theory: [
      "Сценарий автоматизации управляет настоящим браузером и ожидает наблюдаемого состояния элементов страницы.",
      "Команда в терминале выполняется только после нажатия Enter; если команда не найдена, сначала проверьте написание и текущую папку.",
      "Скрипт demo-0.1.mjs является автономным (standalone): его можно запустить в любой пустой папке без сложной настройки проекта.",
    ],
    steps: [
      "Скачайте файл демо-скрипта demo-0.1.mjs по кнопке ниже в отдельную пустую папку.",
      "Откройте терминал в этой папке.",
      "Если Chromium ещё не установлен, установите браузерный бинарник командой npx --yes --package=playwright playwright install chromium.",
      "Запустите демонстрационный скрипт командой npx --yes --package=playwright --call \"node demo-0.1.mjs\".",
      "Наблюдайте, как на экране автоматически открывается окно браузера, переходит на сайт и закрывается.",
      "Сверьте появление зеленого статуса и заголовка страницы в консоли терминала: это означает, что команда завершилась успешно.",
    ],
    files: ["demo-0.1.mjs — готовый вводный сценарий (менять его не нужно)."],
    definitionOfDone: [
      "Браузер открыл сайт Expand Testing и выполнил сценарий.",
      "Заголовок страницы успешно прочитан, окно браузера закрылось без ошибок.",
      "В терминале отобразился зелёный статус: «Демонстрационный сценарий выполнен».",
    ],
    hints: [
      "Убедитесь, что в терминале вы находитесь ровно в той папке, куда сохранили файл demo-0.1.mjs (проверьте командой ls или dir).",
      "Для установки браузера используйте официальную команду Playwright через npx без глобальной установки.",
      "Успешный запуск выводит в консоль строку «Демонстрационный сценарий выполнен успешно!».",
    ],
    downloadPath: "/demos/demo-0.1.mjs",
    commands: [
      "npx --yes --package=playwright playwright install chromium",
      "npx --yes --package=playwright --call \"node demo-0.1.mjs\"",
    ],
    solutionExamples: [
      {
        title: "demo-0.1.mjs",
        description:
          "Автономный демонстрационный скрипт первого запуска автоматизации на Playwright.",
        language: "javascript",
        code: `// Это готовый файл: пока не меняйте его.
import { existsSync, realpathSync } from "node:fs";
import { delimiter, dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const executableNames =
  process.platform === "win32"
    ? ["playwright.cmd", "playwright.exe", "playwright"]
    : ["playwright"];

function findPlaywrightEntry() {
  for (const directory of process.env.PATH.split(delimiter)) {
    for (const executableName of executableNames) {
      const executable = join(directory, executableName);
      if (!existsSync(executable)) continue;

      const resolvedExecutable = realpathSync(executable);
      const candidates = [
        join(dirname(resolvedExecutable), "index.mjs"),
        resolve(directory, "..", "playwright", "index.mjs"),
      ];
      const entry = candidates.find(existsSync);
      if (entry) return entry;
    }
  }

  throw new Error("Запустите файл командой npx --package=playwright.");
}

const { chromium } = await import(pathToFileURL(findPlaywrightEntry()).href);
const baseURL = new URL(
  process.env.BASE_URL ?? "https://practice.expandtesting.com",
).toString();
const browser = await chromium.launch({ headless: false });

try {
  const page = await browser.newPage();
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading").first().waitFor({ state: "visible" });
  console.log("✓ Демонстрационный сценарий выполнен");
  console.log(\`Страница: \${await page.title()}\`);
} finally {
  await browser.close();
}`,
},
    ],
  },
  {
    moduleId: "0",
    id: "0.2",
    slug: "0-2",
    title: "Создание и клонирование репозитория",
    summary:
      "Создать собственный GitHub-репозиторий из шаблона и открыть в редакторе именно его корневую папку.",
    context:
      "Весь код автотестов должен принадлежать ученику и сохраняться в облаке. При выполнении команды `git clone <URL>` Git создает внутри текущей папки новую подпапку с именем репозитория. Именно эта внутренняя папка является корнем проекта: в ней лежат package.json, README.md и скрытая служебная папка .git. Открытие родительской папки вместо корня клона — частая ошибка новичков.",
    terms: [
      {
        term: "Репозиторий-шаблон (Template Repository)",
        definition:
          "Готовый образец проекта на GitHub, с которого можно в один клик создать свой собственный чистый репозиторий с сохранением структуры.",
        analogy:
          "Типографский бланк договора: вы берете готовый пустой бланк и вписываете свои данные, не портя исходный шаблон.",
},
      {
        term: "Git",
        definition:
          "Программа, которая хранит историю изменений файлов проекта и связывает локальную копию с удалённым репозиторием.",
        analogy:
          "Журнал учёта в библиотеке: видно, какую книгу меняли, когда и где лежит её сохранённая копия.",
      },
      {
        term: "Клонирование (git clone)",
        definition:
          "Команда Git, скачивающая полную копию удаленного репозитория из облака на жесткий диск вашего компьютера.",
        analogy:
          "Получение комплекта дубликатов ключей и переезд в новую квартиру со всеми своими вещами.",
},
      {
        term: "Корень проекта (Root Directory)",
        definition:
          "Главная рабочая папка проекта, содержащая файл package.json и скрытую директорию .git.",
        analogy:
          "Прихожая дома: все двери в комнаты открываются только из неё; стоя на улице перед домом, открыть шкаф в спальне невозможно.",
},
    ],
    theory: [
      "Кнопка 'Use this template' на GitHub создает чистую копию файлов без чужой истории коммитов шаблона.",
      "Команда git clone <URL> создает новую подпапку; после клонирования нужно сразу перейти внутрь: cd <имя-папки>.",
      "Команда git remote -v показывает URL связанного удаленного репозитория и работает только из папки с .git внутри.",
      "GitHub используется только для хранения вашего кода; все будущие тестовые сценарии обращаются к Expand Testing.",
    ],
    steps: [
      "В терминале выполните git --version. Если вместо номера версии видите ошибку, установите Git с официального сайта и повторите команду.",
      "Откройте ссылку на starter-template на GitHub и нажмите Use this template → Create a new repository.",
      "Задайте публичное имя репозитория, например playwright-notes-automation, и подтвердите создание.",
      "Скопируйте HTTPS clone URL вашего созданного репозитория.",
      "В терминале выполните git clone <ваш-URL>.",
      "Сразу перейдите внутрь созданной папки: cd playwright-notes-automation.",
      "Проверьте корень проекта командами pwd, ls -la и git rev-parse --show-toplevel (должны быть видны package.json и папка .git).",
      "Откройте в VS Code именно эту папку клона (File → Open Folder).",
      "Проверьте привязку к вашему GitHub командой git remote -v.",
    ],
    files: [
      "Корень клонированного проекта: README.md, package.json, скрытая папка .git.",
      "Родительская папка-контейнер (сама репозиторием не является).",
    ],
    definitionOfDone: [
      "Собственный репозиторий создан на GitHub из starter-template.",
      "Репозиторий успешно клонирован на локальный компьютер.",
      "В IDE открыта корневая папка клона, содержащая package.json и .git.",
      "Команда git remote -v выводит HTTPS URL репозитория ученика.",
    ],
    hints: [
      "Создание копии на GitHub и клонирование на компьютер — это два последовательных шага.",
      "Если терминал пишет fatal: not a git repository, значит вы забыли выполнить cd внутрь созданной папки.",
      "Проверьте наличие файла package.json через команду ls: он должен лежать прямо в текущей папке.",
    ],
    externalLink: {
      href: "https://github.com/Alexsander13/playwright-lab-template",
      label: "Открыть starter-template на GitHub",
    },
    commands: [
      "git --version",
      "git clone <URL-вашего-репозитория>",
      "cd <имя-созданной-папки-репозитория>",
      "pwd",
      "ls -la",
      "git rev-parse --show-toplevel",
      "git remote -v",
    ],
    solutionExamples: [
      {
        title: "Проверка структуры корня репозитория в терминале",
        description:
          "Пример ожидаемого вывода команд проверки корня проекта.",
        language: "bash",
        code: `$ cd playwright-notes-automation
$ git rev-parse --show-toplevel
/Users/alex/Documents/playwright-notes-automation

$ git remote -v
origin  https://github.com/YourUsername/playwright-notes-automation.git (fetch)
origin  https://github.com/YourUsername/playwright-notes-automation.git (push)

$ ls -la
drwxr-xr-x   .git
-rw-r--r--   package.json
-rw-r--r--   package-lock.json
-rw-r--r--   README.md`,
},
    ],
  },
  {
    moduleId: "0",
    id: "0.3",
    slug: "0-3",
    title: "Окружение и первый запуск Playwright",
    summary:
      "Установить зависимости проекта и браузер Chromium, выполнить первый запуск теста.",
    context:
      "Для профессиональной работы автотестов нужны три взаимосвязанных слоя: Node.js (движок исполнения скриптов), npm (менеджер библиотек) и Playwright (браузерные бинарники). Успешная установка одного слоя не гарантирует наличие остальных. В шаблоне package-lock.json уже подготовлен: команда npm ci быстро и строго разворачивает зависимости.",
    terms: [
      {
        term: "Node.js",
        definition:
          "Серверная среда выполнения, позволяющая запускать код на JavaScript и TypeScript вне браузера прямо на компьютере.",
        analogy:
          "Электрическая розетка в мастерской: пока станок не включен в сеть, он не сдвинется с места.",
},
      {
        term: "Пакетный менеджер npm",
        definition:
          "Инструмент для установки, обновления и управления сторонними библиотеками и зависимостями проекта.",
        analogy:
          "Служба доставки из строительного гипермаркета: привозит ровно те инструменты и материалы, которые вы указали в заказе.",
},
      {
        term: "Команда npm ci (Clean Install)",
        definition:
          "Команда строгой и чистой установки библиотек в точном соответствии с файлом package-lock.json без самовольного изменения версий.",
        analogy:
          "Сборка мебели строго по заводской описи деталей: каждый винтик берется ровно того размера, который заложил инженер.",
},
      {
        term: "Браузерный бинарник",
        definition:
          "Исполняемый файл браузера, который Playwright запускает для теста; это не то же самое, что библиотека Playwright в package.json.",
        analogy:
          "Чертёж и настоящий велосипед: библиотека объясняет, как управлять, а бинарник — это сам велосипед, на котором можно ехать.",
      },
    ],
    theory: [
      "package.json описывает имя проекта и список необходимых инструментов.",
      "package-lock.json фиксирует точные версии пакетов вплоть до цифры билда; npm ci устанавливает именно их.",
      "Пакет @playwright/test и браузерные бинарники (Chromium) скачиваются отдельными шагами.",
      "Папка node_modules создаётся автоматически и не добавляется в Git: её можно восстановить командой npm ci.",
    ],
    steps: [
      "Проверьте версию Node.js и npm в терминале: node -v и npm -v (рекомендуется Node.js 20+ LTS).",
      "Находясь в корне клонированного проекта, выполните чистую установку зависимостей: npm ci.",
      "Установите браузерный бинарник Chromium: npx playwright install chromium.",
      "Запустите базовый пример теста из шаблона: npx playwright test.",
      "Убедитесь, что тест прошел успешно и терминал вывел зеленый статус прогона.",
    ],
    files: [
      "node_modules/ — папка с установленными библиотеками (не коммитится в Git).",
      "package-lock.json — строгий список версий пакетов.",
      "tests/example.spec.ts — базовый ознакомительный тест.",
    ],
    definitionOfDone: [
      "Node.js и npm доступны в командной строке.",
      "Команда npm ci завершилась успешно и создала папку node_modules.",
      "Chromium установлен, команда npx playwright test завершилась со статусом passed.",
    ],
    hints: [
      "Все команды выполняйте строго из корневой папки клонированного репозитория.",
      "Если npm ci ругается на отсутствие lock-файла, проверьте текущую папку через pwd: возможно, вы не перешли внутрь клона.",
      "Если Playwright пишет Executable doesn't exist, повторите команду npx playwright install chromium.",
    ],
    commands: [
      "node -v",
      "npm -v",
      "npm ci",
      "npx playwright install chromium",
      "npx playwright test",
    ],
    solutionExamples: [
      {
        title: "Последовательность команд инициализации окружения",
        description:
          "Шаги проверки версий, чистой установки зависимостей и первого запуска тестов.",
        language: "bash",
        code: `$ node -v
v20.18.0

$ npm -v
10.8.2

$ npm ci
added 120 packages in 3s

$ npx playwright install chromium
Downloading Chromium 134.0 (playwright build v1155) ...

$ npx playwright test
Running 1 test using 1 worker
  1 passed (1.2s)`,
},
    ],
  },
  {
    moduleId: "0",
    id: "0.4",
    slug: "0-4",
    title: "Базовая конфигурация Playwright",
    summary:
      "Настроить playwright.config.ts, tsconfig.json и удобные короткие команды npm scripts.",
    context:
      "Playwright работает, но запускать его каждый раз длинными командами с кучей флагов неудобно. На этом шаге мы приведем проект в идеальный рабочий порядок: добавим короткие команды в package.json, настроим строгую проверку TypeScript и подключим генерацию удобного визуального HTML-отчета. Все упражнения курса выполняются на учебном стенде Expand Testing: он специально создан для тест-автоматизации, доступен каждому ученику и даёт реальные страницы, формы и API без необходимости создавать собственный сайт.",
    terms: [
      {
        term: "Скрипты npm (npm scripts)",
        definition:
          "Короткие понятные псевдонимы для сложных команд в блоке 'scripts' файла package.json (например, npm run test вместо npx playwright test).",
        analogy:
          "Кнопки быстрого набора на пульте или в телефоне: нажали одну кнопку вместо набора 11 цифр номера.",
},
      {
        term: "tsconfig.json",
        definition:
          "Главный файл настроек компилятора TypeScript, задающий правила строгой проверки типов и распознавания путей в проекте.",
        analogy:
          "Свод правил орфографического словаря для корректора в издательстве: указывает, какие ошибки подчеркивать красным карандашом.",
},
      {
        term: "Параметр baseURL",
        definition:
          "Базовый адрес тестируемого веб-приложения, к которому Playwright автоматически пристыковывает относительные пути вроде '/' или '/login'.",
        analogy:
          "Название города и улицы в записке для курьера: вам достаточно написать только номер квартиры, потому что адрес дома уже известен.",
},
      {
        term: "Конфигурация",
        definition:
          "Набор настроек, который сообщает инструменту, как работать, не заставляя повторять эти настройки в каждом тесте.",
        analogy:
          "Настройки навигатора перед поездкой: один раз выбираете город, а затем вводите только нужные улицы.",
      },
    ],
    theory: [
      "Скрипты в package.json стандартизируют запуск тестов для всех членов команды: test, test:ui, test:debug, report.",
      "TypeScript проверяет код на опечатки до его реального запуска в браузере.",
      "playwright.config.ts — единый центр управления настройками: таймауты, базовый URL, формат отчетов и браузеры.",
      "SUT (System Under Test) — приложение, которое мы проверяем. В этом курсе это https://practice.expandtesting.com: один общий стенд делает каждый пример воспроизводимым, а baseURL не даёт случайно смешать его с другими сайтами.",
      "HTML-отчет сохраняет все результаты прогона в папку playwright-report/, позволяя разбирать падения в браузере.",
    ],
    steps: [
      "Попробуйте запустить npm run test и убедитесь в ошибке Missing script: test — короткая команда ещё не создана.",
      "Установите TypeScript и типы Node.js: npm install --save-dev typescript@^5.7.0 @types/node@^20.0.0.",
      "Создайте в корне проекта файл tsconfig.json со строгой конфигурацией.",
      "Обновите package.json: добавьте скрипты test, test:ui, test:debug, test:headed, report.",
      "Откройте src/config/env.ts из шаблона. В нём уже записан адрес учебного SUT — Expand Testing; он выбран потому, что содержит реальные страницы и Notes API для всей программы. Не пишите этот адрес в тестах.",
      "Создайте или обновите playwright.config.ts: настройте baseURL из src/config/env.js, таймаут 30 секунд и HTML-репортер.",
      "Запустите npm run test и убедитесь, что тесты успешно стартуют через короткую команду.",
      "Проверьте отсутствие ошибок типов: npx tsc --noEmit.",
    ],
    files: [
      "package.json — короткие команды npm и зависимости инструментов.",
      "tsconfig.json — правила компиляции и проверки TypeScript.",
      "src/config/env.ts — единое место для адреса Expand Testing.",
      "playwright.config.ts — главная конфигурация Playwright.",
    ],
    definitionOfDone: [
      "Команда npm run test запускает тесты без ошибки Missing script.",
      "Команда npx tsc --noEmit выполняется с кодом 0 без ошибок типов.",
      "playwright.config.ts содержит baseURL, timeout 30_000 и reporter: 'html'.",
      "После прогона создается папка playwright-report, а npm run report открывает её.",
    ],
    hints: [
      "Устанавливайте зависимости через npm install --save-dev — npm сам добавит их в package.json.",
      "В playwright.config.ts не забудьте расширение .js в импорте: import { BASE_URL } from './src/config/env.js'.",
      "Сверьте структуру файлов со свернутыми эталонными решениями ниже.",
    ],
    commandGroups: [
      {
        title: "Посмотреть исходную ошибку",
        description: "Выполните один раз до изменений. Ошибка ожидаема.",
commands: ["npm run test"],
      },
      {
        title: "Добавить нужные инструменты",
        description: "Эта команда обновит package.json и package-lock.json.",
commands: [
          "npm install --save-dev typescript@^5.7.0 @types/node@^20.0.0",
        ],
      },
      {
        title: "Проверить результат",
        description: "Сначала создайте конфигурационные файлы по примерам ниже.",
commands: ["npm run test", "npm run report", "npx tsc --noEmit"],
      },
      {
        title: "Посмотреть тест в браузере",
        description: "Необязательные интерактивные режимы; закройте их вручную после просмотра.",
commands: [
          "npm run test:ui",
          "npm run test:debug",
          "npm run test:headed",
        ],
      },
    ],
    codeExamples: [
      {
        title: "Итоговый package.json",
        description:
          "Сохраните существующие поля и добавьте scripts и devDependencies. Этот пример можно спокойно сверить построчно.",
        language: "json",
        code: `{
  "name": "playwright-notes-automation",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug",
    "test:headed": "playwright test --headed",
    "report": "playwright show-report"
},
  "devDependencies": {
    "@playwright/test": "^1.63.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.7.0"
  }
}`,
      },
      {
        title: "tsconfig.json",
        description:
          "Этот файл помогает TypeScript понять устройство проекта и распознать process.env.",
        language: "json",
        code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "types": ["node"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
},
  "include": ["src/**/*.ts", "tests/**/*.ts", "playwright.config.ts"],
  "exclude": ["node_modules", "playwright-report", "test-results"]
}`,
      },
      {
        title: "src/config/env.ts",
        description:
          "Адрес площадки хранится в одном файле. Позже BASE_URL позволит подменить адрес без изменения тестов.",
        language: "typescript",
        code: `export const BASE_URL =
  process.env.BASE_URL ?? "https://practice.expandtesting.com";`,
      },
      {
        title: "playwright.config.ts",
        description:
          "Отчёт создаётся при запуске тестов. Команда report только открывает уже готовый результат.",
        language: "typescript",
        code: `import { defineConfig } from "@playwright/test";

import { BASE_URL } from "./src/config/env.js";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  reporter: "html",
  use: {
    baseURL: BASE_URL,
},
});`,
      },
    ],
  },
  {
    moduleId: "0",
    id: "0.5",
    slug: "0-5",
    title: "Первый smoke-тест",
    summary: "Написать первый тест, который открывает сайт и проверяет, что всё загрузилось.",
    context:
      "Конфигурация готова — пришло время написать ваш первый настоящий автотест. Он откроет главную страницу Expand Testing и проверит заголовок вкладки. Такой быстрый первичный тест называют smoke-тестом («проверка на дым»): он моментально отвечает на базовый вопрос — сайт вообще открывается или сломан на корню?",
    terms: [
      {
        term: "Smoke-тест (Дымовое тестирование)",
        definition:
          "Короткий поверхностный тест критического пути, проверяющий базовую работоспособность приложения перед глубоким тестированием.",
        analogy:
          "Первое включение нового электроприбора в розетку: если пошел дым — прибор сломан; если загорелся экран — можно настраивать дальше.",
},
      {
        term: "page (объект вкладки)",
        definition:
          "Главный инструмент Playwright для управления активной вкладкой браузера: навигация, клики, ввод текста.",
        analogy:
          "Чистый планшет в руках лаборанта-испытателя: на нем отображается текущий экран и фиксируются все действия.",
},
      {
        term: "toHaveTitle (Проверка заголовка)",
        definition:
          "Web-first assertion, который автоматически дожидается, пока в заголовке вкладки браузера появится ожидаемый текст.",
        analogy:
          "Сверка названия книги на обложке перед покупкой: убедиться, что держите в руках именно то произведение.",
},
      {
        term: "await",
        definition:
          "Ключевое слово, которое говорит коду: «остановись на этом шаге и дождись результата, затем продолжай».",
        analogy:
          "Талон в кафе: вы ждёте, пока заказ приготовят, и только потом забираете его, а не пытаетесь взять блюдо из пустого окна.",
      },
    ],
    theory: [
      "test — это описание одного проверяемого действия. В нашем случае: открыть главную страницу и проверить её название.",
      "page — вкладка браузера, которой управляет Playwright. page.goto('/') говорит: «перейди на главную страницу».",
      "Название вкладки называют title. Оно видно в верхней части окна браузера и помогает убедиться, что открылась правильная страница.",
      "expect — это проверка ожидания. Playwright немного подождёт, пока title появится, поэтому не нужно добавлять искусственные паузы.",
      "Символ / в page.goto('/') означает главную страницу адреса, который вы уже указали в настройке baseURL на задаче 0.4.",
    ],
    steps: [
      "Создайте файл tests/smoke.spec.ts. Папка tests уже указана в настройках Playwright, поэтому новый файл будет найден автоматически.",
      "Добавьте импорт test и expect — это инструменты Playwright для описания теста и проверки результата.",
      "Создайте один тест с понятным названием, например «главная страница открывается». Playwright передаст в него page — готовую вкладку браузера.",
      "Откройте главную страницу командой await page.goto('/'). Слово await означает: дождаться, пока страница начнёт загружаться, и только потом перейти к проверке.",
      "Проверьте название вкладки через await expect(page).toHaveTitle(...). Достаточно устойчивого фрагмента Automation Testing Practice Website, а не полного текста целиком.",
      "Запустите npm run test. Если в терминале написано 1 passed, ваш первый тест выполнен успешно.",
      "Запустите npm run test:ui, чтобы увидеть тест в интерфейсе Playwright. После просмотра закройте UI-режим и перейдите к финальному блоку «Сохраняем Модуль 0 в Git».",
    ],
    files: [
      "tests/smoke.spec.ts — ваш первый самостоятельный автотест.",
    ],
    definitionOfDone: [
      "Файл tests/smoke.spec.ts содержит один понятный тест.",
      "Тест открывает главную страницу через page.goto('/'), без адреса сайта в коде.",
      "Тест проверяет title и проходит при npm run test.",
      "Вы увидели успешный результат и в обычном запуске, и в UI-режиме.",
    ],
    hints: [
      "Начните с малого: один файл, один тест, одна проверка. Не добавляйте ожидания через waitForTimeout — Playwright умеет ждать нужное состояние сам.",
      "В начале файла импортируйте test и expect из @playwright/test. Внутри test получите page и откройте страницу методом page.goto('/').",
      "Сверьте свой файл с примером ниже. Для проверки title используйте await expect(page).toHaveTitle(/Automation Testing Practice Website/).",
    ],
    commands: ["npm run test", "npm run test:ui"],
    codeExamples: [
      {
        title: "tests/smoke.spec.ts",
        description:
          "Это полный, но небольшой первый тест. Прочитайте его сверху вниз и соотнесите каждую строку с шагами урока.",
        language: "typescript",
        code: `import { expect, test } from "@playwright/test";

test("главная страница открывается", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Automation Testing Practice Website/);
});`,
},
    ],
  },
];

export function getModuleZeroTask(slug: string) {
  return moduleZeroTasks.find((task) => task.slug === slug);
}
