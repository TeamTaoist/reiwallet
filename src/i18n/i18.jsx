import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from "i18next";
import enUsTrans from "./locales/en-us.json";
import {
    initReactI18next
} from 'react-i18next';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enUsTrans,
            },
        },
        fallbackLng: "en",
        debug: false,
        interpolation: {
            escapeValue: false,
        },
    })

export default i18n;
