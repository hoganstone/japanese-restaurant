import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCtaStore = defineStore('cta', () => {
  const data = ref({
    title: '準備好享用美食了嗎？',
    desc: '瀏覽我們的菜單，挑選您喜愛的料理，現在就開始您的日式美食之旅',
    btnText: '立即查看菜單',
    bgImage: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1600&q=85',
    overlayOpacity: 60,
  })

  function update(payload) {
    data.value = { ...data.value, ...payload }
  }

  return { data, update }
}, { persist: true })
