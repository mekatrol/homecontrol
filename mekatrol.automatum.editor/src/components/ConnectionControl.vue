<template>
  <!-- Spline path -->
  <g v-if="show && flowController">
    <path
      :class="`flow-connection ${connection.selected ? 'selected' : ''}`"
      focusable="true"
      :d="svg"
      :fill="theme.connectionStyles.fill"
      :fill-opacity="theme.connectionStyles.fillOpacity"
      :stroke="theme.connectionStyles.stroke"
      :stroke-width="`${connection.selected ? theme.connectionStyles.strokeWidthSelected : theme.connectionStyles.strokeWidth}`"
      @pointermove="(e) => flowController!.emitter.emitConnectionPointerMove(e, connection)"
      @pointerover="(e) => flowController!.emitter.emitConnectionPointerOver(e, connection)"
      @pointerenter="(e) => flowController!.emitter.emitConnectionPointerEnter(e, connection)"
      @pointerleave="(e) => flowController!.emitter.emitConnectionPointerLeave(e, connection)"
      @pointerdown="(e) => flowController!.emitter.emitConnectionPointerDown(e, connection)"
      @pointerup="(e) => flowController!.emitter.emitConnectionPointerUp(e, connection)"
      zOrder="100"
    />

    <rect
      :x="startOffset.x"
      :y="startOffset.y - BLOCK_IO_SIZE / 2"
      rx="2"
      ry="2"
      :width="BLOCK_IO_SIZE"
      :height="BLOCK_IO_SIZE"
    ></rect>

    <rect
      :x="endOffset.x"
      :y="endOffset.y - BLOCK_IO_SIZE / 2"
      rx="2"
      ry="2"
      :width="BLOCK_IO_SIZE"
      :height="BLOCK_IO_SIZE"
    ></rect>
  </g>
</template>

<script setup lang="ts">
import { generateCubicBezierPoints } from '@/utils/cubic-spline';
import { cubicBezierToSvg } from '@/utils/svg-generator';
import { computed } from 'vue';
import { BLOCK_IO_SIZE } from '@/constants';
import { useThemeStore } from '@/stores/theme-store';
import type { FlowConnection } from '@/services/api-generated';
import { useFlowController } from '@/composables/flow-controller';

interface Props {
  flowId: string;

  show?: boolean;

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

const startInputOutput = computed(() => flowController.value!.getConnectionStartInputOutput(props.connection));
const startOffset = computed(() => flowController.value!.getConnectionStartOffset(props.connection));
const endOffset = computed(() => flowController.value!.getConnectionEndOffset(props.connection));

const svg = computed(() => {
  const points = generateCubicBezierPoints(startOffset.value, endOffset.value, startInputOutput.value.side);
  return cubicBezierToSvg(points);
});

const flowController = useFlowController(props.flowId);

const { theme } = useThemeStore();
</script>

<style scoped lang="css">
.flow-connection {
  cursor: pointer;
}
</style>
