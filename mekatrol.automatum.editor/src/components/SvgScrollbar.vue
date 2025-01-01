<template>
  <g class="scrollbar">
    <!-- The scroll bar -->
    <rect
      :x="x"
      :y="y"
      :width="width"
      :height="height"
      :fill="fill"
      ref="scrollbar"
      @pointerdown="dragSliderStart"
      @pointerup="dragSliderEnd"
      @pointermove="dragSliderMove"
      @mousewheel.passive="(e: WheelEvent) => wheel(e)"
    ></rect>
    <!-- The slider -->
    <rect
      style="pointer-events: none"
      :x="x"
      :y="sliderY"
      :width="width"
      :height="Math.max(0, sliderHeight)"
      :fill="sliderDragging ? '#dff' : '#aaa'"
      stroke="black"
      stroke-width="1px"
    ></rect>
  </g>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Offset } from '@/services/api-generated';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  scroll: number;
  min: number;
  max: number;
  fill: string;
  direction: 'horizontal' | 'vertical';
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'scroll', value: number): void;
  (e: 'mousewheel', value: WheelEvent): void;
}>();

const scrollbar = ref();
const sliderPointerEvent = ref<PointerEvent | undefined>(undefined);
const sliderPointDownOffset = ref<Offset>({ x: 0, y: 0 });

// The range that the scroll value can be within
const scrollRange = computed(() => props.max - props.min);

// How large a step size if for scroll range (but at least 20 high)
const sliderHeight = computed(() => Math.max(20, props.height / scrollRange.value));

const scale = computed(() => {
  // We need to scale the slider Y value such that the total scrollable height
  // scales to the scrollbar height
  const scale = (props.height - sliderHeight.value) / scrollRange.value;

  return scale;
});

const sliderDragging = ref(false);

const dragSliderStart = (e: PointerEvent) => {
  // Button zero is normally the main button (eg left mouse button)
  if (e.button !== 0) {
    return;
  }

  // We are now dragging the slider
  sliderDragging.value = true;

  // We the mouse button is clicked then we need to calculate what the scroll value would be at that offset
  const offsetAdjust = Math.min(props.max - 1, Math.max(0, Math.floor(e.offsetY / sliderHeight.value)));

  // We need to track the offset of the mouse from the top of the slider at the calculated scroll position
  // so that the slider doesn't 'jump'
  sliderPointDownOffset.value = { x: e.offsetX, y: e.offsetY - offsetAdjust * sliderHeight.value };

  // Capture pointer events so that we can track the mouse outside of the scroll bar if the user has not released the mouse button
  (scrollbar.value as SVGTextElement).setPointerCapture(e.pointerId);

  // Call move event to emit scroll value
  dragSliderMove(e);
};

const dragSliderEnd = (e: PointerEvent) => {
  // Button zero is normally the main button (eg left mouse button)
  if (e.button !== 0) {
    return;
  }

  // Release pointer events
  (scrollbar.value as SVGTextElement).releasePointerCapture(e.pointerId);

  sliderDragging.value = false;
  sliderPointerEvent.value = undefined;
};

const dragSliderMove = (e: PointerEvent) => {
  // Only process event if currently dragging slider
  if (sliderDragging.value) {
    sliderPointerEvent.value = e;
    emit('scroll', (props.direction === 'vertical' ? e.offsetY : e.offsetX) / scale.value);
  }
};

const wheel = (e: WheelEvent) => {
  emit('mousewheel', e);
};

const sliderY = computed(() => {
  return sliderDragging.value && sliderPointerEvent.value
    ? // relative to mouse position (to make slide smooth)
      Math.min(props.height - sliderHeight.value, Math.max(0, sliderPointerEvent.value.offsetY - sliderPointDownOffset.value.y))
    : // based on scroll value
      props.scroll * scale.value;
});
</script>

<style scoped lang="css">
.scrollbar {
  cursor: pointer;
}
</style>
