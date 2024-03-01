<template>
  <div class="sidebar-slider">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  msg: string;
}>();
</script>
