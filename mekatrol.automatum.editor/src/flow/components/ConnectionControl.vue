<template>
  <!-- Spline path -->
  <g v-if="show">
    <path
      :class="`flow-connection ${connection.selected ? 'selected' : ''}`"
      focusable="true"
      :d="svg"
      :fill="theme.connectionStyles.fill"
      :fill-opacity="theme.connectionStyles.fillOpacity"
      :stroke="theme.connectionStyles.stroke"
      :stroke-width="`${connection.selected ? theme.connectionStyles.strokeWidthSelected : theme.connectionStyles.strokeWidth}`"
      @pointermove="(e) => emit(CONNECTION_POINTER_MOVE, e)"
      @pointerover="(e) => emit(CONNECTION_POINTER_OVER, e)"
      @pointerenter="(e) => emit(CONNECTION_POINTER_ENTER, e)"
      @pointerleave="(e) => emit(CONNECTION_POINTER_LEAVE, e)"
      @pointerdown="(e) => emit(CONNECTION_POINTER_DOWN, e)"
      @pointerup="(e) => emit(CONNECTION_POINTER_UP, e)"
      zOrder="100"
    />

    <rect
      :x="startOffset.x"
      :y="startOffset.y"
      rx="2"
      ry="2"
      :width="BLOCK_IO_SIZE"
      :height="BLOCK_IO_SIZE"
    ></rect>

    <rect
      :x="endOffset.x"
      :y="endOffset.y"
      rx="2"
      ry="2"
      :width="BLOCK_IO_SIZE"
      :height="BLOCK_IO_SIZE"
    ></rect>
  </g>
</template>

<script setup lang="ts">
import { generateCubicBezierPoints } from '../utils/cubic-spline';
import { cubicBezierToSvg } from '../utils/svg-generator';
import { computed } from 'vue';
import { useEmitter, type FlowConnectionPointerEvent, type FlowEvents } from '../utils/event-emitter';
import {
  CONNECTION_POINTER_MOVE,
  CONNECTION_POINTER_OVER,
  CONNECTION_POINTER_ENTER,
  CONNECTION_POINTER_LEAVE,
  CONNECTION_POINTER_DOWN,
  CONNECTION_POINTER_UP,
  BLOCK_IO_SIZE
} from '../constants';
import { useThemeStore } from '../stores/theme-store';
import { useFlowController } from '../types/FlowController';
import type { FlowConnection } from '@/services/api-generated';

interface Props {
  show?: boolean;

  flowId: string;

  connection: FlowConnection;

  showPoints?: boolean;

  lineColor?: string;
  lineStrokeWidth?: number | string;

  startPointColor?: string;
  startPointRadius?: number | string;

  endPointColor?: string;
  endPointRadius?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  showPoints: false,
  lineColor: '#ccc',
  lineStrokeWidth: 2,
  endPointColor: 'red',
  startPointRadius: 5,
  startPointColor: '#fff',
  endPointRadius: 5
});

const flowController = useFlowController(props.flowId);

const startInputOutput = computed(() => flowController.getConnectionStartInputOutput(props.connection));
const startOffset = computed(() => flowController.getConnectionStartOffset(props.connection));

const endOffset = computed(() => flowController.getConnectionEndOffset(props.connection));

const svg = computed(() => {
  const points = generateCubicBezierPoints(startOffset.value, endOffset.value, startInputOutput.value.side);
  return cubicBezierToSvg(points);
});

const emitter = useEmitter();
const emit = (event: keyof FlowEvents, e: PointerEvent): boolean => {
  emitter.emit(event, {
    data: props.connection,
    pointerEvent: e
  } as FlowConnectionPointerEvent);
  e.preventDefault();
  return false;
};

const { theme } = useThemeStore();
</script>

<style scoped lang="css">
.flow-connection {
  cursor: pointer;
}
</style>
