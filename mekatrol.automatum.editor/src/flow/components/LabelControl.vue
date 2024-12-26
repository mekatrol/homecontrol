<template>
  <g
    :transform="`translate(${x}, ${y})`"
    class="label"
  >
    <text
      class="label"
      :fill="color"
      :alignment-baseline="verticalAlignment"
      >{{ text }}</text
    >
  </g>
</template>

<script setup lang="ts">
interface Props {
  text: string;
  color?: string;
  x: number;
  y: number;
  verticalAlignment?:
    | 'hanging'
    | 'auto'
    | 'baseline'
    | 'before-edge'
    | 'text-before-edge'
    | 'middle'
    | 'central'
    | 'after-edge'
    | 'text-after-edge'
    | 'ideographic'
    | 'alphabetic'
    | 'mathematical'
    | 'inherit'
    | undefined;
}

const props = withDefaults(defineProps<Props>(), {
  // Default text color to current color
  color: 'currentColor',

  verticalAlignment: 'hanging'
});
</script>

<style>
.label {
  pointer-events: none;
  user-select: none;
}
</style>
