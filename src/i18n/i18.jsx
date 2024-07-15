import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from "i18next";
import enUsTrans from "./locales/en-us.json";
import zhCnTrans from "./locales/zh-cn.json";
import {
    initReactI18next
} from 'react-i18next';

let  DEFAULT_LANGUAGE = "en";
/*global chrome*/


const getStoreLang =  async() =>{
    let rt = await chrome.storage.local.get(["lang"])
   return rt.lang;
}

function saveStoreLang(lang) {

    chrome.storage.local.set({lang});
}

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            "en": {
                translation: enUsTrans,
            },
            "zh": {
                translation: zhCnTrans,
            },
        },
        fallbackLng: DEFAULT_LANGUAGE,
        debug: false,
        react: {
            useSuspense: false,
        },
        lng: await getStoreLang() || DEFAULT_LANGUAGE,
        interpolation: {
            escapeValue: false,
        },
    })

i18n.on("languageChanged", (lang)=> {
    saveStoreLang(lang)
})
export default i18n;
