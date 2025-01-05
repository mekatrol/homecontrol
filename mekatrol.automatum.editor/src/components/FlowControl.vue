<template>
  <GridControl
    :width="width"
    :height="height"
    :grid-size="gridSize"
  />

  <ConnectionControl
    v-for="(connection, i) in flowController?.flow.connections"
    :key="i"
    :flow-id="flowId"
    :connection="connection"
  />
  <BlockControl
    v-for="(block, i) in flowController?.flow.blocks"
    :key="i"
    :flow-id="flowId"
    :block="block"
  />
  <ConnectingControl
    v-if="connecting"
    :connecting="connecting"
    :flow-id="flowId"
  />
  <BlockControl
    v-if="dragBlock"
    :block="dragBlock"
    :flow-id="flowId"
  />
</template>

<script setup lang="ts">
import GridControl from '@/components/GridControl.vue';
import ConnectionControl from '@/components/ConnectionControl.vue';
import ConnectingControl from '@/components/ConnectingControl.vue';
import BlockControl from '@/components/BlockControl.vue';
import { ref } from 'vue';
import { type FlowConnecting } from '@/types/flow-connecting';
import type { FlowBlock } from '@/services/api-generated';
import { useFlowController } from '@/composables/flow-controller';
import type { FlowController } from '@/services/flow-edit-controller';

interface Props {
  flowId: string;
  width: number;
  height: number;
  gridSize: number;
}

const props = defineProps<Props>();

const dragBlock = ref<FlowBlock | undefined>(undefined);

const connecting = ref<FlowConnecting | undefined>(undefined);

const initEmitter = (fc: FlowController | undefined) => {
  if (!fc) {
    return;
  }

  fc.emitter.onBlockDragStart((e) => {
    dragBlock.value = e.data;
  });

  fc.emitter.onBlockDragEnd((e) => {
    dragBlock.value = e.data;
  });

  fc.emitter.onBlockDragMove((e) => {
    dragBlock.value = e.data;
  });

  fc.emitter.onConnectingStart((e) => {
    connecting.value = e.data;
  });

  fc.emitter.onConnectingEnd((_e) => {
    connecting.value = undefined;
  });
};

const flowController = useFlowController(props.flowId, initEmitter, initEmitter);
</script>
