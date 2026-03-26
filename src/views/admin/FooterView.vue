<script setup>
import { reactive, ref, watch } from 'vue'
import { useFooterStore } from '@/stores/footer'
import { useToastStore } from '@/stores/toast'
import { useI18n } from 'vue-i18n'
import { Save, MapPin, Phone, Clock, Copyright, Building2, ExternalLink, Share2, Plus, Pencil, Trash2, Eye, EyeOff, Check, X } from 'lucide-vue-next'
import Modal from '@/components/ui/Modal.vue'

const { t } = useI18n()
const store = useFooterStore()
const toast = useToastStore()

// ── Info form ──────────────────────────────────
const form = reactive({ ...store.info })
watch(() => store.info, val => Object.assign(form, val), { deep: true })

function handleSave() {
  store.update({ ...form })
  toast.success(t('toast.footerSaved'))
}

function handleReset() {
  if (!confirm(t('admin.common.reset') + '?')) return
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
  toast.success(t('toast.resetDone'))
}

// ── Socials ────────────────────────────────────
const showSocialModal = ref(false)
const editingSocialId = ref(null)

const defaultSocialForm = () => ({
  label: '',
  url: '',
  icon: '',
  bgColor: '#1877F2',
  enabled: true,
})
const socialForm = ref(defaultSocialForm())

const presetSocials = [
  { label: 'Facebook',  icon: 'https://cdn.simpleicons.org/facebook/ffffff',  bgColor: '#1877F2' },
  { label: 'LINE',      icon: 'https://cdn.simpleicons.org/line/ffffff',       bgColor: '#00B900' },
  { label: 'Instagram', icon: 'https://cdn.simpleicons.org/instagram/ffffff',  bgColor: '#E4405F' },
  { label: 'Twitter X', icon: 'https://cdn.simpleicons.org/x/ffffff',          bgColor: '#000000' },
  { label: 'YouTube',   icon: 'https://cdn.simpleicons.org/youtube/ffffff',    bgColor: '#FF0000' },
  { label: 'TikTok',    icon: 'https://cdn.simpleicons.org/tiktok/ffffff',     bgColor: '#010101' },
]

function openCreateSocial() {
  socialForm.value = defaultSocialForm()
  editingSocialId.value = null
  showSocialModal.value = true
}

function openEditSocial(s) {
  socialForm.value = { ...s }
  editingSocialId.value = s.id
  showSocialModal.value = true
}

function applyPreset(p) {
  socialForm.value.label = p.label
  socialForm.value.icon = p.icon
  socialForm.value.bgColor = p.bgColor
}

function handleSaveSocial() {
  if (!socialForm.value.label || !socialForm.value.url) {
    toast.error(t('toast.socialRequired'))
    return
  }
  if (editingSocialId.value !== null) {
    store.updateSocial(editingSocialId.value, { ...socialForm.value })
    toast.success(t('toast.socialUpdated'))
  } else {
    store.addSocial({ ...socialForm.value })
    toast.success(t('toast.socialAdded'))
  }
  showSocialModal.value = false
}

function handleDeleteSocial(id) {
  if (!confirm(t('admin.bannersPage.deleteConfirm'))) return
  store.removeSocial(id)
  toast.success(t('toast.deleted'))
}
</script>

<template>
  <div class="max-w-3xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ t('admin.footerPage.title') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ t('admin.footerPage.subtitle') }}</p>
      </div>
      <div class="flex gap-2">
        <button @click="handleReset" class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 cursor-pointer">{{ t('admin.common.reset') }}</button>
        <button @click="handleSave" class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
          <Save :size="15" /> {{ t('admin.common.save') }}
        </button>
      </div>
    </div>

    <div class="space-y-5">

      <!-- Brand -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h2 class="flex items-center gap-2 font-semibold text-gray-800 mb-4">
          <Building2 :size="16" class="text-red-600" /> {{ t('admin.footerPage.brandName') }}
        </h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ t('admin.footerPage.brandZh') }}</label>
            <input v-model="form.brandZh" class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ t('admin.footerPage.brandEn') }}</label>
            <input v-model="form.brandEn" class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>
      </div>

      <!-- Socials -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="flex items-center gap-2 font-semibold text-gray-800">
            <Share2 :size="16" class="text-red-600" /> {{ t('admin.footerPage.socials') }}
          </h2>
          <button @click="openCreateSocial" class="flex items-center gap-1.5 text-xs font-medium text-red-700 hover:text-red-800 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
            <Plus :size="13" /> {{ t('admin.common.add') }}
          </button>
        </div>

        <div class="space-y-2">
          <div
            v-for="s in store.socials"
            :key="s.id"
            :class="['flex items-center gap-3 p-3 rounded-xl border transition-all', s.enabled ? 'border-gray-200 bg-gray-50' : 'border-gray-100 bg-gray-50/50 opacity-60']"
          >
            <!-- Icon preview -->
            <div class="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center" :style="{ backgroundColor: s.bgColor || '#888' }">
              <img v-if="s.icon" :src="s.icon" :alt="s.label" class="w-5 h-5 object-contain" @error="$event.target.style.display='none'" />
            </div>

            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ s.label }}</p>
              <p class="text-xs text-gray-400 truncate">{{ s.url || t('admin.footerPage.noLink') }}</p>
            </div>

            <div class="flex items-center gap-1 shrink-0">
              <button @click="store.toggleSocial(s.id); toast.success(s.enabled ? t('toast.hiddenMsg') : t('toast.shown'))" class="p-1.5 rounded-lg hover:bg-white cursor-pointer">
                <Eye v-if="s.enabled" :size="14" class="text-green-600" />
                <EyeOff v-else :size="14" class="text-gray-400" />
              </button>
              <button @click="openEditSocial(s)" class="p-1.5 rounded-lg hover:bg-white hover:text-blue-600 text-gray-400 cursor-pointer">
                <Pencil :size="14" />
              </button>
              <button @click="handleDeleteSocial(s.id)" class="p-1.5 rounded-lg hover:bg-white hover:text-red-600 text-gray-400 cursor-pointer">
                <Trash2 :size="14" />
              </button>
            </div>
          </div>

          <p v-if="store.socials.length === 0" class="text-center text-sm text-gray-400 py-4">{{ t('admin.footerPage.noSocials') }}</p>
        </div>
      </div>

      <!-- Address -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h2 class="flex items-center gap-2 font-semibold text-gray-800 mb-4">
          <MapPin :size="16" class="text-red-600" /> {{ t('admin.footerPage.addressMap') }}
        </h2>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ t('admin.footerPage.address') }}</label>
            <input v-model="form.address" class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ t('admin.footerPage.mapLink') }}</label>
            <div class="flex gap-2">
              <input v-model="form.mapLink" placeholder="https://maps.google.com/?q=..." class="flex-1 h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              <a :href="form.mapLink" target="_blank" rel="noopener" class="flex items-center gap-1 px-3 h-9 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 shrink-0">
                <ExternalLink :size="13" /> {{ t('admin.footerPage.testLink') }}
              </a>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ t('admin.footerPage.mapUrl') }} <span class="text-gray-400 font-normal">{{ t('admin.footerPage.mapEmbedHint') }}</span></label>
            <textarea v-model="form.mapUrl" rows="3" placeholder="https://maps.google.com/maps?q=...&output=embed" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-mono text-xs" />
          </div>
          <div class="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <p class="text-xs text-gray-400 px-3 pt-2 pb-1">{{ t('admin.footerPage.mapPreview') }}</p>
            <iframe v-if="form.mapUrl" :src="form.mapUrl" width="100%" height="200" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" />
            <div v-else class="h-24 flex items-center justify-center text-gray-400 text-sm">{{ t('admin.footerPage.mapPlaceholder') }}</div>
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h2 class="flex items-center gap-2 font-semibold text-gray-800 mb-4">
          <Phone :size="16" class="text-red-600" /> {{ t('admin.footerPage.contact') }}
        </h2>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">{{ t('admin.footerPage.phone') }}</label>
          <input v-model="form.phone" placeholder="02-2610-0000" class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
      </div>

      <!-- Hours -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h2 class="flex items-center gap-2 font-semibold text-gray-800 mb-4">
          <Clock :size="16" class="text-red-600" /> {{ t('admin.footerPage.hours') }}
        </h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ t('admin.footerPage.hours') }}</label>
            <input v-model="form.hours" class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ t('admin.footerPage.holiday') }}</label>
            <input v-model="form.holiday" class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h2 class="flex items-center gap-2 font-semibold text-gray-800 mb-4">
          <Copyright :size="16" class="text-red-600" /> {{ t('admin.footerPage.copyright') }}
        </h2>
        <input v-model="form.copyright" class="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
      </div>

      <!-- Footer Preview -->
      <div class="bg-stone-900 rounded-xl overflow-hidden">
        <p class="text-xs text-stone-500 px-4 pt-3 pb-1">{{ t('admin.footerPage.previewTitle') }}</p>
        <div class="border-b border-stone-700 px-6 py-6 grid sm:grid-cols-2 gap-6 items-start">
          <div class="text-stone-400 text-sm space-y-3">
            <p class="text-white font-bold text-xl">{{ form.brandZh || '－' }}</p>
            <p class="text-red-400 text-xs tracking-widest">{{ form.brandEn }}</p>
            <!-- Social preview -->
            <div v-if="store.socials.some(s => s.enabled)" class="flex gap-2 pt-1">
              <div
                v-for="s in store.socials.filter(s => s.enabled)"
                :key="s.id"
                class="w-8 h-8 rounded-lg flex items-center justify-center"
                :style="{ backgroundColor: s.bgColor || '#555' }"
              >
                <img v-if="s.icon" :src="s.icon" :alt="s.label" class="w-4 h-4 object-contain" />
              </div>
            </div>
            <div class="flex items-center gap-2 mt-1">
              <MapPin class="text-red-400 shrink-0" :size="13" />
              <span class="text-xs">{{ form.address || '－' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Phone class="text-red-400 shrink-0" :size="13" />
              <span class="text-xs">{{ form.phone || '－' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Clock class="text-red-400 shrink-0" :size="13" />
              <span class="text-xs">{{ form.hours }}</span>
            </div>
          </div>
          <div class="rounded-lg overflow-hidden bg-stone-800 h-32 flex items-center justify-center text-stone-600 text-xs">
            {{ t('admin.footerPage.mapPreviewNote') }}
          </div>
        </div>
        <div class="px-4 py-3 text-center text-xs text-stone-500">{{ form.copyright || '－' }}</div>
      </div>

      <div class="flex justify-end gap-2 pt-1">
        <button @click="handleReset" class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 cursor-pointer">{{ t('admin.common.reset') }}</button>
        <button @click="handleSave" class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg text-sm font-medium cursor-pointer">
          <Save :size="15" /> {{ t('admin.common.saveChanges') }}
        </button>
      </div>
    </div>

    <!-- Social Modal -->
    <Modal :show="showSocialModal" :title="editingSocialId !== null ? t('admin.footerPage.editSocial') : t('admin.footerPage.addSocial')" @close="showSocialModal = false">
      <div class="space-y-4">

        <!-- Preset buttons -->
        <div>
          <p class="text-xs font-medium text-gray-600 mb-2">{{ t('admin.footerPage.quickApply') }}</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="p in presetSocials"
              :key="p.label"
              @click="applyPreset(p)"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <span class="w-5 h-5 rounded flex items-center justify-center" :style="{ backgroundColor: p.bgColor }">
                <img :src="p.icon" :alt="p.label" class="w-3 h-3 object-contain" />
              </span>
              {{ p.label }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.footerPage.nameLabel') }} *</label>
            <input v-model="socialForm.label" placeholder="Facebook" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.footerPage.bgColor') }}</label>
            <div class="flex gap-2 items-center">
              <input type="color" v-model="socialForm.bgColor" class="w-9 h-9 rounded-md border border-gray-300 cursor-pointer p-0.5" />
              <input v-model="socialForm.bgColor" placeholder="#1877F2" class="flex-1 h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono" />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.footerPage.url') }} *</label>
          <input v-model="socialForm.url" placeholder="https://www.facebook.com/yourpage" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.footerPage.iconUrl') }}</label>
          <input v-model="socialForm.icon" placeholder="https://cdn.simpleicons.org/facebook/ffffff" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>

        <!-- Preview -->
        <div class="flex items-center gap-3 p-3 bg-stone-800 rounded-xl">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :style="{ backgroundColor: socialForm.bgColor || '#555' }">
            <img v-if="socialForm.icon" :src="socialForm.icon" :alt="socialForm.label" class="w-6 h-6 object-contain" />
          </div>
          <div>
            <p class="text-white text-sm font-medium">{{ socialForm.label || t('admin.footerPage.nameLabel') }}</p>
            <p class="text-stone-400 text-xs truncate max-w-[200px]">{{ socialForm.url || t('admin.footerPage.url') }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input type="checkbox" id="social_enabled" v-model="socialForm.enabled" class="accent-red-700" />
          <label for="social_enabled" class="text-sm text-gray-700">{{ t('admin.footerPage.displayInFooter') }}</label>
        </div>
      </div>

      <template #footer>
        <button @click="showSocialModal = false" class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">{{ t('admin.common.cancel') }}</button>
        <button @click="handleSaveSocial" class="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
          {{ editingSocialId !== null ? t('admin.common.saveChanges') : t('admin.common.add') }}
        </button>
      </template>
    </Modal>
  </div>
</template>
