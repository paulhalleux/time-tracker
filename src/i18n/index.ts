import i18n from "i18next";
import http from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export const setupI18n = () => {
  return i18n
    .use(http)
    .use(initReactI18next)
    .init({
      backend: {
        loadPath: "/locales/{{lng}}.json",
      },
      lng: "en-US",
      fallbackLng: "en-US",
      interpolation: {
        escapeValue: false,
      },
    });
};
