<template>
  <nav>
    <MenuControl
      :is-flow-open="!!flowId"
      @open="onOpenFlow"
      @switch-flow="switchFlow"
      @new="onNewFlow"
      @save="onSaveFlow"
      @close="onCloseFlow"
    />
  </nav>
  <main>
    <div
      v-if="flowId"
      :key="flowId"
    >
      <EditorControl :flow-id="flowId" />
    </div>
    <div>
      <FlowInformationControl :validation="flowValidation" />
    </div>
  </main>
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
import MenuControl from '@/components/MenuControl.vue';
import EditorControl from '@/components/EditorControl.vue';
import FlowInformationControl from '@/components/FlowInformationControl.vue';
import BusyOverlay from '@/components/BusyOverlay.vue';
import MessageOverlay from '@/components/MessageOverlay.vue';
import AppDialog from './AppDialog.vue';
import OpenFlow from '@/components/OpenFlow.vue';
import { useAppStore } from '@/stores/app-store';
import { ref, watch } from 'vue';
import type { Flow } from '@/services/api-generated';
import { storeToRefs } from 'pinia';
import { useFlowStore } from '@/stores/flow-store';
import { validateFlow } from '@/validation/flow-validation';
import { type ValidationResult } from '@/validation/validation-helpers';
import { showInfoMessage } from '@/services/message';

const appStore = useAppStore();
const { newFlow, saveFlow } = appStore;
const { activeFlow } = storeToRefs(appStore);

const flowId = ref<string | undefined>(undefined);

const showOpenDialog = ref(false);

const flowValidation = ref<ValidationResult[]>([]);

const switchFlow = (flowId: string) => {
  // If a flow was active then close it
  if (appStore.activeFlow) {
    appStore.closeFlow(appStore.activeFlow.id, false);
  }

  const flowStore = useFlowStore();
  const flow = flowStore.flows.find((f) => f.id == flowId);

  if (flow) {
    appStore.activeFlow = flow;
  }
};

const onOpenFlow = () => {
  showOpenDialog.value = true;
};

const onOpenConfirm = async (): Promise<void> => {
  showOpenDialog.value = false;

  if (clickedFlow.value === undefined) {
    throw new Error('Open flow confirmed, but no flow was selected...');
  }

  // If a flow was active then close it
  if (appStore.activeFlow) {
    appStore.closeFlow(appStore.activeFlow.id, true);
  }

  // Open the selected flow
  await appStore.openFlow(clickedFlow.value.id);

  // Clear the selection
  clickedFlow.value = undefined;
};

const onOpenCancel = async (): Promise<void> => {
  showOpenDialog.value = false;
  clickedFlow.value = undefined;
};

const onCloseFlow = () => {
  if (activeFlow.value) {
    appStore.closeFlow(activeFlow.value.id, true);
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
    appStore.closeFlow(activeFlow.value.id, true);
  }

  await newFlow(true);
};

const onSaveFlow = async () => {
  try {
    if (!activeFlow.value) {
      // Do nothing if active flow not found
      return;
    }

    flowValidation.value = validateFlow(activeFlow.value);

    if (flowValidation.value.length > 0) {
      // Show message with validation errors
      showInfoMessage('Cannot save, please fix validation errors');
      return;
    }

    await saveFlow(activeFlow.value);
  } catch (e) {
    console.error(e);
  }
};

watch(
  () => activeFlow.value,
  (flow: Flow | undefined) => {
    flowId.value = flow?.id;
  }
);
</script>

<style scoped lang="scss">
main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;

  > div {
    width: 80%;
    max-width: 80%;
  }

  > div:last-child {
    max-width: 20%;
  }
}
</style>
