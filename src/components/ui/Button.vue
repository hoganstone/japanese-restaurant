<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  variant: { type: String, default: 'default' },
  size: { type: String, default: 'default' },
  disabled: Boolean,
  class: String,
})

const variants = {
  default: 'bg-red-700 text-white hover:bg-red-800 shadow-sm',
  outline: 'border border-red-700 text-red-700 bg-transparent hover:bg-red-50',
  ghost: 'text-gray-700 hover:bg-gray-100',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
  secondary: 'bg-amber-600 text-white hover:bg-amber-700',
  link: 'text-red-700 underline-offset-4 hover:underline',
}

const sizes = {
  default: 'h-9 px-4 py-2 text-sm',
  sm: 'h-7 px-3 text-xs',
  lg: 'h-11 px-6 text-base',
  icon: 'h-9 w-9',
}
</script>

<template>
  <button
    :class="cn(
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
      variants[variant] || variants.default,
      sizes[size] || sizes.default,
      props.class
    )"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
