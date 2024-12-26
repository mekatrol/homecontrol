<template>
  <g class="grid">
    <line
      v-for="(line, i) in gridLines"
      :key="i"
      :x1="line.start.x"
      :y1="line.start.y"
      :x2="line.end.x"
      :y2="line.end.y"
      class="grid-line"
    ></line>
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Line } from '../types/Line';

interface Props {
  width: number;
  height: number;
  gridSize: number;
}

const props = defineProps<Props>();

const gridLines = computed((): Line[] => {
  const lines: Line[] = [];

  if (props.height < props.gridSize || props.height < props.gridSize) {
    return [];
  }

  for (let y = 0; y < props.height; y += props.gridSize) {
    lines.push({
      start: { x: 0, y: y },
      end: { x: props.width, y: y }
    });
  }

  for (let x = 0; x < props.width; x += props.gridSize) {
    lines.push({
      start: { x: x, y: 0 },
      end: { x: x, y: props.height }
    });
  }

  return lines;
});
</script>

<style scoped lang="scss">
.grid {
  .grid-line {
    stroke: #aaaaaa77;
    stroke-width: 0.3;
    pointer-events: none;
  }
}
</style>
