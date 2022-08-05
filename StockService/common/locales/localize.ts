import i18next from "i18next";
import i18nextBackend from "i18next-fs-backend";
import i18nextMiddleware from "i18next-http-middleware";

i18next
  .use(i18nextBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "de"],
    backend: {
      loadPath: "./common/locales/i18n/{{lng}}.json",
    },
  });

const i18nextexpress = i18nextMiddleware.handle(i18next);
export default i18nextexpress;
