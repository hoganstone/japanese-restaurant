import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAllProducts } from '@/api'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const categories = ref([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      const res = await getAllProducts()
      products.value = Object.values(res.data.products)
      const cats = [...new Set(products.value.map(p => p.category).filter(Boolean))]
      categories.value = cats
    } finally {
      loading.value = false
    }
  }

  return { products, categories, loading, fetchAll }
})
