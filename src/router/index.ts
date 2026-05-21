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
            meta: { requiresAuth: true, title: 'Tài liệu hỗ trợ' },
            children: [
                {
                    path: '',
                    name: 'chat-dashboard',
                    component: () => import('../views/Chat/ChatDashboardView.vue'),
                    meta: { title: 'Tài liệu hỗ trợ' },
                },
                {
                    path: 'chat',
                    name: 'chat-ai',
                    component: () => import('../views/Chat/ChatView.vue'),
                    meta: { title: 'Chat với AI' },
                },
                {
                    path: 'library',
                    name: 'doc-library',
                    component: () => import('../views/DocLibrary/DocLibraryView.vue'),
                    meta: { title: 'Thư viện tài liệu' },
                },

            ],
        },
        {
            path: '/chat-tai-lieu/permissions/:nodeId',
            name: 'DocumentPermissions',
            component: () => import('@/views/Settings/DocumentPermissionsView.vue'),
            meta: { title: 'Phân quyền tài liệu' },
        },
        {
            path: '/chat',
            redirect: '/chat-tai-lieu/chat',
        },
        {
            path: '/crm-work',
            name: 'CrmWorkView',
            component: () => import('../views/Crm/CrmWorkView.vue'),
            meta: { title: 'CRM & Công việc', public: true },
        },
        {
            path: '/crm-deals',
            name: 'CrmDealsKanban',
            component: () => import('../views/Crm/CrmDealsKanbanView.vue'),
            meta: { title: 'Deals Kanban' },
        },
        {
            path: '/crm-deals/:dealId',
            name: 'CrmDealDetail',
            component: () => import('../views/Crm/CrmDealDetailView.vue'),
            meta: { title: 'Chi tiết Deal' },
        },
        {
            path: '/crm-leads/:leadId',
            name: 'CrmLeadDetail',
            component: () => import('../views/Crm/CrmLeadDetailView.vue'),
            meta: { title: 'Chi tiết Lead' },
        },
        {
            path: '/crm-duplicate-check',
            name: 'CrmDuplicateCheck',
            component: () => import('../views/Crm/CrmDuplicateCheckView.vue'),
            meta: { title: 'Kiểm tra trùng dữ liệu' },
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
                {
                    path: 'api-integration',
                    name: 'ApiIntegrationSettings',
                    component: () => import('@/views/Settings/ApiIntegrationSettings.vue'),
                },
                {
                    path: 'webhook-logs',
                    name: 'WebhookLogs',
                    component: () => import('@/views/Settings/WebhookLogsView.vue'),
                },
                {
                    path: 'permission-groups',
                    name: 'PermissionGroups',
                    component: () => import('@/views/Settings/PermissionGroupsSettings.vue'),
                },
                {
                    path: 'create-member',
                    name: 'CreateMember',
                    component: () => import('@/views/Settings/CreateMemberSettings.vue'),
                },
            ],
        },
        {
            path: '/',
            redirect: '/crm-work',
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
