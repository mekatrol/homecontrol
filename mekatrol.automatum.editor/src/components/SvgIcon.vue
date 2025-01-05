<template>
  <g
    class="icon"
    :transform="`translate(${x},${y})`"
    :width="size"
    :height="size"
  >
    <!-- icon shadow -->
    <path
      class="dither"
      stroke="none"
      :d="`M${backgroundCornerRadius} 0 h${size - backgroundCornerRadius} v${size} h${-(size - backgroundCornerRadius)} a ${backgroundCornerRadius} ${backgroundCornerRadius} 0 0 1 -${backgroundCornerRadius} -${backgroundCornerRadius} v-${size - 2 * backgroundCornerRadius} a ${backgroundCornerRadius} ${backgroundCornerRadius} 0 0 1 ${backgroundCornerRadius} -${backgroundCornerRadius}`"
      :fill="backgroundFill"
      :opacity="backgroundOpacity"
    >
    </path>

    <!-- icon placeholder -->
    <g
      ref="iconPath"
      :stroke="svgStroke"
      :stroke-width="svgStrokeWidth"
      :opacity="svgFillOpacity"
      :fill="svgFill"
      :transform="`translate(${iconTranslateOffset}, ${iconTranslateOffset}) scale(${iconScale})`"
    ></g>
  </g>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

interface Props {
  icon: string;
  iconScale?: number;
  x: number;
  y: number;
  size: number;

  backgroundCornerRadius?: number;

  svgFill?: string;
  svgFillOpacity?: string;
  svgStroke?: string;
  svgStrokeWidth?: string;

  backgroundFill: string;
  backgroundOpacity: string;
}

const props = withDefaults(defineProps<Props>(), {
  iconScale: 0.8,
  x: 0,
  y: 0,
  size: 40,

  backgroundCornerRadius: 10,

  svgFill: 'currentColor',
  svgFillOpacity: '100%',
  svgStroke: 'currentColor',
  svgStrokeWidth: '2px',

  backgroundFill: '#000',
  backgroundOpacity: '50%'
});

const iconPath = ref(null);
const fetchIcon = async () => {
  const iconUri = `/function-icons/${props.icon}.svg`;
  const imageUri = `/function-icons/${props.icon}.png`;

  // Error svg is just an empty svg
  const errorSvg = `<image href="${imageUri}" height="${props.size}" :width="${props.size}" />`;

  // Get SVG container on the current Vue component
  const svgContainer = iconPath.value! as SVGGElement;

  // Clear contents
  svgContainer.innerHTML = '';

  try {
    const response = await fetch(iconUri);
    const htmlText = await response.text();

    // Parse the returned HTML
    const svgParsedDom = new DOMParser().parseFromString(htmlText, 'text/html');

    // Get the svg tag
    const svg = svgParsedDom.querySelector('svg');

    if (svg) {
      // Get the 'g' tag (inside the SVG tag)
      const g = svgParsedDom.querySelector('g');

      if (g) {
        // Set attributes for internal graphic
        g.setAttribute('fill', props.svgFill);
        g.setAttribute('opacity', props.svgFillOpacity);
        g.setAttribute('stroke', props.svgStroke);
        g.setAttribute('stroke-width', props.svgStrokeWidth);
      }

      // Set svg attributes
      svg.setAttribute('width', `${props.size}`);
      svg.setAttribute('height', `${props.size}`);

      // Add the fetched 'g' element as the middle child
      svgContainer.appendChild(svg);
    } else {
      // Add the error svg
      svgContainer.innerHTML = errorSvg;
    }
  } catch (err) {
    console.error(err);

    // Add the error svg
    svgContainer.innerHTML = errorSvg;
  }
};

onMounted(async () => {
  await fetchIcon();
});

const iconTranslateOffset = computed(() => {
  // Scale the icon size and then the offset is half the
  // difference between original size and the scaled icon size
  const offset = (props.size - props.size * props.iconScale) / 2;
  return offset;
});

watch(
  () => props.icon,
  async () => {
    await fetchIcon();
  }
);
</script>
