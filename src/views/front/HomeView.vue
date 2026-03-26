<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import { useBannersStore } from '@/stores/banners'
import { useFeaturesStore } from '@/stores/features'
import { useCtaStore } from '@/stores/cta'
import { useI18n } from 'vue-i18n'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

const { t } = useI18n()
const modules = [Autoplay, Pagination, Navigation, EffectFade]
const bannersStore = useBannersStore()
const featuresStore = useFeaturesStore()
const slides = computed(() => bannersStore.activeBanners())
const features = computed(() => featuresStore.activeItems())
const ctaStore = useCtaStore()
const cta = computed(() => ctaStore.data)
</script>

<template>
  <!-- Hero Swiper -->
  <section class="relative">
    <Swiper
      v-if="slides.length"
      :modules="modules"
      effect="fade"
      :autoplay="{ delay: 4500, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
      :navigation="true"
      :loop="slides.length > 1"
      class="hero-swiper"
    >
      <SwiperSlide v-for="slide in slides" :key="slide.id">
        <div class="relative h-[560px] md:h-[680px] overflow-hidden">
          <img
            :src="slide.image"
            :alt="slide.title"
            class="absolute inset-0 w-full h-full object-cover"
            @error="$event.target.src='https://images.unsplash.com/photo-1553621042-f6e147245754?w=1600&q=85'"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          <div class="relative h-full flex items-center">
            <div class="max-w-7xl mx-auto px-6 sm:px-10 w-full">
              <div class="max-w-xl">
                <span
                  v-if="slide.tag"
                  class="inline-block bg-red-600 text-white text-xs font-semibold tracking-widest px-3 py-1 rounded-full mb-4 uppercase"
                >
                  {{ slide.tag }}
                </span>
                <h2 class="text-4xl md:text-6xl font-bold text-white leading-tight mb-4 drop-shadow">
                  {{ slide.title }}
                </h2>
                <p v-if="slide.desc" class="text-stone-200 text-lg md:text-xl mb-8 leading-relaxed">
                  {{ slide.desc }}
                </p>
                <RouterLink
                  to="/menu"
                  class="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-7 py-3.5 rounded-full font-semibold text-base transition-colors shadow-lg"
                >
                  {{ t('home.orderNow') }} <ChevronRight :size="18" />
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- Fallback if no banners -->
    <div v-else class="h-[400px] bg-stone-900 flex items-center justify-center text-white">
      <p class="text-stone-400">{{ t('home.noBanners') }}</p>
    </div>

    <!-- Brand badge -->
    <div class="absolute top-6 right-6 z-20 hidden md:block">
      <div class="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl px-4 py-2 text-sm font-medium">
        海石日式料理
      </div>
    </div>
  </section>

  <!-- Features -->
  <section v-if="features.length" class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-10">
        <p class="text-red-600 text-sm font-semibold tracking-widest uppercase mb-2">Our Features</p>
        <h2 class="text-3xl font-bold text-gray-900">{{ t('menu.subtitle') }}</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="item in features"
          :key="item.id"
          class="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-default"
        >
          <!-- Image -->
          <div class="aspect-[4/3] overflow-hidden">
            <img
              :src="item.image"
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              @error="$event.target.src='https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80'"
            />
          </div>
          <!-- Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
            <div class="p-5 w-full">
              <p class="text-red-300 text-xs font-semibold tracking-wide mb-1">{{ item.subtitle }}</p>
              <h3 class="text-white font-bold text-xl mb-2 leading-tight">{{ item.title }}</h3>
              <p class="text-white/80 text-sm leading-relaxed max-h-0 group-hover:max-h-32 overflow-hidden transition-all duration-500 ease-in-out">
                {{ item.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="relative overflow-hidden">
    <img
      v-if="cta.bgImage"
      :src="cta.bgImage"
      alt=""
      class="absolute inset-0 w-full h-full object-cover"
      @error="$event.target.src=''"
    />
    <div
      class="absolute inset-0"
      :style="{ backgroundColor: `rgba(0,0,0,${(cta.overlayOpacity ?? 60) / 100})` }"
    />
    <div class="relative max-w-7xl mx-auto px-4 py-20 text-center text-white">
      <h2 class="text-3xl md:text-4xl font-bold mb-4 drop-shadow">{{ cta.title }}</h2>
      <p class="text-white/80 mb-8 text-lg max-w-xl mx-auto leading-relaxed">{{ cta.desc }}</p>
      <RouterLink
        v-if="cta.btnLink && !cta.btnLink.startsWith('http')"
        :to="cta.btnLink || '/menu'"
        class="inline-flex items-center gap-2 bg-white text-red-700 px-8 py-3.5 rounded-full font-semibold hover:bg-red-50 transition-colors shadow-lg text-base"
      >
        {{ cta.btnText }} <ChevronRight :size="18" />
      </RouterLink>
      <a
        v-else-if="cta.btnLink"
        :href="cta.btnLink"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-2 bg-white text-red-700 px-8 py-3.5 rounded-full font-semibold hover:bg-red-50 transition-colors shadow-lg text-base"
      >
        {{ cta.btnText }} <ChevronRight :size="18" />
      </a>
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
