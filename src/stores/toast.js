import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  function show(message, type = 'success', duration = 3000) {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    setTimeout(() => remove(id), duration)
  }

  function remove(id) {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  function success(msg) { show(msg, 'success') }
  function error(msg) { show(msg, 'error') }
  function info(msg) { show(msg, 'info') }

  return { toasts, show, remove, success, error, info }
})
