import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFooterStore = defineStore('footer', () => {
  const info = ref({
    brandZh: '海石日式料理',
    brandEn: 'SEAISI JAPANESE RESTAURANT',
    address: '新北市八里區渡船頭',
    mapUrl: 'https://maps.google.com/maps?q=新北市八里區渡船頭&t=&z=16&ie=UTF8&iwloc=&output=embed',
    mapLink: 'https://maps.google.com/?q=新北市八里區渡船頭',
    phone: '02-2610-0000',
    hours: '週二至週日　11:30 – 21:00',
    holiday: '週一公休',
    copyright: '© 2026 SEAISI Japanese Restaurant. All rights reserved.',
  })

  function update(data) {
    info.value = { ...info.value, ...data }
  }

  return { info, update }
}, { persist: true })
