<template>
  <nav v-if="!isHidden"><SidebarSlider /></nav>
  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import SidebarSlider from './components/SidebarSlider.vue';
import { ref } from 'vue';

const isHidden = ref(false);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    isHidden.value = true;
  } else {
    const timer = setTimeout(() => {
      isHidden.value = false;
      clearTimeout(timer);
    }, 5);
  }
});
</script>
