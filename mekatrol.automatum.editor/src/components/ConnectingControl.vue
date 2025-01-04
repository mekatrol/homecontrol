<template>
  <!-- Spline path -->
  <g
    v-if="show"
    :class="`flow-connection ${connecting ? 'connecting' : ''} ${connecting.cssClasses}`"
  >
    <path
      class="`line connecting"
      :d="svg"
      :fill="theme.connectionStyles.fill"
      :fill-opacity="theme.connectionStyles.fillOpacity"
      :stroke="theme.connectionStyles.stroke"
      :stroke-width="theme.connectionStyles.strokeWidth"
      @pointermove="(e) => emitPointerEvent(flowId, CONNECTING_POINTER_MOVE, e, props.connecting)"
      @pointerover="(e) => emitPointerEvent(flowId, CONNECTING_POINTER_OVER, e, props.connecting)"
      @pointerenter="(e) => emitPointerEvent(flowId, CONNECTING_POINTER_ENTER, e, props.connecting)"
      @pointerleave="(e) => emitPointerEvent(flowId, CONNECTING_POINTER_LEAVE, e, props.connecting)"
      @pointerdown="(e) => emitPointerEvent(flowId, CONNECTING_POINTER_DOWN, e, props.connecting)"
      @pointerup="(e) => emitPointerEvent(flowId, CONNECTING_POINTER_UP, e, props.connecting)"
      zOrder="100"
    />

    <rect
      class="connection-start"
      :x="startOffset.x - BLOCK_IO_SIZE"
      :y="startOffset.y - BLOCK_IO_SIZE / 2"
      rx="2"
      ry="2"
      :width="BLOCK_IO_SIZE"
      :height="BLOCK_IO_SIZE"
    ></rect>

    <rect
      class="connection-end"
      :x="endOffset.x - BLOCK_IO_SIZE / 2"
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
import { computed, ref } from 'vue';
import { emitPointerEvent, useEmitter } from '@/utils/event-emitter';
import {
  CONNECTING_POINTER_MOVE,
  CONNECTING_POINTER_OVER,
  CONNECTING_POINTER_ENTER,
  CONNECTING_POINTER_LEAVE,
  CONNECTING_POINTER_DOWN,
  CONNECTING_POINTER_UP,
  BLOCK_IO_SIZE,
  CONNECTING_END_LOCATION_CHANGE,
  CONNECTING_START
} from '@/constants';
import { useThemeStore } from '@/stores/theme-store';
import type { FlowConnecting } from '@/types/FlowConnecting';
import type { InputOutput, Offset } from '@/services/api-generated';

interface Props {
  flowId: string;

  show?: boolean;

  connecting: FlowConnecting;

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

const getStartIo = (connecting: FlowConnecting): InputOutput => {
  return connecting.startBlock.io.find((io) => io.pin === connecting.startPin)!;
};

const calculateStartOffset = (connecting: FlowConnecting): Offset => {
  return {
    x: connecting.startBlock.offset.x + getStartIo(connecting).offset.x + BLOCK_IO_SIZE,
    y: connecting.startBlock.offset.y + getStartIo(connecting).offset.y + BLOCK_IO_SIZE / 2
  };
};

const startInputOutput = computed(() => getStartIo(props.connecting));

const startOffset = ref<Offset>(calculateStartOffset(props.connecting));
const endOffset = ref<Offset>(props.connecting.endLocation);

const svg = computed(() => {
  const points = generateCubicBezierPoints(startOffset.value, endOffset.value, startInputOutput.value.side);
  return cubicBezierToSvg(points);
});

const { theme } = useThemeStore();

const emitter = useEmitter(props.flowId);

emitter.on(CONNECTING_START, (e) => {
  startOffset.value = calculateStartOffset(e!);
  endOffset.value = startOffset.value;
});

emitter.on(CONNECTING_END_LOCATION_CHANGE, (e) => {
  endOffset.value = e!.endLocation;
});
</script>

<style scoped lang="scss">
.flow-connection {
  .line {
    fill: none;
    cursor: pointer;
  }

  &.connecting {
    .line {
      stroke-dasharray: 5;
    }

    .connection-start {
      fill: #008000;
    }

    .connection-end {
      fill: #ff0000;
    }

    &.valid-end-point {
      .line {
        &.connecting {
          stroke-dasharray: 0;
          stroke: #00ff37;
        }
      }
      .connection-end {
        fill: #008000;
      }
    }
  }
}
</style>
