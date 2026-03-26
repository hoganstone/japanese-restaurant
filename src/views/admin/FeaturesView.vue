<script setup>
import { ref } from 'vue'
import { useFeaturesStore } from '@/stores/features'
import { useToastStore } from '@/stores/toast'
import { useI18n } from 'vue-i18n'
import { Plus, Pencil, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Image, Check, X } from 'lucide-vue-next'
import Modal from '@/components/ui/Modal.vue'
import Badge from '@/components/ui/Badge.vue'

const { t } = useI18n()
const store = useFeaturesStore()
const toast = useToastStore()

const showModal = ref(false)
const editingId = ref(null)

const defaultForm = () => ({
  image: '',
  title: '',
  subtitle: '',
  desc: '',
  enabled: true,
})
const form = ref(defaultForm())
const previewSrc = ref('')

const presets = ref([
  'https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=800&q=85',
  'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&q=85',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85',
  'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=85',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=85',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=85',
  'https://images.unsplash.com/photo-1562802378-063ec186a863?w=800&q=85',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=85',
  'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=85',
  'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=85',
  'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800&q=85',
  'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&q=85',
])
const newPresetUrl = ref('')
const failedPresets = ref([])
const visiblePresets = computed(() => presets.value.filter(p => !failedPresets.value.includes(p)))

function addPreset() {
  const url = newPresetUrl.value.trim()
  if (!url || presets.value.includes(url)) return
  presets.value.push(url)
  newPresetUrl.value = ''
}

function removePreset(url) {
  presets.value = presets.value.filter(p => p !== url)
  failedPresets.value = failedPresets.value.filter(p => p !== url)
}

function onPresetError(url) {
  if (!failedPresets.value.includes(url)) failedPresets.value.push(url)
}

function applyPreview() {
  previewSrc.value = form.value.image
}

function selectPreset(url) {
  form.value.image = url
  previewSrc.value = url
}

function openCreate() {
  form.value = defaultForm()
  editingId.value = null
  previewSrc.value = ''
  showModal.value = true
}

function openEdit(item) {
  form.value = { ...item }
  editingId.value = item.id
  previewSrc.value = item.image
  showModal.value = true
}

function handleSave() {
  if (!form.value.title || !form.value.image) {
    toast.error(t('toast.featureRequired'))
    return
  }
  if (editingId.value !== null) {
    store.update(editingId.value, { ...form.value })
    toast.success(t('toast.featureUpdated'))
  } else {
    store.add({ ...form.value })
    toast.success(t('toast.featureAdded'))
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
        <h1 class="text-2xl font-bold text-gray-900">{{ t('admin.featuresPage.title') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ t('admin.featuresPage.subtitle') }}</p>
      </div>
      <button
        @click="openCreate"
        class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      >
        <Plus :size="16" /> {{ t('admin.featuresPage.addFeature') }}
      </button>
    </div>

    <!-- Preview hint -->
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-700 flex items-center gap-2">
      <span>💡</span>
      <span>{{ t('admin.featuresPage.hint') }}</span>
    </div>

    <!-- List -->
    <div class="space-y-3">
      <div
        v-for="(item, idx) in store.items"
        :key="item.id"
        :class="['bg-white rounded-xl border overflow-hidden flex transition-all', item.enabled ? 'border-gray-200' : 'border-gray-100 opacity-60']"
      >
        <!-- Image -->
        <div class="w-32 sm:w-44 shrink-0 relative overflow-hidden bg-gray-100">
          <img
            :src="item.image"
            :alt="item.title"
            class="w-full h-full object-cover"
            @error="$event.target.src='https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=60'"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span class="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">#{{ idx + 1 }}</span>
        </div>

        <!-- Content -->
        <div class="flex-1 p-4 min-w-0 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <Badge :variant="item.enabled ? 'success' : 'outline'" class="text-xs">
                {{ item.enabled ? t('admin.featuresPage.showing') : t('admin.featuresPage.isHidden') }}
              </Badge>
            </div>
            <p class="text-xs text-red-600 font-medium">{{ item.subtitle }}</p>
            <h3 class="font-bold text-gray-900 text-base mt-0.5 mb-1">{{ item.title }}</h3>
            <p class="text-gray-500 text-xs line-clamp-2 leading-relaxed">{{ item.desc }}</p>
          </div>

          <div class="flex items-center gap-1 mt-3 flex-wrap">
            <button
              @click="store.toggleEnabled(item.id); toast.success(item.enabled ? t('toast.hiddenMsg') : t('toast.shown'))"
              :class="['flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer', item.enabled ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100']"
            >
              <Eye v-if="item.enabled" :size="13" />
              <EyeOff v-else :size="13" />
              {{ item.enabled ? t('admin.featuresPage.show') : t('admin.featuresPage.hide') }}
            </button>
            <button @click="store.moveUp(item.id)" :disabled="idx === 0" class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer disabled:cursor-default">
              <ChevronUp :size="15" />
            </button>
            <button @click="store.moveDown(item.id)" :disabled="idx === store.items.length - 1" class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer disabled:cursor-default">
              <ChevronDown :size="15" />
            </button>
            <button @click="openEdit(item)" class="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer">
              <Pencil :size="15" />
            </button>
            <button @click="handleDelete(item.id)" class="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer">
              <Trash2 :size="15" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="store.items.length === 0" class="text-center py-16 text-gray-400">
        <Image class="mx-auto mb-3 opacity-30" :size="48" />
        <p>{{ t('admin.featuresPage.noFeatures') }}</p>
      </div>
    </div>

    <!-- Modal -->
    <Modal :show="showModal" :title="editingId !== null ? t('admin.featuresPage.editFeature') : t('admin.featuresPage.addBlock')" size="lg" @close="showModal = false">
      <div class="space-y-4">

        <!-- Preview card -->
        <div class="relative rounded-xl overflow-hidden bg-gray-100 h-48 group">
          <img
            v-if="previewSrc"
            :src="previewSrc"
            alt="preview"
            class="w-full h-full object-cover"
            @error="$event.target.src=''"
          />
          <div v-if="previewSrc" class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
            <div>
              <p class="text-red-300 text-xs font-semibold mb-0.5">{{ form.subtitle || t('admin.featuresPage.subtitleField') }}</p>
              <p class="text-white font-bold text-xl leading-tight">{{ form.title || t('admin.featuresPage.mainTitle') }}</p>
              <p class="text-white/70 text-xs mt-1 line-clamp-2">{{ form.desc }}</p>
            </div>
          </div>
          <div v-if="!previewSrc" class="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
            <Image :size="32" />
            <span class="text-sm">{{ t('admin.featuresPage.previewPlaceholder') }}</span>
          </div>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.featuresPage.imageUrl') }} *</label>
            <input
              v-model="form.image"
              @input="applyPreview"
              placeholder="https://images.unsplash.com/..."
              class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <!-- Preset images -->
          <div>
            <p class="text-xs font-medium text-gray-600 mb-2">{{ t('admin.featuresPage.quickSelect') }}</p>
            <div class="grid grid-cols-4 gap-2">
              <div
                v-for="p in visiblePresets"
                :key="p"
                class="relative rounded-lg overflow-hidden aspect-video border-2 transition-all hover:scale-105 group"
                :class="form.image === p ? 'border-red-500' : 'border-transparent'"
              >
                <button
                  type="button"
                  @click="selectPreset(p)"
                  class="w-full h-full cursor-pointer"
                >
                  <img :src="p" class="w-full h-full object-cover" @error="onPresetError(p)" />
                  <div v-if="form.image === p" class="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                    <Check class="text-white" :size="14" />
                  </div>
                </button>
                <button
                  type="button"
                  @click="removePreset(p)"
                  class="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                >
                  <X :size="10" />
                </button>
              </div>
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
              <button
                type="button"
                @click="removePreset(form.image)"
                :disabled="!presets.includes(form.image)"
                class="h-8 px-3 bg-gray-100 hover:bg-red-600 hover:text-white border border-gray-300 rounded-md text-xs text-gray-600 shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-default disabled:hover:bg-gray-100 disabled:hover:text-gray-600"
              >{{ t('admin.common.delete') }}</button>
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.featuresPage.mainTitle') }} *</label>
              <input v-model="form.title" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.featuresPage.subtitleField') }}</label>
              <input v-model="form.subtitle" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.featuresPage.descField') }}</label>
            <textarea
              v-model="form.desc"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none leading-relaxed"
            />
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" id="feat_enabled" v-model="form.enabled" class="accent-red-700" />
            <label for="feat_enabled" class="text-sm text-gray-700">{{ t('admin.featuresPage.displayOnHome') }}</label>
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="showModal = false" class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">{{ t('admin.common.cancel') }}</button>
        <button @click="handleSave" class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
          {{ editingId !== null ? t('admin.common.saveChanges') : t('admin.featuresPage.addFeature') }}
        </button>
      </template>
    </Modal>
  </div>
</template>
