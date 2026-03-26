<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ShoppingCart, Menu, X, UtensilsCrossed } from 'lucide-vue-next'
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
      <div class="max-w-7xl mx-auto px-4 py-8 text-center text-sm">
        <p class="text-white font-semibold text-lg mb-1">海石日式料理</p>
        <p>© 2024 SEAISI Japanese Restaurant. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>
