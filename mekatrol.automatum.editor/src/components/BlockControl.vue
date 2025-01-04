<template>
  <g
    v-if="block"
    :transform="`translate(${blockOffset.x},${blockOffset.y})`"
    :class="block.draggingAsNew ? 'dragging-new' : ''"
  >
    <rect
      v-if="!isIOBlock"
      :class="`flow-block ${block.draggingAsNew ? 'dragging-new' : ''}${block.selected ? 'selected' : ''}`"
      focusable="true"
      :x="0"
      :y="0"
      :width="block.size.width"
      :height="block.size.height"
      :rx="`${theme.blockStyles.radius}px`"
      :ry="`${theme.blockStyles.radius}px`"
      :fill="blockStyles.fill"
      :fill-opacity="blockStyles.opacity"
      :stroke="blockStyles.stroke"
      :stroke-width="`${block.selected ? theme.blockStyles.strokeWidthSelected : theme.blockStyles.strokeWidth}`"
      @pointermove="(e) => emit(BLOCK_POINTER_MOVE, e)"
      @pointerover="(e) => emit(BLOCK_POINTER_OVER, e)"
      @pointerenter="(e) => emit(BLOCK_POINTER_ENTER, e)"
      @pointerleave="(e) => emit(BLOCK_POINTER_LEAVE, e)"
      @pointerdown="(e) => emit(BLOCK_POINTER_DOWN, e)"
      @pointerup="(e) => emit(BLOCK_POINTER_UP, e)"
    ></rect>
    <path
      v-else
      :d="generatePath(block)"
      :fill="blockStyles.fill"
      :fill-opacity="blockStyles.opacity"
      :stroke="blockStyles.stroke"
      :stroke-width="`${block.selected ? theme.blockStyles.strokeWidthSelected : theme.blockStyles.strokeWidth}`"
      style="stroke-linejoin: round; stroke-linecap: round"
      @pointermove="(e) => emit(BLOCK_POINTER_MOVE, e)"
      @pointerover="(e) => emit(BLOCK_POINTER_OVER, e)"
      @pointerenter="(e) => emit(BLOCK_POINTER_ENTER, e)"
      @pointerleave="(e) => emit(BLOCK_POINTER_LEAVE, e)"
      @pointerdown="(e) => emit(BLOCK_POINTER_DOWN, e)"
      @pointerup="(e) => emit(BLOCK_POINTER_UP, e)"
    />

    <!-- Block icon -->
    <SvgIcon
      :icon="props.block.functionType.toLowerCase()"
      :x="isRightIcon ? block.size.width - (iconSize + 4) : 0"
      :y="0"
      :backgroundCornerRadius="theme.blockStyles.radius"
      :size="iconSize"
      :svg-fill="theme.blockIconStyles.svg.fill"
      :svg-fill-opacity="iconStyles.opacity"
      :svg-stroke="iconStyles.stroke"
      :svg-strokeWidth="theme.blockIconStyles.svg.strokeWidth"
      :background-fill="iconStyles.fill"
      :background-opacity="iconStyles.opacity"
    />

    <!-- Icon border -->
    <path
      :d="iconBorderPath"
      class="separator"
      :stroke="theme.blockStyles.stroke"
      :stroke-width="theme.blockStyles.strokeWidth"
    >
    </path>

    <!-- Label inside block -->
    <LabelControl
      :x="iconSize + textGapX"
      :y="block.size.height / 2"
      :text="block.functionType.toUpperCase()"
      vertical-alignment="middle"
      :color="theme.blockFunctionLabelStyles.color"
    />

    <!-- Label below block -->
    <LabelControl
      v-if="block.label"
      :x="0"
      :y="block.size.height + textGapY"
      :text="block.label"
      :color="theme.blockLabelStyles.color"
    />

    <!-- Block markers -->
    <MarkerControl
      v-if="!isIOBlock"
      v-for="(marker, i) in markers"
      :key="i"
      :x="marker.offset.x"
      :y="marker.offset.y"
      :shape="marker.shape"
      :size="MARKER_SIZE"
      :fill-color="marker.fillColor"
      :stroke-color="marker.strokeColor"
    />

    <!-- Block io -->
    <InputOutputControl
      v-for="inputOutput in io"
      :key="inputOutput.pin"
      :block="block"
      :inputOutput="inputOutput"
      :fill-color="theme.blockIOStyles.fill"
      :stroke-color="theme.blockIOStyles.stroke"
      :stroke-width="theme.blockIOStyles.strokeWidth"
    />
  </g>
</template>

<script setup lang="ts">
import LabelControl from '@/components/LabelControl.vue';
import MarkerControl from '@/components/MarkerControl.vue';
import InputOutputControl from '@/components/InputOutputControl.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import type { MarkerShape } from '@/types/MarkerShape';
import { computed, ref } from 'vue';
import { useEmitter, type FlowEvents } from '@/utils/event-emitter';
import {
  MARKER_OFFSET_X,
  MARKER_OFFSET_Y,
  MARKER_SIZE,
  BLOCK_POINTER_MOVE,
  BLOCK_POINTER_OVER,
  BLOCK_POINTER_ENTER,
  BLOCK_POINTER_LEAVE,
  BLOCK_POINTER_DOWN,
  BLOCK_POINTER_UP,
  DRAGGING_BLOCK_MOVE
} from '@/constants';
import { useThemeStore } from '@/stores/theme-store';
import { leftPointedRect, rightPointedRect } from '@/utils/svg-generator';
import type { FlowBlock, Offset } from '@/services/api-generated';

const textGapX = 7;
const textGapY = 5;

interface Props {
  block: FlowBlock;
}

const props = defineProps<Props>();

const io = props.block.io;

const blockOffset = ref<Offset>(props.block.offset);

interface Styles {
  opacity: string;
  fill: string;
  stroke: string;
}

const isIOBlock = computed(() => {
  switch (props.block.functionType) {
    case 'BI':
    case 'BO':
    case 'AI':
    case 'AO':
      return true;

    default:
      return false;
  }
});

const isRightIcon = computed(() => {
  switch (props.block.functionType) {
    case 'BI':
    case 'AI':
      return true;

    default:
      return false;
  }
});

const blockStyles = computed((): Styles => {
  return {
    opacity: props.block.dragLocationInvalid ? '20%' : theme.blockStyles.fillOpacity,
    fill: props.block.dragLocationInvalid ? 'red' : theme.blockStyles.fill,
    stroke: props.block.dragLocationInvalid ? 'darkred' : theme.blockStyles.stroke
  };
});

const iconStyles = computed((): Styles => {
  return {
    opacity: props.block.dragLocationInvalid ? '20%' : theme.blockIconStyles.background.opacity,
    fill: props.block.dragLocationInvalid ? 'darkred' : theme.blockIconStyles.background.fill,
    stroke: theme.blockIconStyles.svg.stroke
  };
});

const labelStyles = computed((): Styles => {
  return {
    opacity: props.block.dragLocationInvalid ? '100%' : theme.blockStyles.fillOpacity,
    fill: props.block.dragLocationInvalid ? 'red' : theme.blockStyles.fill,
    stroke: props.block.dragLocationInvalid ? 'red' : theme.blockStyles.stroke
  };
});

// Make the icon size same as block height (less border size) so that it is displayed as a square.
// Using height works because the aspect ratio of the block is always width > height
const iconSize = computed(() => props.block.size.height);

const generatePath = (block: FlowBlock) => {
  if (block.functionType === 'BO' || block.functionType === 'AO') {
    return rightPointedRect(block.size);
  }

  return leftPointedRect(block.size);
};

const iconBorderPath = computed(() => {
  if (isRightIcon.value) {
    return `M ${props.block.size.width - (iconSize.value + 5)} ${0.5} l 0 ${iconSize.value - 1}`;
  }

  return `M ${iconSize.value + 1.5} ${0.5} l 0 ${iconSize.value - 1}`;
});

const emitter = useEmitter();

emitter.on(DRAGGING_BLOCK_MOVE, (b) => {
  if (b.id === props.block.id) {
    // This block is being dragged from the palette

    // Make copy of offset to trigger reactive event
    const offset = { x: b.offset.x, y: b.offset.y };
    blockOffset.value = offset;
  }
});

const emit = (event: keyof FlowEvents, e: PointerEvent): boolean => {
  if (props.block) {
    emitter.emit(event, {
      data: props.block,
      pointerEvent: e
    });
  }

  e.preventDefault();
  return false;
};

const markers = computed((): MarkerShape[] => {
  if (!props.block) {
    return [];
  }

  return [
    {
      shape: 'circle',
      offset: { x: props.block.size.width - (MARKER_SIZE + MARKER_OFFSET_X) * 1, y: MARKER_OFFSET_Y },
      size: { width: MARKER_SIZE, height: MARKER_SIZE },
      strokeColor: 'black',
      fillColor: 'yellow'
    },
    {
      shape: 'triangle',
      offset: { x: props.block.size.width - (MARKER_SIZE + MARKER_OFFSET_X) * 2, y: MARKER_OFFSET_Y },
      size: { width: MARKER_SIZE, height: MARKER_SIZE },
      strokeColor: 'darkred',
      fillColor: 'coral'
    },
    {
      shape: 'square',
      offset: { x: props.block.size.width - (MARKER_SIZE + MARKER_OFFSET_X) * 3, y: MARKER_OFFSET_Y },
      size: { width: MARKER_SIZE, height: MARKER_SIZE },
      strokeColor: 'green',
      fillColor: 'white'
    }
  ];
});

const { theme } = useThemeStore();
</script>

<style scoped lang="css">
.flow-block {
  cursor: pointer;
}

.dragging-new {
  filter: grayscale(20%);
}

.label {
  font-size: 14px;
}
</style>
