<template>
  <nav v-if="!isHidden"><SidebarSlider /></nav>
  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import SidebarSlider from './components/SidebarSlider.vue';
import { onMounted, ref } from 'vue';
import { useHomeAssistant } from './composables/home-assistant';

const isHidden = ref(false);

const homeAssistant = useHomeAssistant('ws://ha.lan:8123/api/websocket', 'aaa');

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

onMounted(async () => {
  await homeAssistant.disconnect();
  await homeAssistant.connect();
  await delay(2000);
  await homeAssistant.disconnect();
});
</script>
