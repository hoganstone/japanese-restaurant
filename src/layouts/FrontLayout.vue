<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ShoppingCart, Menu, X, UtensilsCrossed, MapPin, Phone, Clock, Globe, ChevronDown } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useFooterStore } from '@/stores/footer'
import { useLocaleStore } from '@/stores/locale'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const cart = useCartStore()
const footer = useFooterStore()
const localeStore = useLocaleStore()
const { t } = useI18n()
const menuOpen = ref(false)
const langOpen = ref(false)
const langBtnRef = ref(null)

const langs = [
  { code: 'zh-TW', flag: '🇹🇼', label: '繁體中文', short: '繁中' },
  { code: 'en',    flag: '🇺🇸', label: 'English',  short: 'EN' },
  { code: 'ja',    flag: '🇯🇵', label: '日本語',   short: 'JP' },
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
              v-for="link in [{ to: '/', label: t('nav.home') }, { to: '/menu', label: t('nav.menu') }, { to: '/cart', label: t('nav.cart') }]"
              :key="link.to"
              :to="link.to"
              class="text-gray-600 hover:text-red-700 font-medium transition-colors"
              active-class="text-red-700"
            >
              {{ link.label }}
            </RouterLink>
          </nav>

          <!-- Right: Cart + Lang + Hamburger -->
          <div class="flex items-center gap-2">
            <!-- Cart -->
            <RouterLink to="/cart" class="relative p-2 text-gray-700 hover:text-red-700">
              <ShoppingCart :size="22" />
              <span
                v-if="cart.itemCount > 0"
                class="absolute -top-1 -right-1 bg-red-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ cart.itemCount }}
              </span>
            </RouterLink>

            <!-- Language Switcher -->
            <div ref="langBtnRef" class="relative">
              <button
                @click.stop="langOpen = !langOpen"
                class="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm text-gray-600 hover:text-red-700 hover:bg-gray-100 transition-colors"
              >
                <Globe :size="15" />
                <span class="hidden sm:inline font-medium">{{ langs.find(l => l.code === localeStore.locale)?.short }}</span>
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
                    <span>{{ lang.label }}</span>
                  </button>
                </div>
              </transition>
            </div>

            <!-- Mobile hamburger -->
            <button class="md:hidden p-2 text-gray-700" @click="menuOpen = !menuOpen">
              <Menu v-if="!menuOpen" :size="22" />
              <X v-else :size="22" />
            </button>
          </div>
        </div>

        <!-- Mobile Nav -->
        <div v-if="menuOpen" class="md:hidden pb-4 flex flex-col gap-2">
          <RouterLink
            v-for="link in [{ to: '/', label: t('nav.home') }, { to: '/menu', label: t('nav.menu') }, { to: '/cart', label: t('nav.cart') }]"
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
            <p class="text-white font-bold text-2xl mb-1">{{ footer.info.brandZh }}</p>
            <p class="text-red-400 text-sm tracking-widest mb-6">{{ footer.info.brandEn }}</p>

            <!-- Social Icons -->
            <div v-if="footer.activeSocials().length" class="flex gap-2 mb-5">
              <a
                v-for="s in footer.activeSocials()"
                :key="s.id"
                :href="s.url"
                target="_blank"
                rel="noopener noreferrer"
                :title="s.label"
                class="w-9 h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-110 hover:brightness-110 shrink-0"
                :style="{ backgroundColor: s.bgColor || '#555' }"
              >
                <img
                  v-if="s.icon"
                  :src="s.icon"
                  :alt="s.label"
                  class="w-5 h-5 object-contain"
                  @error="$event.target.style.display='none'"
                />
              </a>
            </div>

            <div class="space-y-3 text-sm">
              <div class="flex items-start gap-3">
                <MapPin class="text-red-400 shrink-0 mt-0.5" :size="16" />
                <div>
                  <p class="text-white font-medium">{{ t('footer.restaurantAddress') }}</p>
                  <p class="text-stone-400">{{ footer.info.address }}</p>
                  <a
                    :href="footer.info.mapLink"
                    target="_blank"
                    rel="noopener"
                    class="text-red-400 hover:text-red-300 text-xs mt-0.5 inline-block transition-colors"
                  >
                    {{ t('footer.openMap') }}
                  </a>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Phone class="text-red-400 shrink-0 mt-0.5" :size="16" />
                <div>
                  <p class="text-white font-medium">{{ t('footer.reservationPhone') }}</p>
                  <p class="text-stone-400">{{ footer.info.phone }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Clock class="text-red-400 shrink-0 mt-0.5" :size="16" />
                <div>
                  <p class="text-white font-medium">{{ t('footer.businessHours') }}</p>
                  <p class="text-stone-400">{{ footer.info.hours }}</p>
                  <p class="text-stone-500 text-xs">{{ footer.info.holiday }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Google Map -->
          <div class="rounded-xl overflow-hidden border border-stone-700 shadow-lg">
            <iframe
              :src="footer.info.mapUrl"
              width="100%"
              height="260"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="餐廳位置地圖"
            />
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="max-w-7xl mx-auto px-4 py-5 text-center text-xs text-stone-500">
        {{ footer.info.copyright }}
      </div>
    </footer>
  </div>
</template>
