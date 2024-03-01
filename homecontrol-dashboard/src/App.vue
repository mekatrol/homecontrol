<template>
  <nav><SidebarSlider /></nav>
  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import SidebarSlider from './components/SidebarSlider.vue';
</script>
