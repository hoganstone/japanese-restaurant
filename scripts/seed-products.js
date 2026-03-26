import axios from 'axios'

const BASE_URL = 'https://ec-course-api.hexschool.io/v2'
const API_PATH = 'seaisi'

const products = [
  // 壽司
  {
    title: '鮭魚握壽司（5貫）',
    category: '壽司',
    origin_price: 280,
    price: 250,
    unit: '份',
    description: '嚴選挪威新鮮鮭魚，搭配職人手握醋飯，入口即化',
    content: '含 5 貫鮭魚握壽司，附醬油與山葵',
    imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '鮪魚大腹握壽司（5貫）',
    category: '壽司',
    origin_price: 480,
    price: 420,
    unit: '份',
    description: '頂級鮪魚大腹，油脂豐富，入口即化，壽司愛好者必點',
    content: '含 5 貫大腹鮪魚握壽司，附醬油與山葵',
    imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '玉子燒壽司（5貫）',
    category: '壽司',
    origin_price: 180,
    price: 160,
    unit: '份',
    description: '日式甜蛋卷，口感綿密香甜，老少皆宜',
    content: '含 5 貫玉子燒握壽司',
    imageUrl: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '豪華綜合握壽司（10貫）',
    category: '壽司',
    origin_price: 780,
    price: 680,
    unit: '份',
    description: '主廚精選當日最新鮮食材，10 種不同魚種，豐富口感一次滿足',
    content: '含 10 貫綜合握壽司（依當日食材調整），附味噌湯',
    imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '加州卷（8貫）',
    category: '壽司',
    origin_price: 220,
    price: 190,
    unit: '份',
    description: '螃蟹、酪梨、小黃瓜搭配美乃滋，清爽不膩口',
    content: '含 8 貫加州卷，附醬油',
    imageUrl: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80',
    is_enabled: 1,
  },

  // 拉麵
  {
    title: '豚骨拉麵',
    category: '拉麵',
    origin_price: 320,
    price: 280,
    unit: '碗',
    description: '熬煮 12 小時的濃郁豚骨湯底，搭配叉燒、溏心蛋、筍干，風味醇厚',
    content: '含叉燒 2 片、溏心蛋 1 顆、筍干、海苔、蔥花',
    imageUrl: 'https://images.unsplash.com/photo-1569558035069-a31a5f9b3a8c?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '醬油拉麵',
    category: '拉麵',
    origin_price: 280,
    price: 250,
    unit: '碗',
    description: '清澈透亮的雞骨醬油湯底，口感清爽，層次豐富',
    content: '含叉燒 2 片、筍干、海苔、蔥花、魚板',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '味噌拉麵',
    category: '拉麵',
    origin_price: 300,
    price: 270,
    unit: '碗',
    description: '北海道風味味噌湯底，搭配玉米、奶油，香濃回甘',
    content: '含叉燒、玉米、奶油、筍干、蔥花',
    imageUrl: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '辣味噌拉麵',
    category: '拉麵',
    origin_price: 320,
    price: 290,
    unit: '碗',
    description: '特製辣味噌湯底，辣度適中，越喝越順口，拉麵控必試',
    content: '含叉燒、溏心蛋、玉米、辣油、蔥花',
    imageUrl: 'https://images.unsplash.com/photo-1632709810780-b5a4343cebec?w=600&q=80',
    is_enabled: 1,
  },

  // 丼飯
  {
    title: '鮭魚親子丼',
    category: '丼飯',
    origin_price: 320,
    price: 280,
    unit: '碗',
    description: '鮭魚生魚片搭配鮭魚卵，雙重鮮味，日本家庭最愛的經典丼飯',
    content: '含白米飯、鮭魚片、鮭魚卵、醬油醃漬洋蔥、海苔絲',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '牛肉丼',
    category: '丼飯',
    origin_price: 350,
    price: 310,
    unit: '碗',
    description: '薄切牛肉以特製醬汁慢燉，甜鹹適中，鋪在熱騰騰白飯上',
    content: '含白米飯、燉煮牛肉、洋蔥、生薑、蔥花、紅薑',
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '炸豬排丼（カツ丼）',
    category: '丼飯',
    origin_price: 300,
    price: 260,
    unit: '碗',
    description: '酥脆炸豬排搭配蛋花，日式甜鹹醬汁，口口滿足',
    content: '含白米飯、炸豬排、蛋花、洋蔥、三葉草',
    imageUrl: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '天丼（天婦羅丼）',
    category: '丼飯',
    origin_price: 380,
    price: 340,
    unit: '碗',
    description: '現炸蝦天婦羅、蔬菜天婦羅，搭配特製天丼醬汁，酥脆鮮美',
    content: '含白米飯、大蝦天婦羅 2 隻、蔬菜天婦羅 3 件、天丼醬',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    is_enabled: 1,
  },

  // 定食
  {
    title: '鮭魚西京燒定食',
    category: '定食',
    origin_price: 420,
    price: 380,
    unit: '份',
    description: '西京味噌醃漬鮭魚，炭火燒烤至焦香，搭配配菜更顯豐盛',
    content: '含白米飯、鮭魚西京燒、味噌湯、醃漬小菜、茶碗蒸',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '唐揚雞定食',
    category: '定食',
    origin_price: 360,
    price: 320,
    unit: '份',
    description: '酥脆多汁的日式炸雞塊，搭配清爽沙拉，外酥內嫩',
    content: '含白米飯、唐揚雞塊 5 塊、沙拉、味噌湯、醃漬小菜',
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '生薑燒肉定食',
    category: '定食',
    origin_price: 380,
    price: 340,
    unit: '份',
    description: '嫩薄豬肉以生薑醬汁拌炒，香氣撲鼻，下飯神器',
    content: '含白米飯、生薑燒肉、高麗菜絲、味噌湯、醃漬小菜',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
    is_enabled: 1,
  },

  // 串燒
  {
    title: '雞腿串燒（3支）',
    category: '串燒',
    origin_price: 180,
    price: 160,
    unit: '份',
    description: '嫩雞腿肉以特製醬汁醃漬，炭火燒烤至金黃，外脆內嫩',
    content: '含 3 支雞腿串，鹽味或醬汁可選',
    imageUrl: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '雞皮串燒（3支）',
    category: '串燒',
    origin_price: 120,
    price: 100,
    unit: '份',
    description: '炭火燒烤至焦香酥脆的雞皮，獨特口感，下酒首選',
    content: '含 3 支雞皮串，附鹽或醬汁',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '豬五花串燒（3支）',
    category: '串燒',
    origin_price: 200,
    price: 180,
    unit: '份',
    description: '肥瘦相間的豬五花，炭火慢烤逼出油脂，香氣四溢',
    content: '含 3 支豬五花串，附山椒鹽',
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '串燒拼盤（8支）',
    category: '串燒',
    origin_price: 520,
    price: 460,
    unit: '份',
    description: '主廚精選 8 支串燒，雞腿、雞翅、豬五花、蔬菜，豐富多樣',
    content: '含 8 支綜合串燒、醬油醬汁、山椒鹽',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    is_enabled: 1,
  },

  // 湯品
  {
    title: '豬汁味噌湯',
    category: '湯品',
    origin_price: 120,
    price: 100,
    unit: '碗',
    description: '豬肉與根莖蔬菜熬煮的濃郁豚汁，暖胃又暖心',
    content: '含豬肉、白蘿蔔、牛蒡、馬鈴薯、味噌湯底',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '茶碗蒸',
    category: '湯品',
    origin_price: 150,
    price: 130,
    unit: '份',
    description: '細緻滑嫩的日式蒸蛋，蛤蜊、蝦仁、雞肉藏於其中，高湯香氣迷人',
    content: '含雞蛋、蛤蜊、蝦仁、雞肉、三葉草、柚子皮',
    imageUrl: 'https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=600&q=80',
    is_enabled: 1,
  },

  // 甜點
  {
    title: '抹茶冰淇淋',
    category: '甜點',
    origin_price: 130,
    price: 110,
    unit: '份',
    description: '使用宇治高級抹茶粉製作，濃郁茶香，甜而不膩',
    content: '含抹茶冰淇淋 2 球、紅豆、麻糬',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '黑芝麻布丁',
    category: '甜點',
    origin_price: 120,
    price: 100,
    unit: '份',
    description: '濃厚黑芝麻與滑嫩布丁的完美結合，日式風味甜點',
    content: '含黑芝麻布丁 1 份、焦糖醬',
    imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '大福麻糬（3個）',
    category: '甜點',
    origin_price: 160,
    price: 140,
    unit: '份',
    description: '外皮Q彈的手工麻糬，內餡有紅豆、草莓、抹茶三種口味',
    content: '含草莓大福、紅豆大福、抹茶大福各 1 個',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    is_enabled: 1,
  },

  // 飲品
  {
    title: '熱抹茶',
    category: '飲品',
    origin_price: 120,
    price: 100,
    unit: '杯',
    description: '京都宇治抹茶粉沖泡，回甘清雅，茶道精神的體現',
    content: '宇治抹茶粉，不含糖',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '清酒（冷/溫）',
    category: '飲品',
    origin_price: 280,
    price: 250,
    unit: '份',
    description: '嚴選日本進口清酒，冷飲清爽，溫飲醇厚，佐餐絕配',
    content: '180ml，冷飲或溫飲可選',
    imageUrl: 'https://images.unsplash.com/photo-1584670747417-594a9412fda4?w=600&q=80',
    is_enabled: 1,
  },
  {
    title: '日本啤酒',
    category: '飲品',
    origin_price: 150,
    price: 130,
    unit: '瓶',
    description: '精選日本進口啤酒，清爽麥香，搭配串燒更是絕妙',
    content: '350ml，Sapporo / Asahi / Kirin 供選',
    imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&q=80',
    is_enabled: 1,
  },
]

async function seedProducts() {
  console.log('🔐 登入中...')
  const loginRes = await axios.post(`${BASE_URL}/admin/signin`, {
    username: 'hogan.shih@gmail.com',
    password: 'agl6575',
  })

  if (!loginRes.data.success) {
    console.error('❌ 登入失敗：', loginRes.data.message)
    process.exit(1)
  }

  const token = loginRes.data.token
  console.log('✅ 登入成功！')

  const api = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: token },
  })

  let success = 0
  let failed = 0

  for (const product of products) {
    try {
      const res = await api.post(`/api/${API_PATH}/admin/product`, { data: product })
      if (res.data.success) {
        console.log(`  ✅ 新增：${product.title}`)
        success++
      } else {
        console.log(`  ⚠️  失敗：${product.title} - ${res.data.message}`)
        failed++
      }
    } catch (e) {
      console.log(`  ❌ 錯誤：${product.title} - ${e.response?.data?.message || e.message}`)
      failed++
    }
    // Rate limit protection
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\n🎉 完成！成功 ${success} 筆，失敗 ${failed} 筆`)
}

seedProducts()
