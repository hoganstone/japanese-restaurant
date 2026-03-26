import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // Front
  {
    path: '/',
    component: () => import('@/layouts/FrontLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/views/front/HomeView.vue') },
      { path: 'menu', name: 'Menu', component: () => import('@/views/front/MenuView.vue') },
      { path: 'product/:id', name: 'Product', component: () => import('@/views/front/ProductView.vue') },
      { path: 'cart', name: 'Cart', component: () => import('@/views/front/CartView.vue') },
      { path: 'order/:id', name: 'Order', component: () => import('@/views/front/OrderView.vue') },
    ]
  },
  // Admin
  {
    path: '/admin',
    name: 'AdminLogin',
    component: () => import('@/views/admin/LoginView.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'products', name: 'AdminProducts', component: () => import('@/views/admin/ProductsView.vue') },
      { path: 'orders', name: 'AdminOrders', component: () => import('@/views/admin/OrdersView.vue') },
      { path: 'coupons', name: 'AdminCoupons', component: () => import('@/views/admin/CouponsView.vue') },
      { path: 'banners', name: 'AdminBanners', component: () => import('@/views/admin/BannersView.vue') },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    const ok = await auth.verify()
    if (!ok) return '/admin'
  }
})

export default router
