<script setup>
import { ref, onMounted } from 'vue'
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from '@/api'
import { useToastStore } from '@/stores/toast'
import { useI18n } from 'vue-i18n'
import { Plus, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Modal from '@/components/ui/Modal.vue'
import Badge from '@/components/ui/Badge.vue'

const { t } = useI18n()
const toast = useToastStore()
const products = ref([])
const pagination = ref({})
const loading = ref(false)
const showModal = ref(false)
const deleting = ref(null)
const saving = ref(false)
const currentPage = ref(1)

const defaultForm = () => ({
  title: '', category: '', origin_price: '', price: '',
  unit: '', description: '', content: '', imageUrl: '',
  is_enabled: 1,
})
const form = ref(defaultForm())
const editingId = ref(null)

async function fetchProducts(page = 1) {
  loading.value = true
  try {
    const res = await getAdminProducts(page)
    products.value = res.data.products
    pagination.value = res.data.pagination
    currentPage.value = page
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchProducts())

function openCreate() {
  form.value = defaultForm()
  editingId.value = null
  showModal.value = true
}

function openEdit(product) {
  form.value = { ...product }
  editingId.value = product.id
  showModal.value = true
}

async function handleSave() {
  if (!form.value.title || !form.value.price) {
    toast.error(t('toast.productRequired'))
    return
  }
  saving.value = true
  try {
    const data = {
      ...form.value,
      origin_price: Number(form.value.origin_price),
      price: Number(form.value.price),
    }
    if (editingId.value) {
      await updateProduct(editingId.value, data)
      toast.success(t('toast.productUpdated'))
    } else {
      await createProduct(data)
      toast.success(t('toast.productAdded'))
    }
    showModal.value = false
    fetchProducts(currentPage.value)
  } catch (e) {
    toast.error(e.response?.data?.message || t('toast.operationFailed'))
  } finally {
    saving.value = false
  }
}

async function handleDelete(id) {
  if (!confirm(t('admin.productsPage.deleteConfirm'))) return
  deleting.value = id
  try {
    await deleteProduct(id)
    toast.success(t('toast.productDeleted'))
    fetchProducts(currentPage.value)
  } catch {
    toast.error(t('toast.deleteFailed'))
  } finally {
    deleting.value = null
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ t('admin.productsPage.title') }}</h1>
      <button @click="openCreate" class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
        <Plus :size="16" /> {{ t('admin.productsPage.addProduct') }}
      </button>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div v-if="loading" class="flex justify-center py-16">
        <Loader2 class="animate-spin text-red-700" :size="32" />
      </div>

      <table v-else class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{{ t('admin.productsPage.image') }}</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{{ t('admin.productsPage.name') }}</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">{{ t('admin.productsPage.category') }}</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">{{ t('admin.productsPage.price') }}</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{{ t('admin.productsPage.status') }}</th>
            <th class="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{{ t('admin.common.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3">
              <img :src="product.imageUrl || product.image" :alt="product.title" class="w-12 h-12 object-cover rounded-lg bg-gray-100" @error="$event.target.src='https://images.unsplash.com/photo-1563245372-f21724e3856d?w=60&q=80'" />
            </td>
            <td class="px-4 py-3">
              <p class="font-medium text-gray-900 text-sm">{{ product.title }}</p>
              <p class="text-xs text-gray-500 truncate max-w-[200px]">{{ product.description }}</p>
            </td>
            <td class="px-4 py-3 hidden sm:table-cell">
              <Badge variant="secondary">{{ product.category }}</Badge>
            </td>
            <td class="px-4 py-3 hidden md:table-cell text-sm font-medium text-gray-900">NT$ {{ product.price }}</td>
            <td class="px-4 py-3">
              <Badge :variant="product.is_enabled ? 'success' : 'outline'">
                {{ product.is_enabled ? t('admin.common.onShelf') : t('admin.common.offShelf') }}
              </Badge>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <button @click="openEdit(product)" class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer">
                  <Pencil :size="15" />
                </button>
                <button @click="handleDelete(product.id)" :disabled="deleting === product.id" class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer disabled:opacity-50">
                  <Loader2 v-if="deleting === product.id" class="animate-spin" :size="15" />
                  <Trash2 v-else :size="15" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination.total_pages > 1" class="flex items-center justify-center gap-2 p-4 border-t">
        <button @click="fetchProducts(currentPage - 1)" :disabled="!pagination.has_pre" class="p-1.5 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50 cursor-pointer">
          <ChevronLeft :size="16" />
        </button>
        <span class="text-sm text-gray-600">{{ currentPage }} / {{ pagination.total_pages }}</span>
        <button @click="fetchProducts(currentPage + 1)" :disabled="!pagination.has_next" class="p-1.5 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50 cursor-pointer">
          <ChevronRight :size="16" />
        </button>
      </div>
    </div>

    <!-- Product Modal -->
    <Modal :show="showModal" :title="editingId ? t('admin.productsPage.editProduct') : t('admin.productsPage.addProduct')" size="lg" @close="showModal = false">
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.productsPage.name') }} *</label>
          <input v-model="form.title" :placeholder="t('admin.productsPage.name')" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.productsPage.category') }}</label>
          <input v-model="form.category" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.productsPage.unit') }}</label>
          <input v-model="form.unit" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.productsPage.originPrice') }}</label>
          <input v-model="form.origin_price" type="number" placeholder="0" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.productsPage.price') }} *</label>
          <input v-model="form.price" type="number" placeholder="0" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.productsPage.imageUrl') }}</label>
          <input v-model="form.imageUrl" placeholder="https://..." class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.productsPage.description') }}</label>
          <textarea v-model="form.description" rows="2" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.productsPage.content') }}</label>
          <textarea v-model="form.content" rows="2" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
        </div>
        <div class="sm:col-span-2 flex items-center gap-2">
          <input type="checkbox" id="enabled" v-model="form.is_enabled" :true-value="1" :false-value="0" class="accent-red-700" />
          <label for="enabled" class="text-sm text-gray-700">{{ t('admin.productsPage.enableLabel') }}</label>
        </div>
      </div>
      <template #footer>
        <button @click="showModal = false" class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">{{ t('admin.common.cancel') }}</button>
        <button @click="handleSave" :disabled="saving" class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer">
          <Loader2 v-if="saving" class="animate-spin" :size="14" />
          {{ editingId ? t('admin.common.saveChanges') : t('admin.productsPage.addProduct') }}
        </button>
      </template>
    </Modal>
  </div>
</template>
