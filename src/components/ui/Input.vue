<script setup>
import { cn } from '@/lib/utils'
const props = defineProps({
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  placeholder: String,
  disabled: Boolean,
  class: String,
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="emit('update:modelValue', $event.target.value)"
    :class="cn(
      'flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50',
      props.class
    )"
  />
</template>
