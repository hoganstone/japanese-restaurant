<script setup>
import { cn } from '@/lib/utils'
const props = defineProps({ class: String })
</script>

<template>
  <div :class="cn('rounded-xl border border-gray-200 bg-white shadow-sm', props.class)">
    <slot />
  </div>
</template>
