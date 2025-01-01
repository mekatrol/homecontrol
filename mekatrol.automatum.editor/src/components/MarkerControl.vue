<template>
  <g
    class="marker"
    :transform="`translate(${x}, ${y})`"
  >
    <!-- circle -->
    <circle
      v-if="shape === 'circle'"
      :cx="halfSize"
      :cy="halfSize"
      :r="halfSize"
      class="marker-circle"
      :fill="fillColor"
      :stroke="strokeColor"
    ></circle>
    <!-- triangle -->
    <path
      v-if="shape === 'triangle'"
      :d="`M 0,${size - 1} l ${size},0 -${halfSize},-${size - k} z`"
      class="marker-triangle"
      :fill="fillColor"
      :stroke="strokeColor"
    ></path>
    <!-- square -->
    <rect
      v-if="shape === 'square'"
      :rx="k"
      :ry="k"
      :width="size - k"
      :height="size - k"
      class="marker-square"
      :fill="fillColor"
      :stroke="strokeColor"
    ></rect>
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Shape } from '@/types/Shape';

interface Props {
  shape: Shape;
  size: number;
  fillColor?: string;
  strokeColor?: string;
  x: number;
  y: number;
}

const props = withDefaults(defineProps<Props>(), {
  // Default colors to current color
  fillColor: 'currentColor',
  strokeColor: 'currentColor'
});

const halfSize = computed(() => props.size >> 1);

// k is just an arbitrary constant that produces reasonably looking
// corner radii, rect sizes and shape border offsets
const k = 2;
</script>
