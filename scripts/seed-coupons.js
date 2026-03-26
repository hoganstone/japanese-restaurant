import axios from 'axios'

const BASE_URL = 'https://ec-course-api.hexschool.io/v2'
const API_PATH = 'seaisi'

// API 僅支援百分比折扣，固定金額折扣以最接近比例換算
const coupons = [
  {
    title: '八折優惠券',
    code: 'DISCOUNT80',
    percent: 80,
    due_date: new Date('2026-12-31').getTime() / 1000,
    is_enabled: 1,
  },
  {
    title: '生日禮券（九折）',
    code: 'BIRTHDAY10',
    percent: 90,
    due_date: new Date('2026-12-31').getTime() / 1000,
    is_enabled: 1,
  },
  {
    title: '滿千折百（九折）',
    code: 'SAVE1000',
    percent: 90,
    due_date: new Date('2026-12-31').getTime() / 1000,
    is_enabled: 1,
  },
  {
    title: '滿兩千折兩百（九折）',
    code: 'SAVE2000',
    percent: 90,
    due_date: new Date('2026-12-31').getTime() / 1000,
    is_enabled: 1,
  },
]

async function seedCoupons() {
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
  console.log('✅ 登入成功！\n')

  const api = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: token },
  })

  let success = 0
  let failed = 0

  for (const coupon of coupons) {
    try {
      const res = await api.post(`/api/${API_PATH}/admin/coupon`, { data: coupon })
      if (res.data.success) {
        console.log(`  ✅ 新增：${coupon.title}（代碼：${coupon.code}，${coupon.percent} 折）`)
        success++
      } else {
        console.log(`  ⚠️  失敗：${coupon.title} - ${res.data.message}`)
        failed++
      }
    } catch (e) {
      console.log(`  ❌ 錯誤：${coupon.title} - ${e.response?.data?.message || e.message}`)
      failed++
    }
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\n🎉 完成！成功 ${success} 筆，失敗 ${failed} 筆`)
}

seedCoupons()
