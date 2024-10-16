import English from '@/assets/locales/en.json'
import LanguageDetector from 'i18next-browser-languagedetector'
import Vietnamese from '@/assets/locales/vi.json'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: English
  },
  vi: {
    translation: Vietnamese
  }
}

i18next.use(initReactI18next).use(LanguageDetector).init({
  resources,
  lng: 'vi'
})

export default i18next
