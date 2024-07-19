<template>
  <component :is="svg" :class="`svg-icon color-${color}`" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, watch } from 'vue';

interface Props {
  name: string;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'currentColor'
});

const importSvg = (): unknown => {
  // Paths must be relative and start with './' or '../'
  // see: https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
  return defineAsyncComponent(() => import(`../../../src/assets/svg/${props.name}.svg`));
};

let svg = importSvg();

watch(
  () => props.name,
  () => {
    svg = importSvg();
  }
);
</script>
