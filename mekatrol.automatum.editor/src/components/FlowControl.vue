<template>
  <GridControl
    :width="width"
    :height="height"
    :grid-size="gridSize"
  />

  <ConnectionControl
    v-for="(connection, i) in activeFlowController?.flow.connections"
    :key="i"
    :connection="connection"
  />
  <BlockControl
    v-for="(block, i) in activeFlowController?.flow.blocks"
    :key="i"
    :flow-id="activeFlowController?.flow.id"
    :block="block"
  />
  <ConnectingControl
    v-if="activeFlowController && connecting"
    :connecting="connecting"
    :flow-id="activeFlowController.flow.id"
  />
  <BlockControl
    v-if="activeFlowController && dragBlock"
    :block="dragBlock"
    :flow-id="activeFlowController.flow.id"
  />
</template>

<script setup lang="ts">
import GridControl from '@/components/GridControl.vue';
import ConnectionControl from '@/components/ConnectionControl.vue';
import ConnectingControl from '@/components/ConnectingControl.vue';
import BlockControl from '@/components/BlockControl.vue';
import { ref } from 'vue';
import { FlowEventEmitter } from '@/services/event-emitter';
import { type FlowConnecting } from '@/types/flow-connecting';
import type { FlowBlock } from '@/services/api-generated';
import { useActiveFlowController } from '@/composables/active-flow-controller';
import type { FlowController } from '@/services/flow-controller';

interface Props {
  width: number;
  height: number;
  gridSize: number;
}

defineProps<Props>();

const dragBlock = ref<FlowBlock | undefined>(undefined);

const connecting = ref<FlowConnecting | undefined>(undefined);

const initEmitter = (_flowController: FlowController | undefined, emitter: FlowEventEmitter | undefined) => {
  if (!emitter) {
    return;
  }

  emitter.onDraggingBlockStart((e) => {
    dragBlock.value = e.data;
  });

  emitter.onDraggingBlockEnd((e) => {
    dragBlock.value = e.data;
  });

  emitter.onDraggingBlockMove((e) => {
    dragBlock.value = e.data;
  });

  emitter.onConnectingStart((e) => {
    connecting.value = e.data;
  });

  emitter.onConnectingEnd((_e) => {
    connecting.value = undefined;
  });
};

const activeFlowController = useActiveFlowController(initEmitter, initEmitter);
</script>
