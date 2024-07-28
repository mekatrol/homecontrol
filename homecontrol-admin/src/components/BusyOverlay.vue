<template>
  <div :class="`overlay ${fullScreen ? 'full-screen' : ''} ${show ? 'show' : ''}`">
    <div class="spinner"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
  fullScreen?: boolean;
}

withDefaults(defineProps<Props>(), {
  show: false
});
</script>
