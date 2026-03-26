import { createI18n } from 'vue-i18n'
import zhTW from '@/locales/zh-TW'
import en from '@/locales/en'
import ja from '@/locales/ja'

function getSavedLocale() {
  try {
    return localStorage.getItem('app-locale') || 'zh-TW'
  } catch {
    return 'zh-TW'
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'zh-TW',
  messages: { 'zh-TW': zhTW, en, ja },
})
