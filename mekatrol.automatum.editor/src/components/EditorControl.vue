<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="flow-editor"
    :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
    ref="svg"
    focusable="true"
    @pointermove="(e) => pointerMove(e)"
    @pointerleave="(e) => pointerLeave(e)"
    @pointerdown="(e) => pointerDown(e)"
    @pointerup="(e) => pointerUp(e)"
    @keypress="(e) => keyPress(e)"
    @keydown="(e) => keyDown(e)"
    @keyup="(e) => keyUp(e)"
    @focusin="(e) => focus(e)"
  >
    <g :transform="`translate(0, 0)`">
      <PaletteControl
        :x="0"
        :y="0"
        :width="blockPaletteWidth"
        :height="svgHeight"
        :gap="PALETTE_GAP"
        :scrollbarWidth="SCROLLBAR_SIZE"
      />
    </g>
    <g :transform="`translate(${blockPaletteWidth}, 0)`">
      <ContainerControl
        :width="svgWidth - blockPaletteWidth"
        :height="svgHeight"
      >
        <FlowControl
          :width="svgWidth - blockPaletteWidth"
          :height="svgHeight"
          :grid-size="gridSize"
        />
      </ContainerControl>
    </g>
  </svg>
</template>

<script setup lang="ts">
import PaletteControl from '@/components/PaletteControl.vue';
import FlowControl from '@/components/FlowControl.vue';
import { ref, watch } from 'vue';
import { useScreenSize } from '@/composables/screen-size';
import ContainerControl from '@/components/ContainerControl.vue';
import { BLOCK_PALETTE_WIDTH, PALETTE_GAP, SCROLLBAR_SIZE } from '@/constants';
import { useActiveFlowController } from '@/composables/active-flow-controller';
import type { FlowController } from '@/services/flow-controller';
import type { FlowEventEmitter } from '@/services/event-emitter';

const gridSize = ref(20);
const screenSize = useScreenSize();
const blockPaletteWidth = BLOCK_PALETTE_WIDTH;
const svg = ref<SVGAElement>();
const svgWidth = ref(0);
const svgHeight = ref(0);

const calculateSvgHeight = () => {
  // Cast to SVG element
  const svgElement = svg.value!;

  // Get the parent container
  const parentDiv = svgElement.parentElement as HTMLElement;

  // Use the parent height as the height
  svgWidth.value = parentDiv.clientWidth;
  svgHeight.value = parentDiv.clientHeight;
};

const initFromFlowController = (_flowController: FlowController | undefined, _emitter: FlowEventEmitter | undefined): void => {
  if (!activeFlowController.value) {
    return;
  }

  // Wire all events
  wireSvgEvents();

  // Update SVG height based on current view
  calculateSvgHeight();
};

const activeFlowController = useActiveFlowController(initFromFlowController, initFromFlowController);

const pointerMove = (e: PointerEvent) => {
  if (!activeFlowController.value) {
    return;
  }

  activeFlowController.value.pointerMove(e);
};

const pointerLeave = (e: PointerEvent) => {
  if (!activeFlowController.value) {
    return;
  }
  activeFlowController.value.pointerLeave(e);
};

const pointerDown = (e: PointerEvent) => {
  if (!activeFlowController.value) {
    return;
  }
  activeFlowController.value.pointerDown(e);
};

const pointerUp = (e: PointerEvent) => {
  if (!activeFlowController.value) {
    return;
  }
  activeFlowController.value.pointerUp(e);
};

const keyPress = (e: KeyboardEvent) => {
  if (!activeFlowController.value) {
    return;
  }
  activeFlowController.value.keyPress(e);
};

const keyDown = (e: KeyboardEvent) => {
  if (!activeFlowController.value) {
    return;
  }
  activeFlowController.value.keyDown(e);
};

const keyUp = (e: KeyboardEvent) => {
  if (!activeFlowController.value) {
    return;
  }
  activeFlowController.value.keyUp(e);
};

const focus = (_e: FocusEvent): void => {
  // Do nothing, and SVG element won't raise keyboard events unless it has
  // a focus event handler
};

const wireSvgEvents = () => {
  // Send all svg element focus events to the SVG
  svg.value!.querySelectorAll('[focusable=true]').forEach((el) => {
    el.addEventListener('focus', (_e) => {
      svg.value!.focus({
        preventScroll: true
      });
    });
  });
};

watch(
  () => screenSize.value,
  () => {
    calculateSvgHeight();
  }
);
</script>
