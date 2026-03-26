<script setup>
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { useLocaleStore } from '@/stores/locale'
import { Package, ShoppingBag, Tag, LogOut, UtensilsCrossed, Menu, X, ExternalLink, Images, LayoutTemplate, Sparkles, Megaphone, Globe, ChevronDown } from 'lucide-vue-next'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const auth = useAuthStore()
const toast = useToastStore()
const localeStore = useLocaleStore()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)
const langOpen = ref(false)
const langBtnRef = ref(null)

const langs = [
  { code: 'zh-TW', flag: '🇹🇼', short: '繁中' },
  { code: 'en',    flag: '🇺🇸', short: 'EN' },
  { code: 'ja',    flag: '🇯🇵', short: 'JP' },
]

function switchLang(code) {
  localeStore.setLocale(code)
  langOpen.value = false
}

function handleClickOutside(e) {
  if (langBtnRef.value && !langBtnRef.value.contains(e.target)) {
    langOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

const navItems = computed(() => [
  { to: '/admin/products', icon: Package,       label: t('admin.products') },
  { to: '/admin/orders',   icon: ShoppingBag,   label: t('admin.orders') },
  { to: '/admin/coupons',  icon: Tag,           label: t('admin.coupons') },
  { to: '/admin/banners',  icon: Images,        label: t('admin.banners') },
  { to: '/admin/features', icon: Sparkles,      label: t('admin.features') },
  { to: '/admin/cta',      icon: Megaphone,     label: t('admin.cta') },
  { to: '/admin/footer',   icon: LayoutTemplate, label: t('admin.footer') },
])

const currentPageLabel = computed(() =>
  navItems.value.find(n => route.path.startsWith(n.to))?.label || t('admin.panel')
)

async function handleLogout() {
  await auth.logout()
  toast.info(t('toast.loggedOut'))
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
        <span class="font-bold text-lg">{{ t('admin.siteTitle') }}</span>
        <button class="ml-auto md:hidden" @click="sidebarOpen = false">
          <X :size="18" />
        </button>
      </div>

      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
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
          <ExternalLink :size="18" /> {{ t('admin.frontSite') }}
        </a>
        <button @click="handleLogout" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-300 hover:bg-red-900 hover:text-white transition-colors cursor-pointer">
          <LogOut :size="18" /> {{ t('admin.logout') }}
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
        <h2 class="font-semibold text-gray-800 text-sm flex-1">{{ currentPageLabel }}</h2>

        <!-- Language Switcher -->
        <div ref="langBtnRef" class="relative">
          <button
            @click.stop="langOpen = !langOpen"
            class="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm text-gray-600 hover:text-red-700 hover:bg-gray-100 transition-colors"
          >
            <Globe :size="15" />
            <span class="font-medium">{{ langs.find(l => l.code === localeStore.locale)?.flag }}</span>
            <span class="hidden sm:inline text-xs">{{ langs.find(l => l.code === localeStore.locale)?.short }}</span>
            <ChevronDown :size="13" :class="['transition-transform', langOpen ? 'rotate-180' : '']" />
          </button>
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="langOpen"
              class="absolute right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[130px] py-1 origin-top-right"
            >
              <button
                v-for="lang in langs"
                :key="lang.code"
                @click="switchLang(lang.code)"
                :class="[
                  'w-full text-left px-3 py-2 text-sm flex items-center gap-2.5 hover:bg-gray-50 transition-colors',
                  localeStore.locale === lang.code ? 'text-red-700 font-semibold' : 'text-gray-700'
                ]"
              >
                <span class="text-base">{{ lang.flag }}</span>
                <span>{{ lang.short }}</span>
              </button>
            </div>
          </transition>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
