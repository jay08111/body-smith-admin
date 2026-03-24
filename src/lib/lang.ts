const LANG_STORAGE_KEY = "uni-lang";

export const normalizeLangCode = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.toLowerCase();
};

const LANG_TO_REGION_FALLBACK: Record<string, string> = {
  en: "US",
  ko: "KR",
  ja: "JP",
  zh: "CN",
  "zh-hant": "TW",
  id: "ID",
  vi: "VN",
  th: "TH",
  ms: "MY",
  fr: "FR",
  de: "DE",
  es: "ES",
  it: "IT",
  pt: "PT",
  ru: "RU",
};

const REGION_TO_LANG_FALLBACK: Record<string, string> = {
  US: "en",
  KR: "ko",
  JP: "ja",
  CN: "zh",
  TW: "zh-hant",
  ID: "id",
  VN: "vi",
  TH: "th",
  MY: "ms",
  FR: "fr",
  DE: "de",
  ES: "es",
  IT: "it",
  PT: "pt",
  RU: "ru",
};

const normalizeLang = (value: string) => value.replace(/_/g, "-").trim();

export type LangDisplayNames = {
  language: Intl.DisplayNames | null;
  region: Intl.DisplayNames | null;
};

export const getLangDisplayNames = (locale?: string): LangDisplayNames => {
  if (typeof Intl === "undefined" || !("DisplayNames" in Intl)) {
    return { language: null, region: null };
  }
  let resolvedLocale = "en";
  if (locale) {
    resolvedLocale = locale;
  } else if (typeof navigator !== "undefined" && navigator.language) {
    resolvedLocale = navigator.language;
  }
  return {
    language: new Intl.DisplayNames([resolvedLocale], { type: "language" }),
    region: new Intl.DisplayNames([resolvedLocale], { type: "region" }),
  };
};

export const getLangMeta = (
  lang: string,
  displayNames?: LangDisplayNames
) => {
  const normalized = normalizeLang(lang);
  const [langPartRaw, regionPartRaw] = normalized.split("-");
  const rawLower = (langPartRaw || "").toLowerCase();
  const rawUpper = (langPartRaw || "").toUpperCase();
  const regionPart = (regionPartRaw || "").toUpperCase();

  let isRegionOnly = false;
  if (!regionPart && Boolean(REGION_TO_LANG_FALLBACK[rawUpper])) {
    isRegionOnly = true;
  }

  let derivedRegion = "";
  if (isRegionOnly) {
    derivedRegion = rawUpper;
  }

  let region = "";
  if (regionPart) {
    region = regionPart;
  } else if (derivedRegion) {
    region = derivedRegion;
  } else if (LANG_TO_REGION_FALLBACK[rawLower]) {
    region = LANG_TO_REGION_FALLBACK[rawLower];
  } else if (LANG_TO_REGION_FALLBACK[normalized.toLowerCase()]) {
    region = LANG_TO_REGION_FALLBACK[normalized.toLowerCase()];
  }

  let langPart = rawLower;
  if (isRegionOnly && REGION_TO_LANG_FALLBACK[derivedRegion]) {
    langPart = REGION_TO_LANG_FALLBACK[derivedRegion];
  }

  let languageLabel = "";
  if (langPart) {
    try {
      languageLabel = displayNames?.language?.of(langPart) ?? langPart;
    } catch {
      languageLabel = langPart;
    }
  }

  let regionLabel = "";
  if (region) {
    try {
      regionLabel = displayNames?.region?.of(region) ?? region;
    } catch {
      regionLabel = region;
    }
  }

  let label = "";
  if (languageLabel) {
    if (region) {
      label = `${languageLabel} (${regionLabel})`;
    } else {
      label = languageLabel;
    }
  } else if (regionLabel) {
    label = regionLabel;
  } else {
    label = lang;
  }

  return {
    label,
    region,
    languageLabel,
    regionLabel,
  };
};

export const getStoredLang = () => {
  if (typeof window === "undefined") return "";
  return normalizeLangCode(localStorage.getItem(LANG_STORAGE_KEY) ?? "");
};

export const setStoredLang = (lang: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANG_STORAGE_KEY, normalizeLangCode(lang));
};

export const resolveLang = (langs: string[]) => {
  const stored = getStoredLang();
  if (stored && langs.includes(stored)) return stored;
  return langs[0] ?? "";
};

export { LANG_STORAGE_KEY };
