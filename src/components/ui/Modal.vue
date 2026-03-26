<script setup>
import { cn } from '@/lib/utils'
import { X } from 'lucide-vue-next'

const props = defineProps({
  show: Boolean,
  title: String,
  size: { type: String, default: 'md' },
})
const emit = defineEmits(['close'])

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="emit('close')" />
        <div :class="cn('relative w-full bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]', sizes[size] || sizes.md)">
          <div class="flex items-center justify-between p-5 border-b shrink-0">
            <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 cursor-pointer">
              <X :size="20" />
            </button>
          </div>
          <div class="p-5 overflow-y-auto">
            <slot />
          </div>
          <div v-if="$slots.footer" class="flex justify-end gap-2 p-5 border-t shrink-0">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
