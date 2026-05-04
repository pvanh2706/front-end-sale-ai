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
            path: '/chat',
            name: 'ChatView',
            component: () => import('../views/Chat/ChatView.vue'),
            meta: { title: 'AI Chat' },
        },
        {
            path: '/crm-work',
            name: 'CrmWorkView',
            component: () => import('../views/Crm/CrmWorkView.vue'),
            meta: { title: 'CRM & Công việc' },
        },
        {
            path: '/doc-library',
            redirect: '/doc-library/company',
        },
        {
            path: '/doc-library/company',
            name: 'DocLibraryCompanyView',
            component: () => import('../views/DocLibrary/DocLibraryView.vue'),
            meta: { title: 'Tài liệu công ty' },
        },
        {
            path: '/doc-library/personal',
            name: 'DocLibraryPersonalView',
            component: () => import('../views/DocLibrary/DocLibraryView.vue'),
            meta: { title: 'Tài liệu cá nhân' },
        },
        {
            path: '/',
            redirect: '/chat',
        },
    ],
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title ? `${String(to.meta.title)} — Salio` : 'Salio'

    const authStore = useAuthStore()

    // Redirect to login if accessing a protected route without a token
    if (!authStore.isAuthenticated && !to.meta.public) {
        next({
            name: 'Login',
            query: { redirect: to.fullPath },
        })
        return
    }

    // Prevent authenticated users from visiting auth pages
    if (authStore.isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
        next({ name: 'ChatView' })
        return
    }

    next()
})

export default router
