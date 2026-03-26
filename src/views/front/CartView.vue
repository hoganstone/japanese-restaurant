<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { RouterLink, useRouter } from 'vue-router'
import { Trash2, Plus, Minus, ShoppingBag, ChevronRight, Loader2, Tag, UtensilsCrossed, ShoppingBag as TakeoutIcon } from 'lucide-vue-next'
import { createOrder } from '@/api'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const cart = useCartStore()
const toast = useToastStore()
const router = useRouter()

const orderType = ref('dine-in') // 'dine-in' | 'takeout'
const couponCode = ref('')
const applyingCoupon = ref(false)
const submitting = ref(false)

const dineInForm = ref({ tableNo: '' })
const takeoutForm = ref({ name: '', email: '', tel: '', address: '' })
const message = ref('')

onMounted(() => cart.fetchCart())

async function handleCoupon() {
  if (!couponCode.value) return
  applyingCoupon.value = true
  try {
    const res = await cart.useCoupon(couponCode.value)
    if (res.success) toast.success(t('toast.couponSuccess'))
    else toast.error(res.message || t('toast.couponInvalid'))
  } catch {
    toast.error(t('toast.couponFailed'))
  } finally {
    applyingCoupon.value = false
  }
}

async function handleSubmit() {
  if (orderType.value === 'dine-in') {
    if (!dineInForm.value.tableNo) {
      toast.error(t('toast.tableRequired'))
      return
    }
  } else {
    const { name, email, tel, address } = takeoutForm.value
    if (!name || !email || !tel || !address) {
      toast.error(t('toast.fillAll'))
      return
    }
  }

  submitting.value = true
  try {
    const isDineIn = orderType.value === 'dine-in'
    const orderData = {
      user: isDineIn
        ? { name: `桌號 ${dineInForm.value.tableNo}`, email: 'dine-in@seaisi.com', tel: '0000000000', address: `桌號 ${dineInForm.value.tableNo}` }
        : takeoutForm.value,
      message: isDineIn
        ? `【內用】桌號：${dineInForm.value.tableNo}${message.value ? `　備註：${message.value}` : ''}`
        : message.value,
    }

    const res = await createOrder(orderData)
    if (res.data.success) {
      toast.success(t('toast.orderSuccess'))
      await cart.fetchCart()
      router.push(`/order/${res.data.orderId}`)
    }
  } catch {
    toast.error(t('toast.orderFailed'))
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ t('cart.title') }}</h1>

    <!-- Empty cart -->
    <div v-if="cart.cart.carts?.length === 0" class="text-center py-20">
      <ShoppingBag class="mx-auto text-gray-300 mb-4" :size="64" />
      <p class="text-gray-500 text-lg mb-6">{{ t('cart.empty') }}</p>
      <RouterLink to="/menu" class="inline-flex items-center gap-2 bg-red-700 text-white px-6 py-3 rounded-full font-medium hover:bg-red-800 transition-colors">
        {{ t('cart.goToMenu') }} <ChevronRight :size="18" />
      </RouterLink>
    </div>

    <div v-else class="grid lg:grid-cols-3 gap-8">
      <!-- Left: Cart Items + Coupon -->
      <div class="lg:col-span-2 space-y-4">

        <!-- Cart Items -->
        <div
          v-for="item in cart.cart.carts"
          :key="item.id"
          class="bg-white rounded-xl border border-gray-200 p-4 flex gap-4"
        >
          <img
            :src="item.product.imageUrl || item.product.image"
            :alt="item.product.title"
            class="w-20 h-20 object-cover rounded-lg bg-gray-100 shrink-0"
            @error="$event.target.src='https://images.unsplash.com/photo-1563245372-f21724e3856d?w=100&q=80'"
          />
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 truncate">{{ item.product.title }}</h3>
            <p class="text-red-700 font-bold mt-1">NT$ {{ item.product.price }}</p>
            <div class="flex items-center gap-3 mt-2">
              <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button @click="cart.updateItem(item.id, item.product_id, Math.max(1, item.qty - 1))" class="px-2 py-1 hover:bg-gray-100 cursor-pointer">
                  <Minus :size="14" />
                </button>
                <span class="px-3 py-1 border-x border-gray-300 text-sm">{{ item.qty }}</span>
                <button @click="cart.updateItem(item.id, item.product_id, item.qty + 1)" class="px-2 py-1 hover:bg-gray-100 cursor-pointer">
                  <Plus :size="14" />
                </button>
              </div>
              <button @click="cart.removeItem(item.id)" class="text-gray-400 hover:text-red-600 cursor-pointer">
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
          <div class="text-right shrink-0">
            <p class="font-bold text-gray-900">NT$ {{ item.final_total || item.total }}</p>
          </div>
        </div>

        <!-- Coupon -->
        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Tag :size="16" /> {{ t('cart.coupon') }}
          </h3>
          <div class="flex gap-2">
            <input
              v-model="couponCode"
              :placeholder="t('cart.couponPlaceholder')"
              class="flex-1 h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              @click="handleCoupon"
              :disabled="applyingCoupon"
              class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer"
            >
              <Loader2 v-if="applyingCoupon" class="animate-spin" :size="14" />
              <span v-else>{{ t('cart.apply') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Summary + Form -->
      <div class="space-y-4">

        <!-- Order Summary -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <h3 class="font-semibold text-gray-900 mb-4">{{ t('cart.summary') }}</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between text-gray-600">
              <span>{{ t('cart.subtotal') }}</span><span>NT$ {{ cart.total }}</span>
            </div>
            <div v-if="cart.total !== cart.finalTotal" class="flex justify-between text-green-700">
              <span>{{ t('cart.discount') }}</span><span>-NT$ {{ cart.total - cart.finalTotal }}</span>
            </div>
            <div class="border-t pt-2 flex justify-between font-bold text-lg text-gray-900">
              <span>{{ t('cart.total') }}</span><span class="text-red-700">NT$ {{ cart.finalTotal }}</span>
            </div>
          </div>
        </div>

        <!-- Order Type Toggle -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <h3 class="font-semibold text-gray-900 mb-3">{{ t('cart.diningMethod') }}</h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="orderType = 'dine-in'"
              :class="[
                'flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all cursor-pointer',
                orderType === 'dine-in'
                  ? 'border-red-600 bg-red-50 text-red-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              ]"
            >
              <UtensilsCrossed :size="24" />
              <span class="text-sm font-semibold">{{ t('cart.dineIn') }}</span>
              <span class="text-xs opacity-70">{{ t('cart.dineInSub') }}</span>
            </button>
            <button
              @click="orderType = 'takeout'"
              :class="[
                'flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all cursor-pointer',
                orderType === 'takeout'
                  ? 'border-red-600 bg-red-50 text-red-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              ]"
            >
              <ShoppingBag :size="24" />
              <span class="text-sm font-semibold">{{ t('cart.takeout') }}</span>
              <span class="text-xs opacity-70">{{ t('cart.takeoutSub') }}</span>
            </button>
          </div>
        </div>

        <!-- Dine-in Form -->
        <div v-if="orderType === 'dine-in'" class="bg-white rounded-xl border border-red-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UtensilsCrossed class="text-red-600" :size="16" /> {{ t('cart.dineInInfo') }}
          </h3>
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('cart.tableNo') }} *</label>
              <input
                v-model="dineInForm.tableNo"
                :placeholder="t('cart.tableNoPlaceholder')"
                class="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('cart.notes') }}</label>
              <textarea
                v-model="message"
                :placeholder="t('cart.notesPlaceholder')"
                rows="2"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>
          </div>
        </div>

        <!-- Takeout Form -->
        <div v-if="orderType === 'takeout'" class="bg-white rounded-xl border border-amber-100 p-5">
          <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag class="text-amber-600" :size="16" /> {{ t('cart.takeoutInfo') }}
          </h3>
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('cart.name') }} *</label>
              <input v-model="takeoutForm.name" :placeholder="t('cart.namePlaceholder')" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('cart.phone') }} *</label>
              <input v-model="takeoutForm.tel" :placeholder="t('cart.phonePlaceholder')" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Email *</label>
              <input v-model="takeoutForm.email" type="email" :placeholder="t('cart.emailPlaceholder')" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('cart.pickupAddress') }} *</label>
              <input v-model="takeoutForm.address" :placeholder="t('cart.addressPlaceholder')" class="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('cart.notes') }}</label>
              <textarea v-model="message" :placeholder="t('cart.notesPlaceholder')" rows="2" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            </div>
          </div>
        </div>

        <!-- Submit -->
        <button
          @click="handleSubmit"
          :disabled="submitting"
          class="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white py-3.5 rounded-xl font-semibold text-lg transition-colors disabled:opacity-60 cursor-pointer"
        >
          <Loader2 v-if="submitting" class="animate-spin" :size="20" />
          <span>{{ orderType === 'dine-in' ? t('cart.submitDineIn') : t('cart.submitTakeout') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
