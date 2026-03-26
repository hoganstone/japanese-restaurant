import { defineStore } from 'pinia'
import { ref } from 'vue'
import { i18n } from '@/i18n'

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref(localStorage.getItem('app-locale') || 'zh-TW')

  function setLocale(lang) {
    locale.value = lang
    i18n.global.locale.value = lang
    localStorage.setItem('app-locale', lang)
    document.documentElement.lang = lang
  }

  // Sync on store creation
  i18n.global.locale.value = locale.value
  document.documentElement.lang = locale.value

  return { locale, setLocale }
})
