<template>
  <router-link to="/" class="lg:hidden">
    <BrandLogo />
  </router-link>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BrandLogo from '@/components/common/BrandLogo.vue'
</script>
