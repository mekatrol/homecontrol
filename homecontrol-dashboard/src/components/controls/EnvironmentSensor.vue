<template>
  <div v-if="model" class="sensor-values">
    <div>
      <SvgIcon name="thermometer" width="60" />
      <p>{{ model.temperature }} °</p>
    </div>
    <div>
      <p>{{ model.humidity }} %</p>
      <p>{{ model.pressure }} hPa</p>
    </div>
    <p>{{ model.label }}</p>
  </div>
</template>

<script setup lang="ts">
import { type SensorValues } from '@/models/SensorValues';

import SvgIcon from '@/components/controls/SvgIcon.vue';

const model = defineModel<SensorValues>();
</script>

<style scoped lang="css">
.sensor-values {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  background-color: #333;
  padding: 1rem;
  align-items: center;
  margin: 1rem;
  border-radius: 10rem;
  border: 2px solid #0096ff;
}

.sensor-values > div {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.sensor-values > div:first-child {
  font-size: 2em;
}
</style>
