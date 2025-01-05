<template>
  <g
    class="block-template-palette"
    @pointermove="(e) => palettePointerMove(e)"
    @pointerup="(e) => palettePointerUp(e)"
    @mousewheel.passive="(e: WheelEvent) => wheel(e)"
    @focusin="(e) => focus(e)"
  >
    <!-- We need a rect covering the full palette view so that mouse wheel events are captured when the mouse is over areas that are not a block -->
    <rect
      x="0"
      y="0"
      :width="width"
      :height="height"
      fill="transparent"
      @mousewheel.passive="(e: WheelEvent) => wheel(e)"
    ></rect>

    <!-- Block templates -->
    <BlockTemplateControl
      v-for="(blockTemplate, i) in blockTemplates"
      :key="i"
      :blockConfiguration="blockTemplate"
      :x="gap"
      :y="blockRowYTop(i)"
      @pointerdown="(e) => pointerDown(e, blockTemplate, gap, blockRowYTop(i))"
      @pointerup="pointerUp"
    />

    <!-- Right scrollbar -->
    <SvgScrollbar
      :x="width - scrollbarWidth"
      :y="0"
      :width="scrollbarWidth"
      :height="height"
      :scroll="yScroll"
      :min="0"
      :max="maxScrollY()"
      fill="#333"
      direction="vertical"
      @scroll="scroll"
      @wheel.passive="wheel"
    />
  </g>
</template>

<script setup lang="ts">
import BlockTemplateControl from '@/components/BlockTemplateControl.vue';
import SvgScrollbar from '@/components/SvgScrollbar.vue';
import { useFlowStore } from '@/stores/flow-store';
import { BLOCK_HEIGHT, BLOCK_POINTER_DOWN, BLOCK_POINTER_UP } from '@/constants';
import type { BlockTemplate } from '@/types/block-template';
import { v4 as uuidv4 } from 'uuid';
import type { FlowBlock } from '@/services/api-generated';
import { emitBlockEvent } from '@/services/event-emitter';
import { ref } from 'vue';
import { useActiveFlowController } from '@/composables/active-flow-controller';

interface Props {
  width: number;
  height: number;
  scrollbarWidth: number;
  gap: number;
}

const props = defineProps<Props>();

const { blockTemplates } = useFlowStore();

const activeFlowController = useActiveFlowController();

// This is the number of blocks that have been scrolled up
const yScroll = ref(0);

const blockRowHeight = () => {
  // The height of a block row is the height of a block + the gap (1/2 before and 1/2 after).
  return BLOCK_HEIGHT + props.gap;
};

const blockRowYTop = (i: number) => {
  // The y top position of a block is 1/2 the gap + the height of all of the rows that have come before this one
  // and scrolled up (-ve) by the scroll amount
  return props.gap / 2 + i * blockRowHeight() - yScroll.value;
};

const maxScrollY = (): number => {
  const h = blockRowHeight();

  // The maximum value we can scroll to is the total number of blocks - the number of block that fit within the palette height
  // Also add 80% of a block row height so that scrolling to end always shows a gap after the last block
  const max = (blockTemplates.length - 1) * h - Math.floor(props.height / h) * h + h;
  return max;
};

const updateYScroll = (delta: number): void => {
  // Can scroll between 0 and maxScrollY() values
  yScroll.value = Math.min(maxScrollY(), Math.max(0, yScroll.value + delta));
};

const scroll = (value: number) => {
  updateYScroll(value - yScroll.value);
};

const wheel = (e: WheelEvent) => {
  updateYScroll((e.deltaY / 100) * blockRowHeight());
};

const palettePointerMove = (e: PointerEvent) => {
  activeFlowController.value?.pointerMove(e);
};

const palettePointerUp = (e: PointerEvent) => {
  activeFlowController.value?.pointerUp(e);
};

const pointerDown = (e: PointerEvent, blockTemplate: BlockTemplate, x: number, y: number): void => {
  if (!activeFlowController.value) {
    return;
  }

  const block: FlowBlock = {
    offset: { x: x - props.width, y: y },
    functionType: blockTemplate.type,
    size: { ...blockTemplate.size },
    id: uuidv4(),
    io: blockTemplate.io.map((io) => ({ ...io })),
    selected: true,
    z: 1,
    zBoost: 0,
    zOrder: 1,
    label: 'New block',
    draggingAsNew: true
  };

  emitBlockEvent(activeFlowController.value.flow.id, BLOCK_POINTER_DOWN, e, block);
};

const pointerUp = (e: PointerEvent) => {
  if (!activeFlowController.value?.dragBlock) {
    return;
  }

  emitBlockEvent(activeFlowController.value.flow.id, BLOCK_POINTER_UP, e, activeFlowController.value?.dragBlock);
};

const focus = (_e: FocusEvent): void => {
  // Do nothing, and SVG element won't raise keyboard events unless it has
  // a focus event handler
};
</script>
