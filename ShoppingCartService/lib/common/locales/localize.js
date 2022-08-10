"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
i18next_1.default
    .use(i18next_fs_backend_1.default)
    .use(i18next_http_middleware_1.default.LanguageDetector)
    .init({
    fallbackLng: "en",
    supportedLngs: ["en", "de"],
    backend: {
        loadPath: "src/common/locales/i18n/{{lng}}.json",
    },
});
const i18nextexpress = i18next_http_middleware_1.default.handle(i18next_1.default);
exports.default = i18nextexpress;
//# sourceMappingURL=localize.js.map