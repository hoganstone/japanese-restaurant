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

  const socials = ref([
    {
      id: 1,
      label: 'Facebook',
      url: 'https://www.facebook.com',
      icon: 'https://cdn.simpleicons.org/facebook/ffffff',
      bgColor: '#1877F2',
      enabled: true,
    },
    {
      id: 2,
      label: 'LINE',
      url: 'https://line.me',
      icon: 'https://cdn.simpleicons.org/line/ffffff',
      bgColor: '#00B900',
      enabled: true,
    },
    {
      id: 3,
      label: 'Instagram',
      url: 'https://www.instagram.com',
      icon: 'https://cdn.simpleicons.org/instagram/ffffff',
      bgColor: '#E4405F',
      enabled: true,
    },
  ])

  let nextSocialId = ref(4)

  function update(data) {
    info.value = { ...info.value, ...data }
  }

  function addSocial(item) {
    socials.value.push({ ...item, id: nextSocialId.value++ })
  }

  function updateSocial(id, data) {
    const idx = socials.value.findIndex(s => s.id === id)
    if (idx !== -1) socials.value[idx] = { ...socials.value[idx], ...data }
  }

  function removeSocial(id) {
    const idx = socials.value.findIndex(s => s.id === id)
    if (idx !== -1) socials.value.splice(idx, 1)
  }

  function toggleSocial(id) {
    const s = socials.value.find(s => s.id === id)
    if (s) s.enabled = !s.enabled
  }

  const activeSocials = () => socials.value.filter(s => s.enabled)

  return { info, socials, nextSocialId, update, addSocial, updateSocial, removeSocial, toggleSocial, activeSocials }
}, { persist: true })
