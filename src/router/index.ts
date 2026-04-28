import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { left: 0, top: 0 }
    },
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('../views/Auth/LoginView.vue'),
            meta: { title: 'Đăng nhập', public: true },
        },
        {
            path: '/register',
            name: 'Register',
            component: () => import('../views/Auth/RegisterView.vue'),
            meta: { title: 'Đăng ký', public: true },
        },
        {
            path: '/',
            name: 'HelloWorld',
            component: () => import('../views/HelloWorld.vue'),
            meta: { title: 'Hello World' },
        },
    ],
})

router.beforeEach((to, from, next) => {
    document.title = `CodeOn POS - ${String(to.meta.title ?? '')}`

    const authStore = useAuthStore()

    // Redirect to login if accessing a protected route without a token
    if (!authStore.isAuthenticated && !to.meta.public) {
        next({ name: 'Login' })
        return
    }

    // Redirect to home if already logged in and trying to access login
    if (authStore.isAuthenticated && to.name === 'Login') {
        next({ name: 'HelloWorld' })
        return
    }

    next()
})

export default router
