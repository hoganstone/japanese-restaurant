<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { useLocaleStore } from '@/stores/locale'
import { useRouter } from 'vue-router'
import { Loader2, UtensilsCrossed, Globe } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const auth = useAuthStore()
const toast = useToastStore()
const localeStore = useLocaleStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)

const langs = [
  { code: 'zh-TW', flag: '🇹🇼', short: '繁中' },
  { code: 'en',    flag: '🇺🇸', short: 'EN' },
  { code: 'ja',    flag: '🇯🇵', short: 'JP' },
]

async function handleLogin() {
  if (!email.value || !password.value) {
    toast.error(t('toast.loginRequired'))
    return
  }
  loading.value = true
  try {
    const ok = await auth.login(email.value, password.value)
    if (ok) {
      toast.success(t('toast.loginSuccess'))
      router.push('/admin/products')
    } else {
      toast.error(t('toast.loginFailed'))
    }
  } catch (e) {
    toast.error(e.response?.data?.message || t('toast.loginFailed'))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-stone-900 flex items-center justify-center px-4">
    <!-- Language switcher top-right -->
    <div class="absolute top-4 right-4 flex gap-1">
      <button
        v-for="lang in langs"
        :key="lang.code"
        @click="localeStore.setLocale(lang.code)"
        :class="[
          'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
          localeStore.locale === lang.code
            ? 'bg-red-700 text-white'
            : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
        ]"
      >
        <span>{{ lang.flag }}</span>
        <span>{{ lang.short }}</span>
      </button>
    </div>

    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 text-white text-2xl font-bold mb-2">
          <UtensilsCrossed :size="28" class="text-red-400" />
          海石日式料理
        </div>
        <p class="text-stone-400 text-sm">{{ t('admin.login.subtitle') }}</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">{{ t('admin.login.heading') }}</h2>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('admin.login.email') }}</label>
            <input
              v-model="email"
              type="email"
              placeholder="admin@example.com"
              class="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('admin.login.password') }}</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white h-10 rounded-lg font-semibold transition-colors disabled:opacity-60 cursor-pointer"
          >
            <Loader2 v-if="loading" class="animate-spin" :size="18" />
            {{ loading ? t('admin.login.submitting') : t('admin.login.submit') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
