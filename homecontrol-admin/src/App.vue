<template>
  <header v-if="!isLoginPage">
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />

  <BusyOverlay
    :show="appStore.isBusy"
    full-screen
  />
  <AppMessage
    :show="appStore.isBusy"
    full-screen
  />
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useAuthService } from './services/authService';
import { useAppStore } from './stores/app';
import BusyOverlay from '@/components/BusyOverlay.vue';
import AppMessage from '@/components/AppMessage.vue';

const route = useRoute();
const isLoginPage = computed(() => route.path === '/login');

const appStore = useAppStore();
const authService = useAuthService();

onMounted(async () => {
  // Load access token from local/session storage if it exists
  await authService.loadStorageToken();
});
</script>
