<script setup>
import { ref } from 'vue'
import { useFeaturesStore } from '@/stores/features'
import { useToastStore } from '@/stores/toast'
import { Plus, Pencil, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Image, Check } from 'lucide-vue-next'
import Modal from '@/components/ui/Modal.vue'
import Badge from '@/components/ui/Badge.vue'

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

const presets = [
  'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&q=85',
  'https://images.unsplash.com/photo-1569558035069-a31a5f9b3a8c?w=800&q=85',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85',
  'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=85',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=85',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=85',
  'https://images.unsplash.com/photo-1562802378-063ec186a863?w=800&q=85',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=85',
]

function openCreate() {
  form.value = defaultForm()
  editingId.value = null
  showModal.value = true
}

function openEdit(item) {
  form.value = { ...item }
  editingId.value = item.id
  showModal.value = true
}

function handleSave() {
  if (!form.value.title || !form.value.image) {
    toast.error('請填寫標題及圖片網址')
    return
  }
  if (editingId.value !== null) {
    store.update(editingId.value, { ...form.value })
    toast.success('特色區塊已更新')
  } else {
    store.add({ ...form.value })
    toast.success('特色區塊已新增')
  }
  showModal.value = false
}

function handleDelete(id) {
  if (!confirm('確定刪除此區塊？')) return
  store.remove(id)
  toast.success('已刪除')
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">首頁特色區塊</h1>
        <p class="text-sm text-gray-500 mt-1">管理首頁「品牌特色」三欄區塊的圖片與文案內容</p>
      </div>
      <button
        @click="openCreate"
        class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      >
        <Plus :size="16" /> 新增區塊
      </button>
    </div>

    <!-- Preview hint -->
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-700 flex items-center gap-2">
      <span>💡</span>
      <span>建議新增 3 個區塊，前台將以三欄並排呈現；超過 3 個也會自動排列。</span>
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
              <Badge :variant="item.enabled ? 'success' : 'outline'" class="text-xs">{{ item.enabled ? '顯示中' : '已隱藏' }}</Badge>
            </div>
            <p class="text-xs text-red-600 font-medium">{{ item.subtitle }}</p>
            <h3 class="font-bold text-gray-900 text-base mt-0.5 mb-1">{{ item.title }}</h3>
            <p class="text-gray-500 text-xs line-clamp-2 leading-relaxed">{{ item.desc }}</p>
          </div>

          <div class="flex items-center gap-1 mt-3 flex-wrap">
            <button
              @click="store.toggleEnabled(item.id); toast.success(item.enabled ? '已隱藏' : '已顯示')"
              :class="['flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer', item.enabled ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100']"
            >
              <Eye v-if="item.enabled" :size="13" />
              <EyeOff v-else :size="13" />
              {{ item.enabled ? '顯示' : '隱藏' }}
            </button>
            <button @click="store.moveUp(item.id)" :disabled="idx === 0" class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer disabled:cursor-default" title="上移">
              <ChevronUp :size="15" />
            </button>
            <button @click="store.moveDown(item.id)" :disabled="idx === store.items.length - 1" class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer disabled:cursor-default" title="下移">
              <ChevronDown :size="15" />
            </button>
            <button @click="openEdit(item)" class="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer" title="編輯">
              <Pencil :size="15" />
            </button>
            <button @click="handleDelete(item.id)" class="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer" title="刪除">
              <Trash2 :size="15" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="store.items.length === 0" class="text-center py-16 text-gray-400">
        <Image class="mx-auto mb-3 opacity-30" :size="48" />
        <p>尚未新增任何特色區塊</p>
      </div>
    </div>

    <!-- Modal -->
    <Modal :show="showModal" :title="editingId !== null ? '編輯特色區塊' : '新增特色區塊'" size="lg" @close="showModal = false">
      <div class="space-y-4">

        <!-- Preview card -->
        <div class="relative rounded-xl overflow-hidden bg-gray-100 h-48 group">
          <img
            v-if="form.image"
            :src="form.image"
            alt="預覽"
            class="w-full h-full object-cover"
            @error="$event.target.src=''"
          />
          <div v-if="form.image" class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
            <div>
              <p class="text-red-300 text-xs font-semibold mb-0.5">{{ form.subtitle || '副標題' }}</p>
              <p class="text-white font-bold text-xl leading-tight">{{ form.title || '主標題' }}</p>
              <p class="text-white/70 text-xs mt-1 line-clamp-2">{{ form.desc }}</p>
            </div>
          </div>
          <div v-else class="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
            <Image :size="32" />
            <span class="text-sm">輸入圖片網址後預覽</span>
          </div>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">圖片網址 *</label>
            <input
              v-model="form.image"
              placeholder="https://images.unsplash.com/..."
              class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <!-- Preset images -->
          <div>
            <p class="text-xs font-medium text-gray-600 mb-2">快速選用</p>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="p in presets"
                :key="p"
                @click="form.image = p"
                class="relative rounded-lg overflow-hidden aspect-video cursor-pointer border-2 transition-all hover:scale-105"
                :class="form.image === p ? 'border-red-500' : 'border-transparent'"
              >
                <img :src="p" class="w-full h-full object-cover" />
                <div v-if="form.image === p" class="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                  <Check class="text-white" :size="14" />
                </div>
              </button>
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">主標題 *</label>
              <input v-model="form.title" placeholder="例：嚴選頂級食材" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">副標題</label>
              <input v-model="form.subtitle" placeholder="例：每日直送・品質保證" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">說明文案</label>
            <textarea
              v-model="form.desc"
              rows="3"
              placeholder="詳細描述這個特色的說明文字..."
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none leading-relaxed"
            />
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" id="feat_enabled" v-model="form.enabled" class="accent-red-700" />
            <label for="feat_enabled" class="text-sm text-gray-700">顯示於首頁</label>
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="showModal = false" class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">取消</button>
        <button @click="handleSave" class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
          {{ editingId !== null ? '儲存變更' : '新增區塊' }}
        </button>
      </template>
    </Modal>
  </div>
</template>
