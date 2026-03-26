<script setup>
import { ref, onMounted } from 'vue'
import { getAdminCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/api'
import { useToastStore } from '@/stores/toast'
import { useLocaleStore } from '@/stores/locale'
import { useI18n } from 'vue-i18n'
import { Plus, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Modal from '@/components/ui/Modal.vue'
import Badge from '@/components/ui/Badge.vue'

const { t } = useI18n()
const toast = useToastStore()
const localeStore = useLocaleStore()
const coupons = ref([])
const pagination = ref({})
const loading = ref(false)
const showModal = ref(false)
const saving = ref(false)
const deleting = ref(null)
const editingId = ref(null)
const currentPage = ref(1)

const defaultForm = () => ({
  title: '', code: '', percent: 80, due_date: '', is_enabled: 0,
})
const form = ref(defaultForm())

async function fetchCoupons(page = 1) {
  loading.value = true
  try {
    const res = await getAdminCoupons(page)
    coupons.value = res.data.coupons
    pagination.value = res.data.pagination
    currentPage.value = page
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchCoupons())

function openCreate() {
  form.value = defaultForm()
  editingId.value = null
  showModal.value = true
}

function openEdit(coupon) {
  form.value = {
    ...coupon,
    due_date: coupon.due_date
      ? new Date(coupon.due_date * 1000).toISOString().split('T')[0]
      : '',
  }
  editingId.value = coupon.id
  showModal.value = true
}

async function handleSave() {
  if (!form.value.title || !form.value.code) {
    toast.error(t('toast.couponRequired'))
    return
  }
  saving.value = true
  try {
    const data = {
      ...form.value,
      percent: Number(form.value.percent),
      due_date: form.value.due_date ? new Date(form.value.due_date).getTime() / 1000 : null,
    }
    if (editingId.value) {
      await updateCoupon(editingId.value, data)
      toast.success(t('toast.couponUpdated'))
    } else {
      await createCoupon(data)
      toast.success(t('toast.couponAdded'))
    }
    showModal.value = false
    fetchCoupons(currentPage.value)
  } catch (e) {
    toast.error(e.response?.data?.message || t('toast.operationFailed'))
  } finally {
    saving.value = false
  }
}

async function handleDelete(id) {
  if (!confirm(t('admin.couponsPage.deleteConfirm'))) return
  deleting.value = id
  try {
    await deleteCoupon(id)
    toast.success(t('toast.couponDeleted'))
    fetchCoupons(currentPage.value)
  } catch {
    toast.error(t('toast.deleteFailed'))
  } finally {
    deleting.value = null
  }
}

function formatDate(timestamp) {
  if (!timestamp) return '-'
  const localeMap = { 'zh-TW': 'zh-TW', en: 'en-US', ja: 'ja-JP' }
  return new Date(timestamp * 1000).toLocaleDateString(localeMap[localeStore.locale] || 'zh-TW')
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ t('admin.couponsPage.title') }}</h1>
      <button @click="openCreate" class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
        <Plus :size="16" /> {{ t('admin.couponsPage.addCoupon') }}
      </button>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div v-if="loading" class="flex justify-center py-16">
        <Loader2 class="animate-spin text-red-700" :size="32" />
      </div>

      <table v-else class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{{ t('admin.couponsPage.name') }}</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">{{ t('admin.couponsPage.codeLabel') }}</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">{{ t('admin.couponsPage.discountLabel') }}</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">{{ t('admin.couponsPage.expiry') }}</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{{ t('admin.productsPage.status') }}</th>
            <th class="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{{ t('admin.common.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="coupon in coupons" :key="coupon.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3 font-medium text-gray-900 text-sm">{{ coupon.title }}</td>
            <td class="px-4 py-3 hidden sm:table-cell">
              <code class="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">{{ coupon.code }}</code>
            </td>
            <td class="px-4 py-3 hidden md:table-cell text-sm text-gray-700">{{ coupon.percent }}% off</td>
            <td class="px-4 py-3 hidden md:table-cell text-sm text-gray-500">{{ formatDate(coupon.due_date) }}</td>
            <td class="px-4 py-3">
              <Badge :variant="coupon.is_enabled ? 'success' : 'outline'">
                {{ coupon.is_enabled ? t('admin.common.enabled') : t('admin.common.disabled') }}
              </Badge>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <button @click="openEdit(coupon)" class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer">
                  <Pencil :size="15" />
                </button>
                <button @click="handleDelete(coupon.id)" :disabled="deleting === coupon.id" class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer disabled:opacity-50">
                  <Loader2 v-if="deleting === coupon.id" class="animate-spin" :size="15" />
                  <Trash2 v-else :size="15" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="coupons.length === 0">
            <td colspan="6" class="text-center py-12 text-gray-400">{{ t('admin.couponsPage.noCoupons') }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="pagination.total_pages > 1" class="flex items-center justify-center gap-2 p-4 border-t">
        <button @click="fetchCoupons(currentPage - 1)" :disabled="!pagination.has_pre" class="p-1.5 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50 cursor-pointer">
          <ChevronLeft :size="16" />
        </button>
        <span class="text-sm text-gray-600">{{ currentPage }} / {{ pagination.total_pages }}</span>
        <button @click="fetchCoupons(currentPage + 1)" :disabled="!pagination.has_next" class="p-1.5 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50 cursor-pointer">
          <ChevronRight :size="16" />
        </button>
      </div>
    </div>

    <!-- Coupon Modal -->
    <Modal :show="showModal" :title="editingId ? t('admin.couponsPage.editCoupon') : t('admin.couponsPage.addCoupon')" @close="showModal = false">
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.couponsPage.couponName') }} *</label>
          <input v-model="form.title" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.couponsPage.code') }} *</label>
          <input v-model="form.code" placeholder="SPRING20" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.couponsPage.discountPercent') }}</label>
          <input v-model="form.percent" type="number" min="1" max="100" placeholder="80" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.couponsPage.expiry') }}</label>
          <input v-model="form.due_date" type="date" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" id="coupon_enabled" v-model="form.is_enabled" :true-value="1" :false-value="0" class="accent-red-700" />
          <label for="coupon_enabled" class="text-sm text-gray-700">{{ t('admin.couponsPage.enableCoupon') }}</label>
        </div>
      </div>
      <template #footer>
        <button @click="showModal = false" class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">{{ t('admin.common.cancel') }}</button>
        <button @click="handleSave" :disabled="saving" class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60 cursor-pointer">
          <Loader2 v-if="saving" class="animate-spin" :size="14" />
          {{ editingId ? t('admin.common.saveChanges') : t('admin.couponsPage.addCoupon') }}
        </button>
      </template>
    </Modal>
  </div>
</template>
