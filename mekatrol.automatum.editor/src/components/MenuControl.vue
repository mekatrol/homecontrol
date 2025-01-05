<template>
  <div class="menu">
    <div class="menu-item">
      <button @click="emit('open')"><span class="material-symbols-outlined">folder</span>Open</button>
    </div>
    <div class="menu-item">
      <button @click="emit('new')"><span class="material-symbols-outlined">add</span>New</button>
    </div>
    <div
      v-if="isFlowOpen"
      class="menu-item"
    >
      <button @click="emit('save')"><span class="material-symbols-outlined">save</span>Save</button>
    </div>
    <div
      v-if="isFlowOpen"
      class="menu-item"
    >
      <button @click="emit('close')"><span class="material-symbols-outlined">close</span>Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isFlowOpen: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'open'): void;
  (e: 'new'): void;
  (e: 'save'): void;
  (e: 'close'): void;
}>();
</script>

<style scoped lang="css">
.menu {
  display: flex;
  flex-direction: row;
  padding: 0.5rem;
  gap: 0.5rem;
}

.menu-item {
  display: flex;
  flex-direction: row;
}

.menu-item button {
  padding-inline: 0.5rem;
  padding-block: 0.2rem;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.3rem;
}
</style>
