import axios from 'axios'

const BASE_URL = 'https://ec-course-api.hexschool.io/v2'
const API_PATH = 'seaisi'

const api = axios.create({
  baseURL: BASE_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

// Auth
export const adminSignin = (data) => api.post('/admin/signin', data)
export const adminSignout = () => api.post('/logout')
export const checkAuth = () => api.post('/api/user/check')

// Admin Products
export const getAdminProducts = (page = 1) => api.get(`/api/${API_PATH}/admin/products?page=${page}`)
export const getAdminAllProducts = () => api.get(`/api/${API_PATH}/admin/products/all`)
export const createProduct = (data) => api.post(`/api/${API_PATH}/admin/product`, { data })
export const updateProduct = (id, data) => api.put(`/api/${API_PATH}/admin/product/${id}`, { data })
export const deleteProduct = (id) => api.delete(`/api/${API_PATH}/admin/product/${id}`)

// Admin Orders
export const getAdminOrders = (page = 1) => api.get(`/api/${API_PATH}/admin/orders?page=${page}`)
export const updateOrder = (id, data) => api.put(`/api/${API_PATH}/admin/order/${id}`, { data })
export const deleteOrder = (id) => api.delete(`/api/${API_PATH}/admin/order/${id}`)
export const deleteAllOrders = () => api.delete(`/api/${API_PATH}/admin/orders/all`)

// Admin Coupons
export const getAdminCoupons = (page = 1) => api.get(`/api/${API_PATH}/admin/coupons?page=${page}`)
export const createCoupon = (data) => api.post(`/api/${API_PATH}/admin/coupon`, { data })
export const updateCoupon = (id, data) => api.put(`/api/${API_PATH}/admin/coupon/${id}`, { data })
export const deleteCoupon = (id) => api.delete(`/api/${API_PATH}/admin/coupon/${id}`)

// Public Products
export const getProducts = (page = 1, category = '') =>
  api.get(`/api/${API_PATH}/products?page=${page}${category ? `&category=${category}` : ''}`)
export const getAllProducts = () => api.get(`/api/${API_PATH}/products/all`)
export const getProduct = (id) => api.get(`/api/${API_PATH}/product/${id}`)

// Cart
export const getCart = () => api.get(`/api/${API_PATH}/cart`)
export const addToCart = (product_id, qty = 1) => api.post(`/api/${API_PATH}/cart`, { data: { product_id, qty } })
export const updateCartItem = (id, product_id, qty) => api.put(`/api/${API_PATH}/cart/${id}`, { data: { product_id, qty } })
export const removeCartItem = (id) => api.delete(`/api/${API_PATH}/cart/${id}`)
export const clearCart = () => api.delete(`/api/${API_PATH}/carts`)

// Coupon
export const applyCoupon = (code) => api.post(`/api/${API_PATH}/coupon`, { data: { code } })

// Orders
export const createOrder = (data) => api.post(`/api/${API_PATH}/order`, { data })
export const getOrder = (id) => api.get(`/api/${API_PATH}/order/${id}`)
export const payOrder = (id) => api.post(`/api/${API_PATH}/pay/${id}`)
