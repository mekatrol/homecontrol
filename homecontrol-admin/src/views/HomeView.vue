<template>
  <main class="main-body">
    <pre>{{ appStore.user }}</pre>

    <a
      href=""
      @click.prevent="logout"
      >Logout</a
    >
  </main>
</template>

<script setup lang="ts">
import { useLogin } from '@/composables/login';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const { logout } = useLogin();
</script>
