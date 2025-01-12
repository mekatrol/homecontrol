<template>
  <SystemState v-if="systemState.isLoading" />
  <AppControl v-else />
  <BusyOverlay
    :show="appStore.isBusy"
    full-screen
  />
  <MessageOverlay
    :show="!!appStore.messageData"
    :data="appStore.messageData"
    full-screen
  />
</template>

<script setup lang="ts">
import BusyOverlay from '@/components/BusyOverlay.vue';
import MessageOverlay from '@/components/MessageOverlay.vue';
import AppControl from '@/components/AppControl.vue';
import SystemState from '@/components/SystemState.vue';
import { useAppStore } from '@/stores/app-store';
import { storeToRefs } from 'pinia';

const appStore = useAppStore();

const { systemState } = storeToRefs(appStore);
</script>
