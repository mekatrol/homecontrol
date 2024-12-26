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
      @pointermove="(e) => emit(CONNECTION_POINTER_MOVE, e)"
      @pointerover="(e) => emit(CONNECTION_POINTER_OVER, e)"
      @pointerenter="(e) => emit(CONNECTION_POINTER_ENTER, e)"
      @pointerleave="(e) => emit(CONNECTION_POINTER_LEAVE, e)"
      @pointerdown="(e) => emit(CONNECTION_POINTER_DOWN, e)"
      @pointerup="(e) => emit(CONNECTION_POINTER_UP, e)"
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
import { generateCubicBezierPoints } from '../utils/cubic-spline';
import { cubicBezierToSvg } from '../utils/svg-generator';
import { computed } from 'vue';
import { useEmitter, type FlowConnectingPointerEvent, type FlowEvents } from '../utils/event-emitter';
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
import type { FlowConnecting } from '../types/FlowConnecting';

interface Props {
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

const startInputOutput = computed(() => props.connecting.startBlock.io.find((io) => io.pin === props.connecting.startPin)!);

const startOffset = computed(() => {
  return {
    x: props.connecting.startBlock.offset.x + startInputOutput.value.offset.x + BLOCK_IO_SIZE,
    y: props.connecting.startBlock.offset.y + startInputOutput.value.offset.y + BLOCK_IO_SIZE / 2
  };
});

const endOffset = computed(() => props.connecting.endLocation);

const svg = computed(() => {
  const points = generateCubicBezierPoints(startOffset.value, endOffset.value, startInputOutput.value.side);
  return cubicBezierToSvg(points);
});

const emitter = useEmitter();
const emit = (event: keyof FlowEvents, e: PointerEvent): boolean => {
  emitter.emit(event, {
    data: props.connecting,
    pointerEvent: e
  } as FlowConnectingPointerEvent);
  e.preventDefault();
  return false;
};

const { theme } = useThemeStore();
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
