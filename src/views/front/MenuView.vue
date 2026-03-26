<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { RouterLink } from 'vue-router'
import { ShoppingCart, Search, Loader2 } from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'

const products = useProductsStore()
const cart = useCartStore()
const toast = useToastStore()

const selectedCategory = ref('全部')
const search = ref('')
const addingId = ref(null)

onMounted(async () => {
  await products.fetchAll()
})

const allCategories = computed(() => ['全部', ...products.categories])

const filtered = computed(() => {
  let list = products.products
  if (selectedCategory.value !== '全部') {
    list = list.filter(p => p.category === selectedCategory.value)
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p => p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
  }
  return list
})

async function handleAddToCart(product) {
  addingId.value = product.id
  try {
    await cart.addItem(product.id, 1)
    toast.success(`已加入購物車：${product.title}`)
  } catch {
    toast.error('加入失敗，請稍後再試')
  } finally {
    addingId.value = null
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">菜單</h1>
    <p class="text-gray-500 mb-8">精選日式料理，享受道地風味</p>

    <!-- Search + Filter -->
    <div class="flex flex-col sm:flex-row gap-4 mb-8">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="16" />
        <input
          v-model="search"
          placeholder="搜尋料理..."
          class="w-full pl-9 pr-3 h-9 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="cat in allCategories"
          :key="cat"
          @click="selectedCategory = cat"
          :class="[
            'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
            selectedCategory === cat
              ? 'bg-red-700 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-700'
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="products.loading" class="flex justify-center py-20">
      <Loader2 class="animate-spin text-red-700" :size="36" />
    </div>

    <!-- Products Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="product in filtered"
        :key="product.id"
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
      >
        <RouterLink :to="`/product/${product.id}`">
          <div class="aspect-[4/3] overflow-hidden bg-gray-100">
            <img
              :src="product.imageUrl || product.image"
              :alt="product.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              @error="$event.target.src='https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80'"
            />
          </div>
        </RouterLink>
        <div class="p-4">
          <div class="flex items-start justify-between gap-2 mb-1">
            <RouterLink :to="`/product/${product.id}`" class="font-semibold text-gray-900 hover:text-red-700 leading-tight">
              {{ product.title }}
            </RouterLink>
            <Badge variant="secondary" class="shrink-0">{{ product.category }}</Badge>
          </div>
          <p class="text-gray-500 text-xs line-clamp-2 mb-3">{{ product.description }}</p>
          <div class="flex items-center justify-between">
            <div>
              <span class="text-red-700 font-bold text-lg">NT$ {{ product.price }}</span>
              <span v-if="product.origin_price && product.origin_price !== product.price" class="text-gray-400 text-xs line-through ml-1">{{ product.origin_price }}</span>
            </div>
            <button
              @click="handleAddToCart(product)"
              :disabled="addingId === product.id"
              class="flex items-center gap-1 bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer"
            >
              <Loader2 v-if="addingId === product.id" class="animate-spin" :size="14" />
              <ShoppingCart v-else :size="14" />
              加入
            </button>
          </div>
        </div>
      </div>

      <div v-if="filtered.length === 0" class="col-span-full text-center py-16 text-gray-400">
        <p class="text-lg">找不到相關料理</p>
      </div>
    </div>
  </div>
</template>
