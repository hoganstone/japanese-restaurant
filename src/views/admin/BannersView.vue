<script setup>
import { ref, computed } from 'vue'
import { useBannersStore } from '@/stores/banners'
import { useToastStore } from '@/stores/toast'
import { useI18n } from 'vue-i18n'
import {
  Plus, Pencil, Trash2, Eye, EyeOff,
  ChevronUp, ChevronDown, Image, X, Check
} from 'lucide-vue-next'
import Modal from '@/components/ui/Modal.vue'
import Badge from '@/components/ui/Badge.vue'

const { t } = useI18n()
const store = useBannersStore()
const toast = useToastStore()

const showModal = ref(false)
const previewImage = ref('')
const editingId = ref(null)

const defaultForm = () => ({
  tag: '',
  title: '',
  desc: '',
  image: '',
  enabled: true,
})
const form = ref(defaultForm())

const presets = ref([
  'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&q=80',
  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
  'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80',
  'https://images.unsplash.com/photo-1562802378-063ec186a863?w=800&q=80',
  'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&q=80',
  'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=800&q=80',
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
  'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
  'https://images.unsplash.com/photo-nM9SYCT_tx0?w=800&q=80',
])
const newPresetUrl = ref('')

function addPreset() {
  const url = newPresetUrl.value.trim()
  if (!url || presets.value.includes(url)) return
  presets.value.push(url)
  newPresetUrl.value = ''
}

// live preview url
const previewUrl = computed(() =>
  form.value.image || previewImage.value || ''
)

function openCreate() {
  form.value = defaultForm()
  editingId.value = null
  previewImage.value = ''
  showModal.value = true
}

function openEdit(banner) {
  form.value = { ...banner }
  editingId.value = banner.id
  previewImage.value = banner.image
  showModal.value = true
}

function handleSave() {
  if (!form.value.title || !form.value.image) {
    toast.error(t('toast.bannerRequired'))
    return
  }
  if (editingId.value !== null) {
    store.update(editingId.value, { ...form.value })
    toast.success(t('toast.bannerUpdated'))
  } else {
    store.add({ ...form.value })
    toast.success(t('toast.bannerAdded'))
  }
  showModal.value = false
}

function handleDelete(id) {
  if (!confirm(t('admin.bannersPage.deleteConfirm'))) return
  store.remove(id)
  toast.success(t('toast.deleted'))
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ t('admin.bannersPage.title') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ t('admin.bannersPage.subtitle') }}</p>
      </div>
      <button
        @click="openCreate"
        class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      >
        <Plus :size="16" /> {{ t('admin.bannersPage.addBanner') }}
      </button>
    </div>

    <!-- Banner List -->
    <div class="space-y-3">
      <div
        v-for="(banner, idx) in store.banners"
        :key="banner.id"
        :class="[
          'bg-white rounded-xl border overflow-hidden flex gap-0 transition-all',
          banner.enabled ? 'border-gray-200' : 'border-gray-100 opacity-60'
        ]"
      >
        <!-- Thumbnail -->
        <div class="w-32 sm:w-48 md:w-64 shrink-0 relative overflow-hidden bg-gray-100">
          <img
            :src="banner.image"
            :alt="banner.title"
            class="w-full h-full object-cover aspect-video"
            @error="$event.target.src='https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=60'"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
          <span class="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            #{{ idx + 1 }}
          </span>
        </div>

        <!-- Content -->
        <div class="flex-1 p-4 min-w-0 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <Badge variant="secondary" class="text-xs">{{ banner.tag || t('admin.bannersPage.uncat') }}</Badge>
              <Badge :variant="banner.enabled ? 'success' : 'outline'" class="text-xs">
                {{ banner.enabled ? t('admin.bannersPage.showing') : t('admin.bannersPage.isHidden') }}
              </Badge>
            </div>
            <h3 class="font-semibold text-gray-900 text-base leading-tight mb-1 truncate">{{ banner.title }}</h3>
            <p class="text-gray-500 text-xs line-clamp-2 leading-relaxed">{{ banner.desc }}</p>
            <p class="text-gray-400 text-xs mt-1 truncate">{{ banner.image }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 mt-3 flex-wrap">
            <!-- Toggle -->
            <button
              @click="store.toggleEnabled(banner.id); toast.success(banner.enabled ? t('toast.hiddenMsg') : t('toast.shown'))"
              :class="[
                'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                banner.enabled
                  ? 'bg-green-50 text-green-700 hover:bg-green-100'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              ]"
            >
              <Eye v-if="banner.enabled" :size="13" />
              <EyeOff v-else :size="13" />
              {{ banner.enabled ? t('admin.bannersPage.show') : t('admin.bannersPage.hide') }}
            </button>

            <!-- Move -->
            <button
              @click="store.moveUp(banner.id)"
              :disabled="idx === 0"
              class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer disabled:cursor-default"
            >
              <ChevronUp :size="15" />
            </button>
            <button
              @click="store.moveDown(banner.id)"
              :disabled="idx === store.banners.length - 1"
              class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer disabled:cursor-default"
            >
              <ChevronDown :size="15" />
            </button>

            <!-- Edit -->
            <button
              @click="openEdit(banner)"
              class="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
            >
              <Pencil :size="15" />
            </button>

            <!-- Delete -->
            <button
              @click="handleDelete(banner.id)"
              class="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <Trash2 :size="15" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="store.banners.length === 0" class="text-center py-16 text-gray-400">
        <Image class="mx-auto mb-3 opacity-30" :size="48" />
        <p>{{ t('admin.bannersPage.noBanners') }}</p>
      </div>
    </div>

    <!-- Modal -->
    <Modal :show="showModal" :title="editingId !== null ? t('admin.bannersPage.editBanner') : t('admin.bannersPage.addBanner')" size="lg" @close="showModal = false">
      <div class="space-y-4">
        <!-- Image Preview -->
        <div class="relative rounded-xl overflow-hidden bg-gray-100 aspect-video">
          <img
            v-if="previewUrl"
            :src="previewUrl"
            alt="preview"
            class="w-full h-full object-cover"
            @error="$event.target.src=''"
          />
          <div v-else class="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <Image :size="36" />
            <span class="text-sm">{{ t('admin.bannersPage.previewPlaceholder') }}</span>
          </div>
          <!-- Overlay preview -->
          <div v-if="previewUrl" class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-end p-4">
            <div>
              <span v-if="form.tag" class="inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded-full mb-1">{{ form.tag }}</span>
              <p class="text-white font-bold text-lg leading-tight drop-shadow">{{ form.title || t('admin.bannersPage.titleField') }}</p>
              <p class="text-white/80 text-xs mt-0.5 line-clamp-1">{{ form.desc }}</p>
            </div>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div class="sm:col-span-2">
            <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.bannersPage.imageUrl') }} *</label>
            <div class="flex gap-2">
              <input
                v-model="form.image"
                placeholder="https://images.unsplash.com/..."
                class="flex-1 h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                @click="previewImage = form.image"
                class="h-9 px-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-xs text-gray-600 shrink-0 cursor-pointer"
              >{{ t('admin.common.updatePreview') }}</button>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.bannersPage.tag') }}</label>
            <input
              v-model="form.tag"
              class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.bannersPage.titleField') }} *</label>
            <input
              v-model="form.title"
              class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.bannersPage.desc') }}</label>
            <textarea
              v-model="form.desc"
              rows="2"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
          <div class="sm:col-span-2 flex items-center gap-2">
            <input type="checkbox" id="enabled" v-model="form.enabled" class="accent-red-700" />
            <label for="enabled" class="text-sm text-gray-700">{{ t('admin.bannersPage.displayNow') }}</label>
          </div>
        </div>

        <!-- Preset Images -->
        <div>
          <p class="text-xs font-medium text-gray-700 mb-2">{{ t('admin.bannersPage.quickSelect') }}</p>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="preset in presets"
              :key="preset"
              @click="form.image = preset; previewImage = preset"
              class="relative rounded-lg overflow-hidden aspect-video cursor-pointer border-2 transition-all hover:scale-105"
              :class="form.image === preset ? 'border-red-500' : 'border-transparent'"
            >
              <img :src="preset" class="w-full h-full object-cover" />
              <div v-if="form.image === preset" class="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                <Check class="text-white" :size="16" />
              </div>
            </button>
          </div>
          <div class="flex gap-2 mt-2">
            <input
              v-model="newPresetUrl"
              @keyup.enter="addPreset"
              placeholder="https://images.unsplash.com/..."
              class="flex-1 h-8 border border-gray-300 rounded-md px-3 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="button"
              @click="addPreset"
              class="h-8 px-3 bg-red-700 hover:bg-red-800 text-white rounded-md text-xs shrink-0 cursor-pointer"
            >{{ t('admin.common.addPreset') }}</button>
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="showModal = false" class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
          {{ t('admin.common.cancel') }}
        </button>
        <button @click="handleSave" class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
          {{ editingId !== null ? t('admin.common.saveChanges') : t('admin.bannersPage.addBanner') }}
        </button>
      </template>
    </Modal>
  </div>
</template>
