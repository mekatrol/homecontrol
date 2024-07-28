<template>
  <main class="main-body">
    <h1>H1</h1>

    <a href="" @click.prevent="logout">User authenticated: {{ !!appStore.currentUser }}</a>
  </main>
</template>

<script setup lang="ts">
import { useLogin } from '@/composables/login';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const { logout } = useLogin();

</script>
