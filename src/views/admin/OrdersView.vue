<script setup>
import { ref, onMounted } from 'vue'
import { getAdminOrders, updateOrder, deleteOrder, deleteAllOrders } from '@/api'
import { useToastStore } from '@/stores/toast'
import { Eye, Trash2, Loader2, ChevronLeft, ChevronRight, CheckCircle, UtensilsCrossed, ShoppingBag } from 'lucide-vue-next'
import Modal from '@/components/ui/Modal.vue'
import Badge from '@/components/ui/Badge.vue'

const toast = useToastStore()
const orders = ref([])
const pagination = ref({})
const loading = ref(false)
const currentPage = ref(1)
const showModal = ref(false)
const selectedOrder = ref(null)
const updating = ref(null)
const deleting = ref(null)

async function fetchOrders(page = 1) {
  loading.value = true
  try {
    const res = await getAdminOrders(page)
    orders.value = res.data.orders
    pagination.value = res.data.pagination
    currentPage.value = page
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchOrders())

function openDetail(order) {
  selectedOrder.value = order
  showModal.value = true
}

async function togglePaid(order) {
  updating.value = order.id
  try {
    await updateOrder(order.id, { ...order, is_paid: !order.is_paid })
    toast.success(`訂單已標記為${!order.is_paid ? '已付款' : '未付款'}`)
    fetchOrders(currentPage.value)
    showModal.value = false
  } catch {
    toast.error('更新失敗')
  } finally {
    updating.value = null
  }
}

async function handleDelete(id) {
  if (!confirm('確定要刪除此訂單嗎？')) return
  deleting.value = id
  try {
    await deleteOrder(id)
    toast.success('訂單已刪除')
    fetchOrders(currentPage.value)
  } catch {
    toast.error('刪除失敗')
  } finally {
    deleting.value = null
  }
}

async function handleDeleteAll() {
  if (!confirm('確定要刪除所有訂單嗎？此操作無法復原！')) return
  loading.value = true
  try {
    await deleteAllOrders()
    toast.success('所有訂單已刪除')
    fetchOrders(1)
  } catch {
    toast.error('刪除失敗')
  } finally {
    loading.value = false
  }
}

function formatDate(timestamp) {
  if (!timestamp) return '-'
  return new Date(timestamp * 1000).toLocaleDateString('zh-TW')
}

function getOrderType(order) {
  if (order.message?.startsWith('【內用】') || order.user?.name?.startsWith('桌號')) {
    const match = order.message?.match(/桌號：(.+?)(?:　|$)/)
    return { type: 'dine-in', label: '內用', table: match?.[1] || '' }
  }
  return { type: 'takeout', label: '外帶', table: '' }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">訂單管理</h1>
      <button v-if="orders.length" @click="handleDeleteAll" class="flex items-center gap-2 border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
        <Trash2 :size="15" /> 刪除全部
      </button>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div v-if="loading" class="flex justify-center py-16">
        <Loader2 class="animate-spin text-red-700" :size="32" />
      </div>

      <table v-else class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">訂單 ID</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">訂購人</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">用餐方式</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">日期</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">金額</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">付款</th>
            <th class="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3 text-xs text-gray-500 font-mono">{{ order.id?.slice(0, 8) }}...</td>
            <td class="px-4 py-3 hidden sm:table-cell text-sm text-gray-700">{{ order.user?.name || '-' }}</td>
            <td class="px-4 py-3">
              <div v-if="getOrderType(order).type === 'dine-in'" class="flex items-center gap-1.5">
                <span class="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-medium">
                  <UtensilsCrossed :size="11" /> 內用
                </span>
                <span v-if="getOrderType(order).table" class="text-xs text-gray-500">桌 {{ getOrderType(order).table }}</span>
              </div>
              <span v-else class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-xs font-medium">
                <ShoppingBag :size="11" /> 外帶
              </span>
            </td>
            <td class="px-4 py-3 hidden md:table-cell text-sm text-gray-500">{{ formatDate(order.create_at) }}</td>
            <td class="px-4 py-3 text-sm font-medium text-gray-900">NT$ {{ order.total }}</td>
            <td class="px-4 py-3">
              <Badge :variant="order.is_paid ? 'success' : 'destructive'">
                {{ order.is_paid ? '已付款' : '未付款' }}
              </Badge>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <button @click="openDetail(order)" class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer">
                  <Eye :size="15" />
                </button>
                <button @click="handleDelete(order.id)" :disabled="deleting === order.id" class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer disabled:opacity-50">
                  <Loader2 v-if="deleting === order.id" class="animate-spin" :size="15" />
                  <Trash2 v-else :size="15" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="orders.length === 0">
            <td colspan="6" class="text-center py-12 text-gray-400">目前沒有訂單</td>
          </tr>
        </tbody>
      </table>

      <div v-if="pagination.total_pages > 1" class="flex items-center justify-center gap-2 p-4 border-t">
        <button @click="fetchOrders(currentPage - 1)" :disabled="!pagination.has_pre" class="p-1.5 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50 cursor-pointer">
          <ChevronLeft :size="16" />
        </button>
        <span class="text-sm text-gray-600">第 {{ currentPage }} / {{ pagination.total_pages }} 頁</span>
        <button @click="fetchOrders(currentPage + 1)" :disabled="!pagination.has_next" class="p-1.5 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50 cursor-pointer">
          <ChevronRight :size="16" />
        </button>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <Modal :show="showModal" title="訂單詳情" size="lg" @close="showModal = false">
      <div v-if="selectedOrder">
        <div class="grid grid-cols-2 gap-3 text-sm mb-4">
          <div class="col-span-2 flex items-center gap-2">
            <span class="text-gray-500">用餐方式：</span>
            <span v-if="getOrderType(selectedOrder).type === 'dine-in'" class="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
              <UtensilsCrossed :size="12" /> 內用　桌號：{{ getOrderType(selectedOrder).table || '-' }}
            </span>
            <span v-else class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
              <ShoppingBag :size="12" /> 外帶
            </span>
          </div>
          <div><span class="text-gray-500">訂購人：</span>{{ selectedOrder.user?.name }}</div>
          <div><span class="text-gray-500">電話：</span>{{ selectedOrder.user?.tel }}</div>
          <div class="col-span-2"><span class="text-gray-500">Email：</span>{{ selectedOrder.user?.email }}</div>
          <div class="col-span-2"><span class="text-gray-500">地址：</span>{{ selectedOrder.user?.address }}</div>
          <div v-if="selectedOrder.message" class="col-span-2"><span class="text-gray-500">備註：</span>{{ selectedOrder.message }}</div>
        </div>

        <div class="border rounded-lg overflow-hidden mb-4">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="text-left px-3 py-2 text-xs text-gray-600">商品</th>
                <th class="text-center px-3 py-2 text-xs text-gray-600">數量</th>
                <th class="text-right px-3 py-2 text-xs text-gray-600">金額</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="(item, key) in selectedOrder.products" :key="key">
                <td class="px-3 py-2">{{ item.product?.title }}</td>
                <td class="px-3 py-2 text-center">{{ item.qty }}</td>
                <td class="px-3 py-2 text-right">NT$ {{ item.final_total || item.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-between font-bold text-lg mb-4">
          <span>總計</span>
          <span class="text-red-700">NT$ {{ selectedOrder.total }}</span>
        </div>

        <div class="flex items-center gap-3">
          <Badge :variant="selectedOrder.is_paid ? 'success' : 'destructive'" class="text-sm px-3 py-1">
            {{ selectedOrder.is_paid ? '已付款' : '未付款' }}
          </Badge>
          <button
            @click="togglePaid(selectedOrder)"
            :disabled="updating === selectedOrder.id"
            class="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-sm cursor-pointer"
          >
            <Loader2 v-if="updating === selectedOrder.id" class="animate-spin" :size="14" />
            <CheckCircle v-else :size="14" />
            {{ selectedOrder.is_paid ? '標記未付款' : '標記已付款' }}
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>
