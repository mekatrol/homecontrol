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
        :flow-id="flowId"
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
          :flow-id="flowId"
        />
      </ContainerControl>
    </g>
  </svg>
</template>

<script setup lang="ts">
import PaletteControl from '@/components/PaletteControl.vue';
import FlowControl from '@/components/FlowControl.vue';
import { onMounted, ref, watch } from 'vue';
import { useScreenSize } from 'vue-boosted';
import { FlowController, useFlowController } from '@/types/FlowController';
import ContainerControl from '@/components/ContainerControl.vue';
import { useAppStore } from '@/stores/app-store';
import { PALETTE_GAP, SCROLLBAR_SIZE } from '@/constants';

interface Props {
  flowId: string;
}

const props = defineProps<Props>();

const gridSize = ref(20);
const screenSize = useScreenSize();
const { blockPaletteWidth } = useAppStore();
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

const flowController = ref<FlowController | undefined>(undefined);

onMounted(() => {
  if (props.flowId) {
    flowController.value = useFlowController(props.flowId);
  }
  calculateSvgHeight();
});

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

onMounted(() => {
  if (props.flowId) {
    flowController.value = useFlowController(props.flowId);
    calculateSvgHeight();
  }

  // Wire all events
  wireSvgEvents();

  calculateSvgHeight();
});

watch(
  () => screenSize.value,
  () => {
    calculateSvgHeight();
  }
);

watch(
  () => props.flowId,
  (_oldValue: string, newValue: string) => {
    if (!newValue) {
      flowController.value = undefined;
      return;
    }

    flowController.value = useFlowController(newValue);

    // Wire all events
    wireSvgEvents();

    calculateSvgHeight();
  }
);
</script>
