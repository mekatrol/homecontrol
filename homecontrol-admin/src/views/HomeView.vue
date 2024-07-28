<template>
  <main class="main-body">
    <pre>{{ appStore.user }}</pre>

    <a
      href=""
      @click.prevent="logout"
      >Logout</a
    >

    <a
      href=""
      @click.prevent="getUser"
      >Get user</a
    >
  </main>
</template>

<script setup lang="ts">
import { useLogin } from '@/composables/login';
import { useAuthService } from '@/services/authService';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const { logout } = useLogin();

const getUser = async (): Promise<void> => {
  await useAuthService().updateUser();
};
</script>
