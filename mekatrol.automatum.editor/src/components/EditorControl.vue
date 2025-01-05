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
        :flow-id="flowId"
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
          :flow-id="flowId"
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
import { useFlowController } from '@/composables/flow-controller';
import type { FlowController } from '@/services/flow-edit-controller';

interface Props {
  flowId: string;
}

const props = defineProps<Props>();

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

const initFromFlowController = (fc: FlowController | undefined): void => {
  if (fc) {
    // Wire all events
    wireSvgEvents();

    // Update SVG height based on current view
    calculateSvgHeight();
  }
};

const flowController = useFlowController(props.flowId, initFromFlowController, initFromFlowController);

const pointerMove = (e: PointerEvent) => {
  if (!flowController.value) {
    return;
  }

  flowController.value.pointerMove(e);
};

const pointerLeave = (e: PointerEvent) => {
  if (!flowController.value) {
    return;
  }
  flowController.value.pointerLeave(e);
};

const pointerDown = (e: PointerEvent) => {
  if (!flowController.value) {
    return;
  }
  flowController.value.pointerDown(e);
};

const pointerUp = (e: PointerEvent) => {
  if (!flowController.value) {
    return;
  }
  flowController.value.pointerUp(e);
};

const keyPress = (e: KeyboardEvent) => {
  if (!flowController.value) {
    return;
  }
  flowController.value.keyPress(e);
};

const keyDown = (e: KeyboardEvent) => {
  if (!flowController.value) {
    return;
  }
  flowController.value.keyDown(e);
};

const keyUp = (e: KeyboardEvent) => {
  if (!flowController.value) {
    return;
  }
  flowController.value.keyUp(e);
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
