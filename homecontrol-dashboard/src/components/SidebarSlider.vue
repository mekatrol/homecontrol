<template>
  <div class="sidebar-slider">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  msg: string;
}>();
</script>
