<script setup>
import { RouterLink } from 'vue-router'
import { ChevronRight, Star, Clock, Award } from 'lucide-vue-next'
</script>

<template>
  <!-- Hero -->
  <section class="relative bg-stone-900 text-white overflow-hidden">
    <div
      class="absolute inset-0 bg-cover bg-center opacity-30"
      style="background-image: url('https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=1600&q=80')"
    />
    <div class="relative max-w-7xl mx-auto px-4 py-32 text-center">
      <p class="text-amber-400 font-medium tracking-widest text-sm mb-4">正宗日式料理</p>
      <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
        海石<br class="md:hidden" />日式料理
      </h1>
      <p class="text-stone-300 text-lg md:text-xl max-w-xl mx-auto mb-10">
        精選日本食材，傳承道地風味，每一口都是日本的味道
      </p>
      <RouterLink
        to="/menu"
        class="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
      >
        立即點餐 <ChevronRight :size="20" />
      </RouterLink>
    </div>
  </section>

  <!-- Features -->
  <section class="max-w-7xl mx-auto px-4 py-16">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center p-6">
        <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star class="text-red-700" :size="24" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">精選食材</h3>
        <p class="text-gray-600 text-sm">嚴選新鮮食材，每日直送，確保最高品質</p>
      </div>
      <div class="text-center p-6">
        <div class="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock class="text-amber-700" :size="24" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">快速出餐</h3>
        <p class="text-gray-600 text-sm">專業廚師團隊，確保每道料理新鮮即時</p>
      </div>
      <div class="text-center p-6">
        <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award class="text-green-700" :size="24" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">道地口味</h3>
        <p class="text-gray-600 text-sm">傳承正宗日式料理技藝，還原最道地的風味</p>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-red-700 text-white">
    <div class="max-w-7xl mx-auto px-4 py-16 text-center">
      <h2 class="text-3xl font-bold mb-4">準備好享用美食了嗎？</h2>
      <p class="text-red-100 mb-8">瀏覽我們的菜單，挑選您喜愛的料理</p>
      <RouterLink
        to="/menu"
        class="inline-flex items-center gap-2 bg-white text-red-700 px-8 py-3 rounded-full font-semibold hover:bg-red-50 transition-colors"
      >
        查看菜單 <ChevronRight :size="18" />
      </RouterLink>
    </div>
  </section>
</template>
