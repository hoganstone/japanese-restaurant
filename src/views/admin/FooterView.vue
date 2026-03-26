<script setup>
import { reactive, watch } from 'vue'
import { useFooterStore } from '@/stores/footer'
import { useToastStore } from '@/stores/toast'
import { Save, MapPin, Phone, Clock, Copyright, Globe, Building2, ExternalLink } from 'lucide-vue-next'

const store = useFooterStore()
const toast = useToastStore()

// local editable copy
const form = reactive({ ...store.info })

// keep in sync if store changes externally
watch(() => store.info, (val) => Object.assign(form, val), { deep: true })

function handleSave() {
  store.update({ ...form })
  toast.success('Footer 已儲存')
}

function handleReset() {
  if (!confirm('確定要還原為預設值嗎？')) return
  const defaults = {
    brandZh: '海石日式料理',
    brandEn: 'SEAISI JAPANESE RESTAURANT',
    address: '新北市八里區渡船頭',
    mapUrl: 'https://maps.google.com/maps?q=新北市八里區渡船頭&t=&z=16&ie=UTF8&iwloc=&output=embed',
    mapLink: 'https://maps.google.com/?q=新北市八里區渡船頭',
    phone: '02-2610-0000',
    hours: '週二至週日　11:30 – 21:00',
    holiday: '週一公休',
    copyright: '© 2026 SEAISI Japanese Restaurant. All rights reserved.',
  }
  store.update(defaults)
  Object.assign(form, defaults)
  toast.info('已還原預設值')
}
</script>

<template>
  <div class="max-w-3xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Footer 編輯</h1>
        <p class="text-sm text-gray-500 mt-1">編輯前台頁尾的餐廳資訊、地圖與版權文字</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="handleReset"
          class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors cursor-pointer"
        >
          還原預設
        </button>
        <button
          @click="handleSave"
          class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          <Save :size="15" /> 儲存
        </button>
      </div>
    </div>

    <div class="space-y-5">

      <!-- Brand -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h2 class="flex items-center gap-2 font-semibold text-gray-800 mb-4">
          <Building2 :size="16" class="text-red-600" /> 品牌名稱
        </h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">中文名稱</label>
            <input
              v-model="form.brandZh"
              placeholder="海石日式料理"
              class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">英文名稱</label>
            <input
              v-model="form.brandEn"
              placeholder="SEAISI JAPANESE RESTAURANT"
              class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      <!-- Address -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h2 class="flex items-center gap-2 font-semibold text-gray-800 mb-4">
          <MapPin :size="16" class="text-red-600" /> 地址與地圖
        </h2>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">餐廳地址</label>
            <input
              v-model="form.address"
              placeholder="新北市八里區渡船頭"
              class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Google 地圖連結
              <span class="text-gray-400 font-normal ml-1">（點擊「在 Google 地圖中開啟」的目標網址）</span>
            </label>
            <div class="flex gap-2">
              <input
                v-model="form.mapLink"
                placeholder="https://maps.google.com/?q=..."
                class="flex-1 h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <a
                :href="form.mapLink"
                target="_blank"
                rel="noopener"
                class="flex items-center gap-1 px-3 h-9 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 shrink-0"
              >
                <ExternalLink :size="13" /> 測試
              </a>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Google 地圖嵌入網址
              <span class="text-gray-400 font-normal ml-1">（iframe src，需含 output=embed）</span>
            </label>
            <textarea
              v-model="form.mapUrl"
              rows="3"
              placeholder="https://maps.google.com/maps?q=...&output=embed"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-mono text-xs"
            />
          </div>

          <!-- Map Preview -->
          <div class="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <p class="text-xs text-gray-400 px-3 pt-2 pb-1">地圖預覽</p>
            <iframe
              v-if="form.mapUrl"
              :src="form.mapUrl"
              width="100%"
              height="220"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="地圖預覽"
            />
            <div v-else class="h-32 flex items-center justify-center text-gray-400 text-sm">
              請填入嵌入網址
            </div>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 leading-relaxed">
            <strong>如何取得嵌入網址：</strong>前往 Google 地圖搜尋地點 → 點擊「分享」→「嵌入地圖」→ 複製 iframe 中的 <code class="bg-blue-100 px-1 rounded">src</code> 網址貼入上方欄位。
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h2 class="flex items-center gap-2 font-semibold text-gray-800 mb-4">
          <Phone :size="16" class="text-red-600" /> 聯絡資訊
        </h2>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">訂位電話</label>
          <input
            v-model="form.phone"
            placeholder="02-2610-0000"
            class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <!-- Hours -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h2 class="flex items-center gap-2 font-semibold text-gray-800 mb-4">
          <Clock :size="16" class="text-red-600" /> 營業時間
        </h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">營業時間</label>
            <input
              v-model="form.hours"
              placeholder="週二至週日　11:30 – 21:00"
              class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">休假說明</label>
            <input
              v-model="form.holiday"
              placeholder="週一公休"
              class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h2 class="flex items-center gap-2 font-semibold text-gray-800 mb-4">
          <Copyright :size="16" class="text-red-600" /> 版權文字
        </h2>
        <input
          v-model="form.copyright"
          placeholder="© 2026 SEAISI Japanese Restaurant. All rights reserved."
          class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <!-- Preview -->
      <div class="bg-stone-900 rounded-xl overflow-hidden">
        <p class="text-xs text-stone-500 px-4 pt-3 pb-1">Footer 預覽</p>
        <div class="border-b border-stone-700 px-6 py-6 grid sm:grid-cols-2 gap-6 items-start">
          <div class="text-stone-400 text-sm space-y-3">
            <p class="text-white font-bold text-xl">{{ form.brandZh || '－' }}</p>
            <p class="text-red-400 text-xs tracking-widest">{{ form.brandEn }}</p>
            <div class="flex items-start gap-2 mt-2">
              <MapPin class="text-red-400 shrink-0 mt-0.5" :size="14" />
              <span>{{ form.address || '－' }}</span>
            </div>
            <div class="flex items-start gap-2">
              <Phone class="text-red-400 shrink-0 mt-0.5" :size="14" />
              <span>{{ form.phone || '－' }}</span>
            </div>
            <div class="flex items-start gap-2">
              <Clock class="text-red-400 shrink-0 mt-0.5" :size="14" />
              <div>
                <p>{{ form.hours || '－' }}</p>
                <p class="text-stone-500 text-xs">{{ form.holiday }}</p>
              </div>
            </div>
          </div>
          <div class="rounded-lg overflow-hidden bg-stone-800 h-32 flex items-center justify-center text-stone-600 text-xs">
            地圖區塊（儲存後生效）
          </div>
        </div>
        <div class="px-4 py-3 text-center text-xs text-stone-500">{{ form.copyright || '－' }}</div>
      </div>

      <!-- Save bottom -->
      <div class="flex justify-end gap-2 pt-2">
        <button
          @click="handleReset"
          class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 cursor-pointer"
        >
          還原預設
        </button>
        <button
          @click="handleSave"
          class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg text-sm font-medium cursor-pointer"
        >
          <Save :size="15" /> 儲存變更
        </button>
      </div>
    </div>
  </div>
</template>
