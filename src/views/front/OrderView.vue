<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getOrder, payOrder } from '@/api'
import { useToastStore } from '@/stores/toast'
import { CheckCircle, Loader2, CreditCard } from 'lucide-vue-next'

const route = useRoute()
const toast = useToastStore()
const order = ref(null)
const loading = ref(true)
const paying = ref(false)

onMounted(async () => {
  try {
    const res = await getOrder(route.params.id)
    order.value = res.data.order
  } finally {
    loading.value = false
  }
})

async function handlePay() {
  paying.value = true
  try {
    const res = await payOrder(route.params.id)
    if (res.data.success) {
      toast.success('付款成功！')
      order.value.is_paid = true
    }
  } catch {
    toast.error('付款失敗，請稍後再試')
  } finally {
    paying.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center py-20">
      <Loader2 class="animate-spin text-red-700" :size="36" />
    </div>

    <div v-else-if="order">
      <div class="text-center mb-8">
        <CheckCircle class="mx-auto text-green-600 mb-3" :size="56" />
        <h1 class="text-3xl font-bold text-gray-900">訂單已建立</h1>
        <p class="text-gray-500 mt-2">訂單編號：{{ order.id }}</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h2 class="font-semibold text-gray-900 mb-4">訂購商品</h2>
        <div class="space-y-3">
          <div v-for="(item, key) in order.products" :key="key" class="flex justify-between text-sm">
            <span class="text-gray-700">{{ item.product?.title }} × {{ item.qty }}</span>
            <span class="font-medium">NT$ {{ item.final_total || item.total }}</span>
          </div>
        </div>
        <div class="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
          <span>總計</span>
          <span class="text-red-700">NT$ {{ order.final_total }}</span>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 class="font-semibold text-gray-900 mb-3">聯絡資料</h2>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div><span class="text-gray-500">姓名：</span>{{ order.user?.name }}</div>
          <div><span class="text-gray-500">電話：</span>{{ order.user?.tel }}</div>
          <div class="col-span-2"><span class="text-gray-500">Email：</span>{{ order.user?.email }}</div>
          <div class="col-span-2"><span class="text-gray-500">地址：</span>{{ order.user?.address }}</div>
        </div>
      </div>

      <div class="text-center">
        <div v-if="order.is_paid" class="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-full font-semibold">
          <CheckCircle :size="18" /> 已完成付款
        </div>
        <button
          v-else
          @click="handlePay"
          :disabled="paying"
          class="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-colors disabled:opacity-60 cursor-pointer"
        >
          <Loader2 v-if="paying" class="animate-spin" :size="18" />
          <CreditCard v-else :size="18" />
          立即付款
        </button>
      </div>

      <div class="text-center mt-6">
        <RouterLink to="/menu" class="text-red-700 hover:underline text-sm">繼續點餐</RouterLink>
      </div>
    </div>
  </div>
</template>
