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
    :flow-id="flowId"
    :connection="connection"
  />
  <BlockControl
    v-if="flowController"
    v-for="(block, i) in flowController.flow.blocks"
    :key="i"
    :flow-id="flowId"
    :block="block"
  />
  <ConnectingControl
    v-if="flowController && connecting"
    :connecting="connecting"
    :flow-id="flowId"
  />
  <BlockControl
    v-if="flowController && flowController.dragBlock && flowController.dragBlock.draggingAsNew"
    :block="flowController.dragBlock"
    :flow-id="flowId"
  />
</template>

<script setup lang="ts">
import GridControl from '@/components/GridControl.vue';
import ConnectionControl from '@/components/ConnectionControl.vue';
import ConnectingControl from '@/components/ConnectingControl.vue';
import BlockControl from '@/components/BlockControl.vue';
import { onMounted, ref } from 'vue';
import { useFlowStore } from '@/stores/flow-store';
import type { FlowController } from '@/types/FlowController';
import { useEmitter } from '@/utils/event-emitter';
import { CONNECTING_END, CONNECTING_START } from '@/constants';
import { type FlowConnecting } from '@/types/FlowConnecting';

interface Props {
  width: number;
  height: number;
  gridSize: number;
  flowId: string;
}

const props = defineProps<Props>();

const { getFlowController } = useFlowStore();
const flowController = ref<FlowController | undefined>(undefined);

const connecting = ref<FlowConnecting | undefined>(undefined);

const emitter = useEmitter();

emitter.on(CONNECTING_START, (c) => {
  connecting.value = c;
});

emitter.on(CONNECTING_END, (_) => {
  connecting.value = undefined;
});

onMounted(() => {
  if (props.flowId) {
    flowController.value = getFlowController(props.flowId)?.value;
  }
});
</script>
