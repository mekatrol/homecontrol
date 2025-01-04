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
import { useEmitter, type FlowEvents } from '@/utils/event-emitter';
import {
  BLOCK_IO_POINTER_MOVE,
  BLOCK_IO_POINTER_OVER,
  BLOCK_IO_POINTER_ENTER,
  BLOCK_IO_POINTER_LEAVE,
  BLOCK_IO_POINTER_DOWN,
  BLOCK_IO_POINTER_UP
} from '@/constants';
import type { FlowBlock, InputOutput } from '@/services/api-generated';

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

const emitter = useEmitter(props.flowId);

const emit = (event: keyof FlowEvents, e: PointerEvent): boolean => {
  emitter.emit(event, {
    inputOutput: props.inputOutput,
    data: props.block,
    pointerEvent: e
  });
  e.preventDefault();
  return false;
};
</script>

<style>
rect.input-output {
  cursor: crosshair;
}
</style>
