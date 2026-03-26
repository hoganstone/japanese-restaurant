<script setup>
import { useToastStore } from '@/stores/toast'
import { CheckCircle, XCircle, Info, X } from 'lucide-vue-next'

const toast = useToastStore()

const icons = { success: CheckCircle, error: XCircle, info: Info }
const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      <TransitionGroup name="toast">
        <div
          v-for="t in toast.toasts"
          :key="t.id"
          :class="['flex items-start gap-3 p-4 rounded-lg border shadow-lg', colors[t.type] || colors.info]"
        >
          <component :is="icons[t.type] || icons.info" :size="18" class="mt-0.5 shrink-0" />
          <p class="text-sm flex-1">{{ t.message }}</p>
          <button @click="toast.remove(t.id)" class="shrink-0 opacity-60 hover:opacity-100">
            <X :size="16" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { transform: translateX(100%); opacity: 0; }
.toast-leave-to { transform: translateX(100%); opacity: 0; }
</style>
