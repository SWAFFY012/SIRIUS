/* ============================================================
   site.js — единый источник контента: реквизиты, навигация,
   слоган, плашки-преимущества героя.
   ============================================================ */

export const COMPANY = {
  name: "СИРИУС",
  legal: "ООО «Сириус»",
  tagline: "Дорожно-строительная компания",
  region: "Санкт-Петербург и Ленинградская область",
  motto: "Качество. Надёжность. Опыт более 10 лет.",
  phone: "+7 (981) 197-72-87",
  phoneHref: "tel:+79811977287",
  email: "rcc.sirius@mail.ru",
  address:
    "192012, Санкт-Петербург, пр-кт Обуховской Обороны, д. 116 к. 1 литера Е, пом/офис 26н, 817",
  addressShort: "СПб, пр-кт Обуховской Обороны, 116 к. 1",
  inn: "7811776492",
  kpp: "781101001",
  ogrn: "1227800075513",
  director: "Аветисян Сергей Перджикович",
  mapUrl: "https://yandex.ru/navi/org/sirius/231649751505",
  /* виджет карточки организации на Яндекс Картах (oid из ссылки заказчика) */
  mapEmbed: "https://yandex.ru/map-widget/v1/?oid=231649751505&z=16",
  hours: "Пн–Пт: 09:00 – 18:00 · Сб–Вс: по договорённости",
};

/* Слоган героя — разбит на строки под крупную вёрстку.
   Первое слово печатается посимвольно, остальное появляется следом. */
export const HERO_SLOGAN = {
  typeword: "ДОРОГА",
  lines: [
    "начинается там, где",
    "заканчивается колея —",
    "мы создаём начало",
    "вашего пути",
  ],
};

/* Ключевые преимущества под слоганом. */
export const HERO_BENEFITS = [
  {
    title: "Под ваш бюджет.",
    text: "Предложим оптимальные решения без переплат.",
  },
  {
    title: "Без задержек и удорожания.",
    text: "Фиксируем смету и сроки в договоре.",
  },
  {
    title: "По стандартам ГОСТ и СП.",
    text: "Строгий контроль качества, гарантия до 7 лет.",
  },
];

export const SOCIALS = [
  { label: "Instagram", handle: "@rcc_sirius", href: "https://www.instagram.com/rcc_sirius/" },
  { label: "Telegram", handle: "@sirius_road", href: "https://t.me/sirius_road" },
  { label: "ВКонтакте", handle: "vk.ru/club241035061", href: "https://vk.ru/club241035061" },
  { label: "WhatsApp", handle: COMPANY.phone, href: "https://wa.me/79811977287" },
];

export const NAV = [
  { to: "/", label: "Главная", end: true },
  { to: "/services", label: "Услуги" },
  { to: "/cases", label: "Кейсы" },
  { to: "/price", label: "Прайс-лист" },
  { to: "/booking", label: "Заявка" },
  { to: "/contacts", label: "Контакты" },
];

/* Фоновые сцены 4K — по одной на секцию/страницу. */
export const SCENES = [
  "/backgrounds/scene-01.jpg",
  "/backgrounds/scene-02.jpg",
  "/backgrounds/scene-03.jpg",
  "/backgrounds/scene-04.jpg",
  "/backgrounds/scene-05.jpg",
  "/backgrounds/scene-06.jpg",
];
