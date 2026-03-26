<script setup>
import { RouterLink } from 'vue-router'
import { ChevronRight, Star, Clock, Award } from 'lucide-vue-next'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

const modules = [Autoplay, Pagination, Navigation, EffectFade]

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1600&q=85',
    tag: '招牌壽司',
    title: '豪華綜合握壽司',
    desc: '精選當日最新鮮魚材，職人手握，入口即化',
    to: '/menu',
  },
  {
    image: 'https://images.unsplash.com/photo-1569558035069-a31a5f9b3a8c?w=1600&q=85',
    tag: '人氣拉麵',
    title: '濃郁豚骨拉麵',
    desc: '熬煮 12 小時的豚骨湯底，香醇回甘',
    to: '/menu',
  },
  {
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&q=85',
    tag: '道地丼飯',
    title: '鮭魚親子丼',
    desc: '鮭魚生魚片搭配鮭魚卵，雙重鮮味交融',
    to: '/menu',
  },
  {
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=85',
    tag: '炭火串燒',
    title: '串燒拼盤',
    desc: '炭火慢烤逼出油脂，焦香四溢，下酒首選',
    to: '/menu',
  },
  {
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1600&q=85',
    tag: '精緻定食',
    title: '鮭魚西京燒定食',
    desc: '西京味噌醃漬烤鮭魚，搭配配菜更顯豐盛',
    to: '/menu',
  },
]
</script>

<template>
  <!-- Hero Swiper -->
  <section class="relative">
    <Swiper
      :modules="modules"
      effect="fade"
      :autoplay="{ delay: 4500, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
      :navigation="true"
      :loop="true"
      class="hero-swiper"
    >
      <SwiperSlide v-for="(slide, i) in slides" :key="i">
        <div class="relative h-[560px] md:h-[680px] overflow-hidden">
          <!-- Background image -->
          <img
            :src="slide.image"
            :alt="slide.title"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <!-- Overlay -->
          <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          <!-- Content -->
          <div class="relative h-full flex items-center">
            <div class="max-w-7xl mx-auto px-6 sm:px-10 w-full">
              <div class="max-w-xl">
                <span class="inline-block bg-red-600 text-white text-xs font-semibold tracking-widest px-3 py-1 rounded-full mb-4 uppercase">
                  {{ slide.tag }}
                </span>
                <h2 class="text-4xl md:text-6xl font-bold text-white leading-tight mb-4 drop-shadow">
                  {{ slide.title }}
                </h2>
                <p class="text-stone-200 text-lg md:text-xl mb-8 leading-relaxed">
                  {{ slide.desc }}
                </p>
                <RouterLink
                  :to="slide.to"
                  class="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-7 py-3.5 rounded-full font-semibold text-base transition-colors shadow-lg"
                >
                  立即點餐 <ChevronRight :size="18" />
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- Brand overlay badge -->
    <div class="absolute top-6 right-6 z-20 hidden md:block">
      <div class="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl px-4 py-2 text-sm font-medium">
        海石日式料理
      </div>
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

<style scoped>
.hero-swiper {
  --swiper-pagination-color: #fff;
  --swiper-pagination-bullet-inactive-color: rgba(255,255,255,0.5);
  --swiper-pagination-bullet-inactive-opacity: 1;
  --swiper-pagination-bullet-size: 8px;
  --swiper-pagination-bullet-horizontal-gap: 4px;
  --swiper-navigation-color: #fff;
  --swiper-navigation-size: 24px;
}

.hero-swiper :deep(.swiper-button-prev),
.hero-swiper :deep(.swiper-button-next) {
  background: rgba(0, 0, 0, 0.35);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
}

.hero-swiper :deep(.swiper-button-prev):hover,
.hero-swiper :deep(.swiper-button-next):hover {
  background: rgba(0, 0, 0, 0.6);
}

.hero-swiper :deep(.swiper-button-prev)::after,
.hero-swiper :deep(.swiper-button-next)::after {
  font-size: 14px;
  font-weight: 700;
}

.hero-swiper :deep(.swiper-pagination) {
  bottom: 20px;
}
</style>
