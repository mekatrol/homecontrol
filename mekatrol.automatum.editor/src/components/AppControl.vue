<template>
  <nav>
    <MenuControl
      :is-flow-open="!!flowId"
      :showing-points-view="selectedTab === 0"
      @open="onOpenFlow"
      @new="onNewFlow"
      @save="onSaveFlow"
      @close="onCloseFlow"
    />
  </nav>
  <main>
    <TabView
      :tabs="tabs"
      :active-tab="selectedTab"
      @tab-changed="onTabChanged"
    >
      <component
        :is="tabs[selectedTab].component"
        :flow-id="flowId"
        :flow-validation="flowValidation"
      />
    </TabView>
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
</template>

<script setup lang="ts">
import MenuControl from '@/components/MenuControl.vue';
import TabView from '@/components/TabView.vue';
import AppDialog from './AppDialog.vue';
import OpenFlow from '@/components/OpenFlow.vue';
import { useAppStore } from '@/stores/app-store';
import { markRaw, ref } from 'vue';
import type { Flow } from '@/services/api-generated';
import { validateFlow } from '@/validation/flow-validation';
import { type ValidationResult } from '@/validation/validation-helpers';
import { showInfoMessage } from '@/services/message';
import PointsView from '@/components/PointsView.vue';
import FlowEditorView from '@/components/FlowEditorView.vue';
import { EMPTY_GUID } from '@/constants';
import type { Tab } from '@/types/tab';
import { useFlowStore } from '@/stores/flow-store';
import SystemState from './SystemState.vue';

const appStore = useAppStore();
const { getNewFlow, saveFlow } = appStore;

const flowId = ref<string | undefined>(undefined);

const showOpenDialog = ref(false);
const flowValidation = ref<ValidationResult[]>([]);
const selectedTab = ref<number>(0);

let tabs = markRaw<Tab[]>([
  {
    name: 'System',
    id: EMPTY_GUID,
    component: SystemState
  },
  {
    name: 'Points',
    id: EMPTY_GUID,
    component: PointsView
  }
]);

const onOpenFlow = () => {
  showOpenDialog.value = true;
};

const onOpenConfirm = async (): Promise<void> => {
  showOpenDialog.value = false;

  if (clickedFlow.value === undefined) {
    throw new Error('Open flow confirmed, but no flow was selected...');
  }

  // Open the selected flow
  const flow = await appStore.getFlow(clickedFlow.value.id);

  // Only add if not already open in a tab
  if (!tabs.find((t) => t.id === flow.id)) {
    const tab = {
      name: flow.name,
      id: flow.id,
      component: FlowEditorView
    };

    flowId.value = flow.id;
    const i = tabs.push(tab);
    selectedTab.value = i - 1;
  }

  // Clear the selection
  clickedFlow.value = undefined;
};

const onOpenCancel = async (): Promise<void> => {
  showOpenDialog.value = false;
  clickedFlow.value = undefined;
};

const getTabFlow = (tabNumber: number): Flow | undefined => {
  const tab = tabs[tabNumber];

  return useFlowStore().flows.find((f) => f.id === tab.id);
};

const onCloseFlow = () => {
  const flow = getTabFlow(selectedTab.value);

  if (flow) {
    appStore.closeFlow(flow.id, true);
    tabs = tabs.filter((t) => t.id != flow.id);
  }

  selectedTab.value = Math.max(0, selectedTab.value - 1);
};

const clickedFlow = ref<Flow | undefined>(undefined);

const onTabChanged = (tabIndex: number) => {
  selectedTab.value = tabIndex;

  const activeTab = tabs[tabIndex];

  flowId.value = activeTab.id === EMPTY_GUID ? undefined : activeTab.id;
};

const onFlowClicked = (flowClicked: Flow): void => {
  clickedFlow.value = flowClicked;
};

const onFlowClickedClose = async (flowClicked: Flow): Promise<void> => {
  clickedFlow.value = flowClicked;
  await onOpenConfirm();
};

const onNewFlow = async () => {
  const flow = await getNewFlow();

  const tab = {
    name: flow.name,
    id: flow.id,
    component: FlowEditorView
  };

  flowId.value = flow.id;
  const i = tabs.push(tab);
  selectedTab.value = i - 1;
};

const onSaveFlow = async () => {
  try {
    const flow = getTabFlow(selectedTab.value);

    if (!flow) {
      // Do nothing if active tab not a flow editor
      return;
    }

    flowValidation.value = validateFlow(flow);

    if (flowValidation.value.length > 0) {
      // Show message with validation errors
      const messages = flowValidation.value.map((v) => v.message);
      showInfoMessage(`Cannot save, please fix validation errors: ${messages.join(', ')}`);
      return;
    }

    await saveFlow(flow);
  } catch (e) {
    console.error(e);
  }
};
</script>

<style scoped lang="css">
main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}
</style>
