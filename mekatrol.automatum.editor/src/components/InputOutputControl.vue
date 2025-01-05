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
    @pointermove="(e) => activeFlowController!.emitter.emitBlockIoPointerMove(e, inputOutput, block)"
    @pointerover="(e) => activeFlowController!.emitter.emitBlockIoPointerOver(e, inputOutput, block)"
    @pointerenter="(e) => activeFlowController!.emitter.emitBlockIoPointerEnter(e, inputOutput, block)"
    @pointerleave="(e) => activeFlowController!.emitter.emitBlockIoPointerLeave(e, inputOutput, block)"
    @pointerdown="(e) => activeFlowController!.emitter.emitBlockIoPointerDown(e, inputOutput, block)"
    @pointerup="(e) => activeFlowController!.emitter.emitBlockIoPointerUp(e, inputOutput, block)"
  >
    ></rect
  >
</template>

<script setup lang="ts">
import type { FlowBlock, InputOutput } from '@/services/api-generated';
import { useActiveFlowController } from '@/composables/active-flow-controller';

interface Props {
  block: FlowBlock;
  inputOutput: InputOutput;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: string;
}
const cornerRadius = 2;

withDefaults(defineProps<Props>(), {
  // Default colors to current color
  fillColor: 'currentColor',
  strokeColor: 'currentColor',
  strokeWidth: '2px'
});

const activeFlowController = useActiveFlowController();
</script>

<style>
rect.input-output {
  cursor: crosshair;
}
</style>
