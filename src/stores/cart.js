import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart, applyCoupon } from '@/api'

export const useCartStore = defineStore('cart', () => {
  const cart = ref({ carts: [], total: 0, final_total: 0 })
  const loading = ref(false)

  const itemCount = computed(() => cart.value.carts?.length || 0)
  const total = computed(() => cart.value.total || 0)
  const finalTotal = computed(() => cart.value.final_total || 0)

  async function fetchCart() {
    const res = await getCart()
    cart.value = res.data.data
  }

  async function addItem(productId, qty = 1) {
    loading.value = true
    try {
      await addToCart(productId, qty)
      await fetchCart()
    } finally {
      loading.value = false
    }
  }

  async function updateItem(cartId, productId, qty) {
    await updateCartItem(cartId, productId, qty)
    await fetchCart()
  }

  async function removeItem(cartId) {
    await removeCartItem(cartId)
    await fetchCart()
  }

  async function clear() {
    await clearCart()
    await fetchCart()
  }

  async function useCoupon(code) {
    const res = await applyCoupon(code)
    await fetchCart()
    return res.data
  }

  return { cart, loading, itemCount, total, finalTotal, fetchCart, addItem, updateItem, removeItem, clear, useCoupon }
})
