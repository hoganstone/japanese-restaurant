<script setup>
import { cn } from '@/lib/utils'
const props = defineProps({
  variant: { type: String, default: 'default' },
  class: String,
})
const variants = {
  default: 'bg-red-700 text-white',
  secondary: 'bg-amber-100 text-amber-800',
  outline: 'border border-gray-300 text-gray-700',
  success: 'bg-green-100 text-green-800',
  destructive: 'bg-red-100 text-red-800',
}
</script>

<template>
  <span :class="cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant] || variants.default, props.class)">
    <slot />
  </span>
</template>
