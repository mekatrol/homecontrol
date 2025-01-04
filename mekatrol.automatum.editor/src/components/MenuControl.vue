<template>
  <div class="menu">
    <div class="menu-item">
      <button @click="onOpenFlow"><span class="material-symbols-outlined">folder</span>Open</button>
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
      <button @click="onCloseFlow"><span class="material-symbols-outlined">close</span>Close</button>
    </div>
    <AppDialog
      :show="showOpenDialog"
      confirm-label="Open"
      :confirm-enabled="!!clickedFlow"
      @confirm="onOpenConfirm"
      @cancel="onOpenCancel"
    >
      <OpenFlow
        @flow-clicked="onFlowClicked"
        @flow-clicked-close="onFlowClickedClose"
      ></OpenFlow>
    </AppDialog>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/app-store';
import { ref } from 'vue';
import AppDialog from './AppDialog.vue';
import OpenFlow from '@/components/OpenFlow.vue';
import type { Flow } from '@/services/api-generated';

const appStore = useAppStore();

const { newFlow, saveFlow } = appStore;
const { activeFlow } = storeToRefs(appStore);
const showOpenDialog = ref(false);

const onOpenFlow = () => {
  showOpenDialog.value = true;
};

const onOpenConfirm = async (): Promise<void> => {
  showOpenDialog.value = false;

  if (clickedFlow.value !== undefined) {
    if (activeFlow.value) {
      appStore.closeFlow(activeFlow.value.id);
    }
    await appStore.openFlow(clickedFlow.value.id);
  }

  clickedFlow.value = undefined;
};

const onOpenCancel = async (): Promise<void> => {
  showOpenDialog.value = false;
  clickedFlow.value = undefined;
};

const onCloseFlow = () => {
  if (activeFlow.value) {
    appStore.closeFlow(activeFlow.value.id);
  }
};

const clickedFlow = ref<Flow | undefined>(undefined);

const onFlowClicked = (flowClicked: Flow): void => {
  clickedFlow.value = flowClicked;
};

const onFlowClickedClose = async (flowClicked: Flow): Promise<void> => {
  clickedFlow.value = flowClicked;
  await onOpenConfirm();
};

const onNewFlow = async () => {
  if (activeFlow.value) {
    appStore.closeFlow(activeFlow.value.id);
  }

  await newFlow(true);
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
