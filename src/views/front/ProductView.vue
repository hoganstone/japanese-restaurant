<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getProduct } from '@/api'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { ShoppingCart, ChevronLeft, Loader2, Minus, Plus } from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'

const route = useRoute()
const cart = useCartStore()
const toast = useToastStore()

const product = ref(null)
const loading = ref(true)
const qty = ref(1)
const adding = ref(false)

onMounted(async () => {
  try {
    const res = await getProduct(route.params.id)
    product.value = res.data.product
  } finally {
    loading.value = false
  }
})

async function addToCart() {
  adding.value = true
  try {
    await cart.addItem(product.value.id, qty.value)
    toast.success(`已加入購物車：${product.value.title} x${qty.value}`)
  } catch {
    toast.error('加入失敗，請稍後再試')
  } finally {
    adding.value = false
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <RouterLink to="/menu" class="inline-flex items-center gap-1 text-gray-500 hover:text-red-700 mb-6 text-sm">
      <ChevronLeft :size="16" /> 返回菜單
    </RouterLink>

    <div v-if="loading" class="flex justify-center py-20">
      <Loader2 class="animate-spin text-red-700" :size="36" />
    </div>

    <div v-else-if="product" class="grid md:grid-cols-2 gap-10">
      <div class="aspect-square rounded-xl overflow-hidden bg-gray-100">
        <img
          :src="product.imageUrl || product.image"
          :alt="product.title"
          class="w-full h-full object-cover"
          @error="$event.target.src='https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80'"
        />
      </div>

      <div class="flex flex-col">
        <Badge variant="secondary" class="self-start mb-3">{{ product.category }}</Badge>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.title }}</h1>
        <p class="text-gray-600 leading-relaxed mb-6">{{ product.description }}</p>

        <div class="mb-6">
          <span class="text-4xl font-bold text-red-700">NT$ {{ product.price }}</span>
          <span v-if="product.origin_price && product.origin_price !== product.price" class="text-gray-400 text-lg line-through ml-2">{{ product.origin_price }}</span>
        </div>

        <div class="flex items-center gap-4 mb-6">
          <span class="text-gray-700 font-medium">數量</span>
          <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button @click="qty = Math.max(1, qty - 1)" class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
              <Minus :size="16" />
            </button>
            <span class="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center font-medium">{{ qty }}</span>
            <button @click="qty++" class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
              <Plus :size="16" />
            </button>
          </div>
        </div>

        <button
          @click="addToCart"
          :disabled="adding"
          class="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white py-3 px-8 rounded-xl font-semibold text-lg transition-colors disabled:opacity-60 cursor-pointer"
        >
          <Loader2 v-if="adding" class="animate-spin" :size="20" />
          <ShoppingCart v-else :size="20" />
          加入購物車
        </button>

        <div v-if="product.content" class="mt-8 p-4 bg-stone-50 rounded-xl">
          <h3 class="font-semibold text-gray-900 mb-2">料理說明</h3>
          <p class="text-gray-600 text-sm leading-relaxed">{{ product.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
