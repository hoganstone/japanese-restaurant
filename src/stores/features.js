import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFeaturesStore = defineStore('features', () => {
  const items = ref([
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&q=85',
      title: '嚴選頂級食材',
      subtitle: '每日直送・品質保證',
      desc: '我們與日本在地漁港合作，每日空運直送鮭魚、鮪魚大腹等頂級食材，確保每一口都是最新鮮的原味享受。',
      enabled: true,
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1569558035069-a31a5f9b3a8c?w=800&q=85',
      title: '職人手藝傳承',
      subtitle: '三十年料理經驗',
      desc: '主廚師承京都老舖，融合傳統與創新，從一碗拉麵的高湯熬製到握壽司的手法，每道料理都凝聚三十年的功力。',
      enabled: true,
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85',
      title: '道地日式氛圍',
      subtitle: '沉浸式用餐體驗',
      desc: '從燈光、擺盤到餐具，每個細節都忠實還原日本居酒屋的溫暖氛圍，讓您不出國就能感受最道地的日式風情。',
      enabled: true,
    },
  ])

  let nextId = ref(4)

  function add(item) {
    items.value.push({ ...item, id: nextId.value++, enabled: true })
  }

  function update(id, data) {
    const idx = items.value.findIndex(i => i.id === id)
    if (idx !== -1) items.value[idx] = { ...items.value[idx], ...data }
  }

  function remove(id) {
    const idx = items.value.findIndex(i => i.id === id)
    if (idx !== -1) items.value.splice(idx, 1)
  }

  function toggleEnabled(id) {
    const item = items.value.find(i => i.id === id)
    if (item) item.enabled = !item.enabled
  }

  function moveUp(id) {
    const idx = items.value.findIndex(i => i.id === id)
    if (idx > 0) [items.value[idx], items.value[idx - 1]] = [items.value[idx - 1], items.value[idx]]
  }

  function moveDown(id) {
    const idx = items.value.findIndex(i => i.id === id)
    if (idx < items.value.length - 1) [items.value[idx], items.value[idx + 1]] = [items.value[idx + 1], items.value[idx]]
  }

  const activeItems = () => items.value.filter(i => i.enabled)

  return { items, nextId, add, update, remove, toggleEnabled, moveUp, moveDown, activeItems }
}, { persist: true })
