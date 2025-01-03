<template>
  <g
    v-if="blockConfiguration"
    :transform="`translate(${x},${y})`"
  >
    <rect
      class="flow-block"
      :x="0"
      :y="0"
      :width="blockConfiguration.size.width"
      :height="height"
      :rx="`${theme.blockStyles.radius}px`"
      :ry="`${theme.blockStyles.radius}px`"
      :fill="theme.blockStyles.fill"
      :fill-opacity="theme.blockStyles.fillOpacity"
      :stroke="theme.blockStyles.stroke"
      :stroke-width="theme.blockStyles.strokeWidth"
    ></rect>

    <!-- Block icon -->
    <SvgIcon
      :icon="props.blockConfiguration.type.toLowerCase()"
      :x="0"
      :y="0"
      :backgroundCornerRadius="theme.blockStyles.radius"
      :size="iconSize"
      :svg-fill="theme.blockIconStyles.svg.fill"
      :svg-fill-opacity="theme.blockIconStyles.svg.opacity"
      :svg-stroke="theme.blockIconStyles.svg.stroke"
      :svg-strokeWidth="theme.blockIconStyles.svg.strokeWidth"
      :background-fill="theme.blockIconStyles.background.fill"
      :background-opacity="theme.blockIconStyles.background.opacity"
    />

    <!-- Icon right border -->
    <path
      :d="`M ${iconSize - 0.5} ${0.5} l 0 ${iconSize - 1}`"
      class="separator"
      :stroke="theme.blockStyles.stroke"
      :stroke-width="theme.blockStyles.strokeWidth"
    >
    </path>

    <!-- Label inside block -->
    <LabelControl
      :x="iconSize + textGapX"
      :y="height / 2"
      :text="blockConfiguration.type.toUpperCase()"
      vertical-alignment="middle"
      :color="theme.blockFunctionLabelStyles.color"
    />
  </g>
</template>

<script setup lang="ts">
import LabelControl from '@/components/LabelControl.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme-store';
import type { BlockTemplate } from '@/types/block-template';

const textGapX = 7;

interface Props {
  blockConfiguration: BlockTemplate;
  x: number;
  y: number;
}

const props = defineProps<Props>();

const height = computed(() => props.blockConfiguration.size.height);

// Make the icon size same as block height (less border size) so that it is displayed as a square.
// Using height works because the aspect ratio of the block is always width > height
const iconSize = computed(() => height.value);
const { theme } = useThemeStore();
</script>

<style scoped lang="css">
.label {
  font-size: 14px;
}
</style>
