import { defineStore } from 'pinia'
import { ref } from 'vue'

const defaultBanners = [
  {
    id: 1,
    tag: '招牌壽司',
    title: '豪華綜合握壽司',
    desc: '精選當日最新鮮魚材，職人手握，入口即化，每一口都是職人的堅持',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1600&q=85',
    enabled: true,
  },
  {
    id: 2,
    tag: '人氣拉麵',
    title: '濃郁豚骨拉麵',
    desc: '熬煮 12 小時的豚骨湯底，香醇回甘，搭配叉燒與溏心蛋，溫暖每個夜晚',
    image: 'https://images.unsplash.com/photo-1569558035069-a31a5f9b3a8c?w=1600&q=85',
    enabled: true,
  },
  {
    id: 3,
    tag: '道地丼飯',
    title: '鮭魚親子丼',
    desc: '鮭魚生魚片搭配鮭魚卵，雙重鮮味交融，日本家庭最愛的經典選擇',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&q=85',
    enabled: true,
  },
  {
    id: 4,
    tag: '炭火串燒',
    title: '串燒拼盤',
    desc: '炭火慢烤逼出油脂，焦香四溢，雞腿、豬五花、蔬菜，豐富口感一次滿足',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=85',
    enabled: true,
  },
  {
    id: 5,
    tag: '精緻定食',
    title: '鮭魚西京燒定食',
    desc: '西京味噌醃漬烤鮭魚，搭配白飯、味噌湯、茶碗蒸，豐盛均衡的一餐',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1600&q=85',
    enabled: true,
  },
  {
    id: 6,
    tag: '日式甜點',
    title: '抹茶大福與甜點',
    desc: '宇治高級抹茶、手工大福麻糬，每一口都是來自京都的甜蜜問候',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1600&q=85',
    enabled: true,
  },
  {
    id: 7,
    tag: '天婦羅',
    title: '酥脆天丼',
    desc: '現炸大蝦與蔬菜天婦羅，搭配特製天丼醬，酥脆鮮美，色香味俱全',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=85',
    enabled: true,
  },
  {
    id: 8,
    tag: '日式早午餐',
    title: '精緻和食套餐',
    desc: '豐盛的日式早午餐，新鮮食材精心料理，開啟美好的一天',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1600&q=85',
    enabled: true,
  },
]

export const useBannersStore = defineStore('banners', () => {
  const banners = ref([...defaultBanners])
  let nextId = ref(defaultBanners.length + 1)

  function add(banner) {
    banners.value.push({ ...banner, id: nextId.value++, enabled: true })
  }

  function update(id, data) {
    const idx = banners.value.findIndex(b => b.id === id)
    if (idx !== -1) banners.value[idx] = { ...banners.value[idx], ...data }
  }

  function remove(id) {
    const idx = banners.value.findIndex(b => b.id === id)
    if (idx !== -1) banners.value.splice(idx, 1)
  }

  function toggleEnabled(id) {
    const b = banners.value.find(b => b.id === id)
    if (b) b.enabled = !b.enabled
  }

  function moveUp(id) {
    const idx = banners.value.findIndex(b => b.id === id)
    if (idx > 0) {
      const tmp = banners.value[idx]
      banners.value[idx] = banners.value[idx - 1]
      banners.value[idx - 1] = tmp
    }
  }

  function moveDown(id) {
    const idx = banners.value.findIndex(b => b.id === id)
    if (idx < banners.value.length - 1) {
      const tmp = banners.value[idx]
      banners.value[idx] = banners.value[idx + 1]
      banners.value[idx + 1] = tmp
    }
  }

  const activeBanners = () => banners.value.filter(b => b.enabled)

  return { banners, nextId, add, update, remove, toggleEnabled, moveUp, moveDown, activeBanners }
}, {
  persist: true,
})
