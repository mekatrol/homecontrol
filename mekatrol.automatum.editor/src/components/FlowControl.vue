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
import { useEmitter } from '@/services/event-emitter';
import { CONNECTING_END, CONNECTING_START, DRAGGING_BLOCK_END, DRAGGING_BLOCK_MOVE, DRAGGING_BLOCK_START } from '@/constants';
import { type FlowConnecting } from '@/types/flow-connecting';
import type { FlowBlock } from '@/services/api-generated';
import { useActiveFlowController } from '@/composables/active-flow-controller';

interface Props {
  width: number;
  height: number;
  gridSize: number;
}

defineProps<Props>();

const dragBlock = ref<FlowBlock | undefined>(undefined);

const connecting = ref<FlowConnecting | undefined>(undefined);

const initEmitter = () => {
  if (!activeFlowController.value) {
    return;
  }
  const emitter = useEmitter(activeFlowController.value.flow.id);

  emitter.on(DRAGGING_BLOCK_START, (b) => {
    dragBlock.value = b;
  });

  emitter.on(DRAGGING_BLOCK_END, (b) => {
    dragBlock.value = b;
  });

  emitter.on(DRAGGING_BLOCK_MOVE, (b) => {
    dragBlock.value = b;
  });

  emitter.on(CONNECTING_START, (c) => {
    connecting.value = c;
  });

  emitter.on(CONNECTING_END, (_) => {
    connecting.value = undefined;
  });
};

const activeFlowController = useActiveFlowController(initEmitter, initEmitter);
</script>
