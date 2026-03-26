<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { useRouter } from 'vue-router'
import { Loader2, UtensilsCrossed } from 'lucide-vue-next'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    toast.error('請輸入帳號和密碼')
    return
  }
  loading.value = true
  try {
    const ok = await auth.login(email.value, password.value)
    if (ok) {
      toast.success('登入成功！')
      router.push('/admin/products')
    } else {
      toast.error('登入失敗，請確認帳號密碼')
    }
  } catch (e) {
    toast.error(e.response?.data?.message || '登入失敗')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-stone-900 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 text-white text-2xl font-bold mb-2">
          <UtensilsCrossed :size="28" class="text-red-400" />
          海石日式料理
        </div>
        <p class="text-stone-400 text-sm">後台管理系統</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">管理員登入</h2>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="admin@example.com"
              class="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密碼</label>
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
            登入
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
