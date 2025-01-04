<template>
  <slot> </slot>
  <!-- Right scrollbar -->
  <SvgScrollbar
    :x="width - SCROLLBAR_SIZE"
    :y="0"
    :width="SCROLLBAR_SIZE"
    :height="height"
    :scroll="yScroll"
    :min="0"
    :max="maxScrollY()"
    fill="#333"
    direction="vertical"
    @scroll="scroll"
    @wheel.passive="wheel"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SCROLLBAR_SIZE } from '@/constants';
import SvgScrollbar from '@/components/SvgScrollbar.vue';

interface Props {
  width: number;
  height: number;
}

withDefaults(defineProps<Props>(), {});

// This is the number of blocks that have been scrolled up
const yScroll = ref(0);

const maxScrollY = (): number => {
  return 1000;
};

const updateYScroll = (delta: number): void => {
  // Can scroll between 0 and maxScrollY() values
  yScroll.value = Math.min(maxScrollY(), Math.max(0, yScroll.value + delta));
};

const scroll = (value: number) => {
  updateYScroll(value - yScroll.value);
};

const wheel = (e: WheelEvent) => {
  updateYScroll((e.deltaY / 100) * 10);
};
</script>

<style scoped lang="scss">
svg.container > g {
  overflow: hidden;
  transform-origin: top left;
}
</style>
