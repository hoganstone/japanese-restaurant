<script setup>
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { Package, ShoppingBag, Tag, LogOut, UtensilsCrossed, Menu, X, ExternalLink, Images } from 'lucide-vue-next'
import { ref } from 'vue'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)

const navItems = [
  { to: '/admin/products', icon: Package, label: '產品管理' },
  { to: '/admin/orders', icon: ShoppingBag, label: '訂單管理' },
  { to: '/admin/coupons', icon: Tag, label: '優惠券管理' },
  { to: '/admin/banners', icon: Images, label: '輪播圖管理' },
]

async function handleLogout() {
  await auth.logout()
  toast.info('已登出')
  router.push('/admin')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 text-white flex flex-col transition-transform duration-200',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]">
      <div class="flex items-center gap-2 px-6 py-5 border-b border-stone-700">
        <UtensilsCrossed class="text-red-400" :size="22" />
        <span class="font-bold text-lg">海石後台</span>
        <button class="ml-auto md:hidden" @click="sidebarOpen = false">
          <X :size="18" />
        </button>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            route.path.startsWith(item.to)
              ? 'bg-red-700 text-white'
              : 'text-stone-300 hover:bg-stone-800 hover:text-white'
          ]"
          @click="sidebarOpen = false"
        >
          <component :is="item.icon" :size="18" />
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-stone-700 space-y-1">
        <a href="/" target="_blank" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-300 hover:bg-stone-800 hover:text-white transition-colors">
          <ExternalLink :size="18" /> 前台網站
        </a>
        <button @click="handleLogout" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-300 hover:bg-red-900 hover:text-white transition-colors cursor-pointer">
          <LogOut :size="18" /> 登出
        </button>
      </div>
    </aside>

    <!-- Overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-black/50 md:hidden" @click="sidebarOpen = false" />

    <!-- Main Content -->
    <div class="flex-1 md:ml-64 flex flex-col min-h-screen">
      <header class="bg-white border-b border-gray-200 h-14 flex items-center px-4 md:px-6 gap-4">
        <button class="md:hidden text-gray-700" @click="sidebarOpen = true">
          <Menu :size="22" />
        </button>
        <h2 class="font-semibold text-gray-800 text-sm">
          {{ navItems.find(n => route.path.startsWith(n.to))?.label || '管理後台' }}
        </h2>
      </header>
      <main class="flex-1 p-4 md:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
