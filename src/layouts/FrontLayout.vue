<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ShoppingCart, Menu, X, UtensilsCrossed, MapPin, Phone, Clock } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { ref } from 'vue'

const cart = useCartStore()
const menuOpen = ref(false)

const navLinks = [
  { to: '/', label: '首頁' },
  { to: '/menu', label: '菜單' },
  { to: '/cart', label: '購物車' },
]
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <!-- Navbar -->
    <header class="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <RouterLink to="/" class="flex items-center gap-2 text-red-700 font-bold text-xl">
            <UtensilsCrossed :size="28" />
            <span class="hidden sm:block">海石日式料理</span>
          </RouterLink>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center gap-6">
            <RouterLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="text-gray-600 hover:text-red-700 font-medium transition-colors"
              active-class="text-red-700"
            >
              {{ link.label }}
            </RouterLink>
          </nav>

          <!-- Cart + Mobile menu -->
          <div class="flex items-center gap-3">
            <RouterLink to="/cart" class="relative p-2 text-gray-700 hover:text-red-700">
              <ShoppingCart :size="22" />
              <span
                v-if="cart.itemCount > 0"
                class="absolute -top-1 -right-1 bg-red-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ cart.itemCount }}
              </span>
            </RouterLink>
            <button class="md:hidden p-2 text-gray-700" @click="menuOpen = !menuOpen">
              <Menu v-if="!menuOpen" :size="22" />
              <X v-else :size="22" />
            </button>
          </div>
        </div>

        <!-- Mobile Nav -->
        <div v-if="menuOpen" class="md:hidden pb-4 flex flex-col gap-2">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-3 py-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-700"
            @click="menuOpen = false"
          >
            {{ link.label }}
          </RouterLink>
        </div>
      </div>
    </header>

    <main>
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-stone-900 text-stone-400 mt-16">
      <!-- Map + Info -->
      <div class="border-b border-stone-700">
        <div class="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8 items-start">
          <!-- Info -->
          <div>
            <p class="text-white font-bold text-2xl mb-1">海石日式料理</p>
            <p class="text-red-400 text-sm tracking-widest mb-6">SEAISI JAPANESE RESTAURANT</p>
            <div class="space-y-3 text-sm">
              <div class="flex items-start gap-3">
                <MapPin class="text-red-400 shrink-0 mt-0.5" :size="16" />
                <div>
                  <p class="text-white font-medium">餐廳地址</p>
                  <p class="text-stone-400">新北市八里區渡船頭</p>
                  <a
                    href="https://maps.google.com/?q=新北市八里區渡船頭"
                    target="_blank"
                    rel="noopener"
                    class="text-red-400 hover:text-red-300 text-xs mt-0.5 inline-block transition-colors"
                  >
                    在 Google 地圖中開啟 →
                  </a>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Phone class="text-red-400 shrink-0 mt-0.5" :size="16" />
                <div>
                  <p class="text-white font-medium">訂位電話</p>
                  <p class="text-stone-400">02-2610-0000</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Clock class="text-red-400 shrink-0 mt-0.5" :size="16" />
                <div>
                  <p class="text-white font-medium">營業時間</p>
                  <p class="text-stone-400">週二至週日　11:30 – 21:00</p>
                  <p class="text-stone-500 text-xs">週一公休</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Google Map -->
          <div class="rounded-xl overflow-hidden border border-stone-700 shadow-lg">
            <iframe
              src="https://maps.google.com/maps?q=新北市八里區渡船頭&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="260"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="海石日式料理位置 - 新北市八里渡船頭"
            />
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="max-w-7xl mx-auto px-4 py-5 text-center text-xs text-stone-500">
        © 2026 SEAISI Japanese Restaurant. All rights reserved.
      </div>
    </footer>
  </div>
</template>
