<template>
  <rect
    :class="`input-output`"
    :x="inputOutput.offset.x"
    :y="inputOutput.offset.y"
    :rx="`${cornerRadius}px`"
    :ry="`${cornerRadius}px`"
    :width="inputOutput.size.width"
    :height="inputOutput.size.height"
    :fill="fillColor"
    :stroke="strokeColor"
    :stroke-width="strokeWidth"
    @pointermove="(e) => flowController!.emitter.emitBlockIoPointerMove(e, inputOutput, block)"
    @pointerover="(e) => flowController!.emitter.emitBlockIoPointerOver(e, inputOutput, block)"
    @pointerenter="(e) => flowController!.emitter.emitBlockIoPointerEnter(e, inputOutput, block)"
    @pointerleave="(e) => flowController!.emitter.emitBlockIoPointerLeave(e, inputOutput, block)"
    @pointerdown="(e) => flowController!.emitter.emitBlockIoPointerDown(e, inputOutput, block)"
    @pointerup="(e) => flowController!.emitter.emitBlockIoPointerUp(e, inputOutput, block)"
  >
    ></rect
  >
</template>

<script setup lang="ts">
import type { FlowBlock, InputOutput } from '@/services/api-generated';
import { useFlowController } from '@/composables/flow-controller';

interface Props {
  flowId: string;
  block: FlowBlock;
  inputOutput: InputOutput;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: string;
}
const cornerRadius = 2;

const props = withDefaults(defineProps<Props>(), {
  // Default colors to current color
  fillColor: 'currentColor',
  strokeColor: 'currentColor',
  strokeWidth: '2px'
});

const flowController = useFlowController(props.flowId);
</script>

<style>
rect.input-output {
  cursor: crosshair;
}
</style>
