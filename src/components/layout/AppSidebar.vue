<template>
    <aside :class="[
        'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-[var(--color-sidebar-bg)] dark:bg-[var(--color-sidebar-bg)] dark:border-[var(--color-sidebar-active-border)] text-[var(--color-sidebar-text)] h-screen transition-all duration-300 ease-in-out z-99999 border-r border-[var(--color-sidebar-active-border)]',
        {
            'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
            'lg:w-[90px]': !isExpanded && !isHovered,
            'translate-x-0 w-[290px]': isMobileOpen,
            '-translate-x-full': !isMobileOpen,
            'lg:translate-x-0': true,
        },
    ]" @mouseenter="!isExpanded && (isHovered = true)" @mouseleave="isHovered = false">
        <div :class="[
            'py-8 flex',
            !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
        ]">
            <router-link to="/">
                <BrandLogo v-if="isExpanded || isHovered || isMobileOpen" />
                <BrandLogo v-else icon-only />
            </router-link>
        </div>
        <div class="flex h-full flex-col">
            <div class="flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav class="mb-6">
                    <div class="flex flex-col gap-4">
                        <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
                            <h2 :class="[
                                'mb-4 text-xs uppercase flex leading-[20px] text-primary-700 dark:text-white/80',
                                !isExpanded && !isHovered
                                    ? 'lg:justify-center'
                                    : 'justify-start',
                            ]">
                                <template v-if="isExpanded || isHovered || isMobileOpen">
                                    {{ menuGroup.title }}
                                </template>
                                <HorizontalDots v-else />
                            </h2>
                            <ul class="flex flex-col gap-4">
                                <li v-for="(item, index) in menuGroup.items" :key="item.name">
                                    <button v-if="item.subItems" @click="handleParentItemClick(item.path, groupIndex, index)" :class="[
                                        'menu-item group w-full',
                                        {
                                            'menu-item-active': isSubmenuOpen(groupIndex, index) || (item.path && isActive(item.path)),
                                            'menu-item-inactive': !(isSubmenuOpen(groupIndex, index) || (item.path && isActive(item.path))),
                                        },
                                        !isExpanded && !isHovered
                                            ? 'lg:justify-center'
                                            : 'lg:justify-start',
                                    ]">
                                        <span :class="[
                                            (isSubmenuOpen(groupIndex, index) || (item.path && isActive(item.path)))
                                                ? 'menu-item-icon-active'
                                                : 'menu-item-icon-inactive',
                                        ]">
                                            <component :is="item.icon" />
                                        </span>
                                        <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{
                                            item.name }}</span>
                                        <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen" :class="[
                                            'ml-auto w-5 h-5 transition-transform duration-200',
                                            {
                                                'rotate-180 text-accent-100': isSubmenuOpen(
                                                    groupIndex,
                                                    index
                                                ),
                                            },
                                        ]" />
                                    </button>
                                    <router-link v-else-if="item.path" :to="item.path" :class="[
                                        'menu-item group',
                                        {
                                            'menu-item-active': isActive(item.path),
                                            'menu-item-inactive': !isActive(item.path),
                                        },
                                    ]">
                                        <span :class="[
                                            isActive(item.path)
                                                ? 'menu-item-icon-active'
                                                : 'menu-item-icon-inactive',
                                        ]">
                                            <component :is="item.icon" />
                                        </span>
                                        <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{
                                            item.name }}</span>
                                    </router-link>
                                    <transition @enter="startTransition" @after-enter="endTransition"
                                        @before-leave="startTransition" @after-leave="endTransition">
                                        <div v-show="isSubmenuOpen(groupIndex, index) &&
                                            (isExpanded || isHovered || isMobileOpen)
                                            ">
                                            <ul class="mt-2 space-y-1 ml-9">
                                                <li v-for="subItem in getVisibleSubItems(item.subItems)" :key="subItem.name">
                                                    <router-link :to="subItem.path" :class="[
                                                        'menu-dropdown-item',
                                                        {
                                                            'menu-dropdown-item-active': isActive(
                                                                subItem.path
                                                            ),
                                                            'menu-dropdown-item-inactive': !isActive(
                                                                subItem.path
                                                            ),
                                                        },
                                                    ]">
                                                        {{ subItem.name }}
                                                        <span class="flex items-center gap-1 ml-auto">
                                                            <span v-if="subItem.new" :class="[
                                                                'menu-dropdown-badge',
                                                                {
                                                                    'menu-dropdown-badge-active': isActive(
                                                                        subItem.path
                                                                    ),
                                                                    'menu-dropdown-badge-inactive': !isActive(
                                                                        subItem.path
                                                                    ),
                                                                },
                                                            ]">
                                                                new
                                                            </span>
                                                            <span v-if="subItem.pro" :class="[
                                                                'menu-dropdown-badge',
                                                                {
                                                                    'menu-dropdown-badge-active': isActive(
                                                                        subItem.path
                                                                    ),
                                                                    'menu-dropdown-badge-inactive': !isActive(
                                                                        subItem.path
                                                                    ),
                                                                },
                                                            ]">
                                                                pro
                                                            </span>
                                                        </span>
                                                    </router-link>
                                                </li>
                                            </ul>
                                        </div>
                                    </transition>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" />
            </div>

            <nav class="pb-5">
                <hr class="my-2 border-primary-300/70 dark:border-white/12" />
                <router-link
                    to="/settings"
                    :class="[
                        'menu-item group',
                        route.path.startsWith('/settings') ? 'menu-item-active' : 'menu-item-inactive',
                        !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                    ]"
                >
                    <span
                        :class="[
                            route.path.startsWith('/settings')
                                ? 'menu-item-icon-active'
                                : 'menu-item-icon-inactive',
                        ]"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 6.66667C8.15917 6.66667 6.66667 8.15917 6.66667 10C6.66667 11.8408 8.15917 13.3333 10 13.3333C11.8408 13.3333 13.3333 11.8408 13.3333 10C13.3333 8.15917 11.8408 6.66667 10 6.66667Z" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M17.5 11.1583V8.84167L15.6833 8.23333C15.575 7.89167 15.4333 7.56667 15.2667 7.25833L16.15 5.56667L14.4333 3.85L12.7417 4.73333C12.4333 4.56667 12.1083 4.425 11.7667 4.31667L11.1583 2.5H8.84167L8.23333 4.31667C7.89167 4.425 7.56667 4.56667 7.25833 4.73333L5.56667 3.85L3.85 5.56667L4.73333 7.25833C4.56667 7.56667 4.425 7.89167 4.31667 8.23333L2.5 8.84167V11.1583L4.31667 11.7667C4.425 12.1083 4.56667 12.4333 4.73333 12.7417L3.85 14.4333L5.56667 16.15L7.25833 15.2667C7.56667 15.4333 7.89167 15.575 8.23333 15.6833L8.84167 17.5H11.1583L11.7667 15.6833C12.1083 15.575 12.4333 15.4333 12.7417 15.2667L14.4333 16.15L16.15 14.4333L15.2667 12.7417C15.4333 12.4333 15.575 12.1083 15.6833 11.7667L17.5 11.1583Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                    <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">Cài đặt</span>
                </router-link>
            </nav>
        </div>
    </aside>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
    Message2Line,
    TaskIcon,
    ChevronDownIcon,
    HorizontalDots,
} from "../../icons";
import SidebarWidget from "./SidebarWidget.vue";
import BrandLogo from "@/components/common/BrandLogo.vue";
import { useSidebar } from "@/composables/useSidebar";

const route = useRoute();
const router = useRouter();

const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

const menuGroups = [
    {
        title: "Menu chính",
        items: [
            {
                icon: Message2Line,
                name: "Tài liệu hỗ trợ",
                path: "/chat-tai-lieu",
                subItems: [
                    { name: "Tong quan", path: "/chat-tai-lieu", pro: false, new: false },
                    { name: "Chat với AI", path: "/chat-tai-lieu/chat", pro: false, new: false },
                    { name: "Thư viện tài liệu", path: "/chat-tai-lieu/library", pro: false, new: false },
                ],
            },
            {
                icon: TaskIcon,
                name: "CRM & Công việc",
                path: "/crm-work",
                subItems: [
                    { name: "Kanban", path: "/crm-deals", pro: false, new: false },
                    { name: "Kiểm tra trùng", path: "/crm-duplicate-check", pro: false, new: false },
                ],
            },
        ],
    },
];

const isActive = (path) => {
    if (path === "/chat-tai-lieu") {
        return route.path === "/chat-tai-lieu";
    }
    return route.path === path;
};

const toggleSubmenu = (groupIndex, itemIndex) => {
    const key = `${groupIndex}-${itemIndex}`;
    openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isSubmenuOpen = (groupIndex, itemIndex) => {
    const key = `${groupIndex}-${itemIndex}`;
    return openSubmenu.value === key;
};

const handleParentItemClick = (path, groupIndex, itemIndex) => {
    if (path) {
        router.push(path);
    }
    toggleSubmenu(groupIndex, itemIndex);
};

const getVisibleSubItems = (subItems = []) => subItems.filter((subItem) => subItem.path !== "/chat-tai-lieu");

onMounted(() => {
    // Open the matching submenu on first load, but still allow manual collapse.
    if (openSubmenu.value !== null) {
        return;
    }

    for (let groupIndex = 0; groupIndex < menuGroups.length; groupIndex += 1) {
        const group = menuGroups[groupIndex];
        for (let itemIndex = 0; itemIndex < group.items.length; itemIndex += 1) {
            const item = group.items[itemIndex];
            if (item.subItems?.some((subItem) => isActive(subItem.path))) {
                openSubmenu.value = `${groupIndex}-${itemIndex}`;
                return;
            }
        }
    }
});

const startTransition = (el) => {
    el.style.height = "auto";
    const height = el.scrollHeight;
    el.style.height = "0px";
    el.offsetHeight; // force reflow
    el.style.height = height + "px";
};

const endTransition = (el) => {
    el.style.height = "";
};
</script>
