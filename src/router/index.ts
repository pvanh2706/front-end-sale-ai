import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import SettingsView from '@/views/Settings/SettingsView.vue'

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
            path: '/chat-tai-lieu',
            component: () => import('../views/Chat/ChatModuleView.vue'),
            meta: { requiresAuth: true, title: 'Chat tai lieu' },
            children: [
                {
                    path: '',
                    name: 'chat-dashboard',
                    component: () => import('../views/Chat/ChatDashboardView.vue'),
                    meta: { title: 'Chat tai lieu' },
                },
                {
                    path: 'chat',
                    name: 'chat-ai',
                    component: () => import('../views/Chat/ChatView.vue'),
                    meta: { title: 'Chat voi AI' },
                },
                {
                    path: 'library',
                    name: 'doc-library',
                    component: () => import('../views/DocLibrary/DocLibraryView.vue'),
                    meta: { title: 'Thu vien tai lieu' },
                },
                {
                    path: 'analytics',
                    name: 'chat-analytics',
                    component: () => import('../views/Chat/ChatAnalyticsView.vue'),
                    meta: { title: 'Phan tich su dung' },
                },
            ],
        },
        {
            path: '/chat',
            redirect: '/chat-tai-lieu/chat',
        },
        {
            path: '/crm-work',
            name: 'CrmWorkView',
            component: () => import('../views/Crm/CrmWorkView.vue'),
            meta: { title: 'CRM & Công việc' },
        },
        {
            path: '/doc-library',
            redirect: '/chat-tai-lieu/library',
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
            path: '/settings',
            component: SettingsView,
            meta: { requiresAuth: true, title: 'Cài đặt' },
            children: [
                { path: '', redirect: '/settings/appearance' },
                {
                    path: 'appearance',
                    component: () => import('@/views/Settings/AppearanceSettings.vue'),
                },
                {
                    path: 'profile',
                    component: () => import('@/views/Settings/ProfileSettings.vue'),
                },
                {
                    path: 'notifications',
                    component: () => import('@/views/Settings/NotificationSettings.vue'),
                },
                {
                    path: 'language',
                    component: () => import('@/views/Settings/LanguageSettings.vue'),
                },
                {
                    path: 'security',
                    component: () => import('@/views/Settings/SecuritySettings.vue'),
                },
            ],
        },
        {
            path: '/',
            redirect: '/chat-tai-lieu',
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
        next({ name: 'chat-dashboard' })
        return
    }

    next()
})

export default router
