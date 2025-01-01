<template>
  <div class="menu">
    <div class="menu-item">
      <button><span class="material-symbols-outlined">folder</span>Open</button>
    </div>
    <div class="menu-item">
      <button @click="onNewFlow"><span class="material-symbols-outlined">add</span>New</button>
    </div>
    <div
      v-if="activeFlow"
      class="menu-item"
    >
      <button @click="onSaveFlow"><span class="material-symbols-outlined">save</span>Save</button>
    </div>
    <div
      v-if="activeFlow"
      class="menu-item"
    >
      <button><span class="material-symbols-outlined">check_box</span>Enable</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/app-store';

const appStore = useAppStore();

const { newFlow, saveFlow } = appStore;
const { activeFlow } = storeToRefs(appStore);

const onNewFlow = async () => {
  try {
    await newFlow(true);
  } catch (e) {
    console.error(e);
  }
};

const onSaveFlow = async () => {
  try {
    if (!activeFlow.value) {
      // Do nothing if active flow not found
      return;
    }

    await saveFlow(activeFlow.value);
  } catch (e) {
    console.error(e);
  }
};
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
