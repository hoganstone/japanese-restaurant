<script setup>
import { reactive, watch, computed } from 'vue'
import { useCtaStore } from '@/stores/cta'
import { useToastStore } from '@/stores/toast'
import { useI18n } from 'vue-i18n'
import { Save, Check, ExternalLink, Link } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'

const { t } = useI18n()
const store = useCtaStore()
const toast = useToastStore()

const form = reactive({ ...store.data })
watch(() => store.data, val => Object.assign(form, val), { deep: true })

const overlayStyle = computed(() => ({
  backgroundColor: `rgba(0,0,0,${form.overlayOpacity / 100})`,
}))

const presets = [
  'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1600&q=85',
  'https://images.unsplash.com/photo-1569558035069-a31a5f9b3a8c?w=1600&q=85',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&q=85',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=85',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=1600&q=85',
  'https://images.unsplash.com/photo-1562802378-063ec186a863?w=1600&q=85',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1600&q=85',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=85',
]

function handleSave() {
  store.update({ ...form })
  toast.success(t('toast.ctaSaved'))
}

function handleReset() {
  if (!confirm(t('admin.common.reset') + '?')) return
  const defaults = {
    title: '準備好享用美食了嗎？',
    desc: '瀏覽我們的菜單，挑選您喜愛的料理，現在就開始您的日式美食之旅',
    btnText: '立即查看菜單',
    btnLink: '/menu',
    bgImage: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1600&q=85',
    overlayOpacity: 60,
  }
  store.update(defaults)
  Object.assign(form, defaults)
  toast.success(t('toast.resetDone'))
}
</script>

<template>
  <div class="max-w-3xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ t('admin.ctaPage.title') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ t('admin.ctaPage.subtitle') }}</p>
      </div>
      <div class="flex gap-2">
        <button @click="handleReset" class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 cursor-pointer">
          {{ t('admin.common.reset') }}
        </button>
        <button @click="handleSave" class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
          <Save :size="15" /> {{ t('admin.common.save') }}
        </button>
      </div>
    </div>

    <div class="space-y-5">

      <!-- Live Preview -->
      <div class="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <p class="text-xs text-gray-400 bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-green-400 inline-block"></span> {{ t('admin.common.preview') }}
        </p>
        <div class="relative min-h-[220px] flex items-center justify-center overflow-hidden">
          <img
            v-if="form.bgImage"
            :src="form.bgImage"
            alt="bg"
            class="absolute inset-0 w-full h-full object-cover"
            @error="$event.target.src=''"
          />
          <div class="absolute inset-0" :style="overlayStyle" />
          <div class="relative text-center text-white px-6 py-10">
            <h2 class="text-2xl md:text-3xl font-bold mb-3 drop-shadow">
              {{ form.title || t('admin.ctaPage.mainTitle') }}
            </h2>
            <p class="text-white/80 mb-6 text-sm leading-relaxed max-w-md mx-auto">
              {{ form.desc || t('admin.ctaPage.description') }}
            </p>
            <span class="inline-flex items-center gap-2 bg-white text-red-700 px-6 py-2.5 rounded-full font-semibold text-sm shadow">
              {{ form.btnText || t('admin.ctaPage.btnText') }} <ChevronRight :size="16" />
            </span>
          </div>
        </div>
      </div>

      <!-- Text -->
      <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 class="font-semibold text-gray-800">{{ t('admin.ctaPage.copyContent') }}</h2>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">{{ t('admin.ctaPage.mainTitle') }}</label>
          <input
            v-model="form.title"
            class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">{{ t('admin.ctaPage.description') }}</label>
          <textarea
            v-model="form.desc"
            rows="2"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ t('admin.ctaPage.btnText') }}</label>
            <input
              v-model="form.btnText"
              class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ t('admin.ctaPage.btnLink') }}</label>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <Link class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" :size="13" />
                <input
                  v-model="form.btnLink"
                  placeholder="/menu"
                  class="w-full h-9 border border-gray-300 rounded-lg pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <a
                v-if="form.btnLink"
                :href="form.btnLink"
                target="_blank"
                rel="noopener"
                class="flex items-center px-2.5 h-9 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 shrink-0"
                :title="t('admin.ctaPage.testLink')"
              >
                <ExternalLink :size="14" />
              </a>
            </div>
            <p class="text-xs text-gray-400 mt-1">{{ t('admin.ctaPage.linkHint') }}</p>
          </div>
        </div>
      </div>

      <!-- Background Image -->
      <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 class="font-semibold text-gray-800">{{ t('admin.ctaPage.bgSettings') }}</h2>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">{{ t('admin.ctaPage.imageUrl') }}</label>
          <input
            v-model="form.bgImage"
            placeholder="https://images.unsplash.com/..."
            class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <!-- Presets -->
        <div>
          <p class="text-xs font-medium text-gray-600 mb-2">{{ t('admin.ctaPage.quickSelect') }}</p>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="p in presets"
              :key="p"
              @click="form.bgImage = p"
              class="relative rounded-lg overflow-hidden aspect-video cursor-pointer border-2 transition-all hover:scale-105"
              :class="form.bgImage === p ? 'border-red-500' : 'border-transparent'"
            >
              <img :src="p" class="w-full h-full object-cover" />
              <div v-if="form.bgImage === p" class="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                <Check class="text-white" :size="14" />
              </div>
            </button>
          </div>
        </div>

        <!-- Overlay opacity -->
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-2">
            {{ t('admin.ctaPage.overlayLabel') }}<span class="text-red-600 font-semibold">{{ form.overlayOpacity }}%</span>
          </label>
          <input
            v-model.number="form.overlayOpacity"
            type="range"
            min="0"
            max="90"
            step="5"
            class="w-full accent-red-600 cursor-pointer"
          />
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>{{ t('admin.ctaPage.overlayTransparent') }}</span><span>{{ t('admin.ctaPage.overlayDark') }}</span>
          </div>
        </div>
      </div>

      <!-- Save -->
      <div class="flex justify-end gap-2 pt-1">
        <button @click="handleReset" class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 cursor-pointer">{{ t('admin.common.reset') }}</button>
        <button @click="handleSave" class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg text-sm font-medium cursor-pointer">
          <Save :size="15" /> {{ t('admin.common.saveChanges') }}
        </button>
      </div>
    </div>
  </div>
</template>
