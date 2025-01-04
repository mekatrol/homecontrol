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
    @pointermove="(e) => emit(BLOCK_IO_POINTER_MOVE, e)"
    @pointerover="(e) => emit(BLOCK_IO_POINTER_OVER, e)"
    @pointerenter="(e) => emit(BLOCK_IO_POINTER_ENTER, e)"
    @pointerleave="(e) => emit(BLOCK_IO_POINTER_LEAVE, e)"
    @pointerdown="(e) => emit(BLOCK_IO_POINTER_DOWN, e)"
    @pointerup="(e) => emit(BLOCK_IO_POINTER_UP, e)"
  >
    ></rect
  >
</template>

<script setup lang="ts">
import { emitIOEvent, type FlowEvents } from '@/utils/event-emitter';
import {
  BLOCK_IO_POINTER_MOVE,
  BLOCK_IO_POINTER_OVER,
  BLOCK_IO_POINTER_ENTER,
  BLOCK_IO_POINTER_LEAVE,
  BLOCK_IO_POINTER_DOWN,
  BLOCK_IO_POINTER_UP
} from '@/constants';
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

const props = withDefaults(defineProps<Props>(), {
  // Default colors to current color
  fillColor: 'currentColor',
  strokeColor: 'currentColor',
  strokeWidth: '2px'
});

const activeFlowController = useActiveFlowController();

const emit = (event: keyof FlowEvents, e: PointerEvent): boolean => {
  if (!activeFlowController.value) {
    return false;
  }

  emitIOEvent(activeFlowController.value.flow.id, event, e, props.inputOutput, props.block);
  return false;
};
</script>

<style>
rect.input-output {
  cursor: crosshair;
}
</style>
