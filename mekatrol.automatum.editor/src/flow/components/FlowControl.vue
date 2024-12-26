<template>
  <GridControl
    :width="width"
    :height="height"
    :grid-size="gridSize"
  />

  <ConnectionControl
    v-if="flowController"
    v-for="(connection, i) in flowController.flow.connections"
    :key="i"
    :flow-key="flowKey"
    :connection="connection"
  />
  <BlockControl
    v-if="flowController"
    v-for="(block, i) in flowController.flow.blocks"
    :key="i"
    :flow-key="flowKey"
    :block="block"
  />
  <ConnectingControl
    v-if="flowController && flowController.drawingConnection"
    :connecting="flowController.drawingConnection"
    :flow-key="flowKey"
  />
  <BlockControl
    v-if="flowController && flowController.dragBlock && flowController.dragBlock.draggingAsNew"
    :block="flowController.dragBlock"
    :flow-key="flowKey"
  />
</template>

<script setup lang="ts">
import GridControl from './GridControl.vue';
import ConnectionControl from './ConnectionControl.vue';
import ConnectingControl from './ConnectingControl.vue';
import BlockControl from './BlockControl.vue';
import { FlowController, useFlowController } from '../types/FlowController';
import { onMounted, ref, watch } from 'vue';

interface Props {
  width: number;
  height: number;
  gridSize: number;
  flowKey: string;
}

const props = defineProps<Props>();

const flowController = ref<FlowController | undefined>(undefined);

onMounted(() => {
  if (props.flowKey) {
    flowController.value = useFlowController(props.flowKey);
  }
});

watch(
  () => props.flowKey,
  (_oldValue: string, newValue: string) => {
    if (!newValue) {
      flowController.value = undefined;
      return;
    }

    flowController.value = useFlowController(newValue);
  }
);
</script>
