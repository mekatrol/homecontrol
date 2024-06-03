<template>
  <div class="page">
    <div class="col">
      <EnvironmentSensor v-model="sensors.indoor" />
      <EnvironmentSensor v-model="sensors.outdoor" />
    </div>
    <div class="col">
      <SwitchControl v-model="switches.alfrescoStringLights" @click="() => switchClicked(switches.alfrescoStringLights)" />
      <PanicControl v-model="switches.panic" @click="() => switchClicked(switches.panic)" />
    </div>
    <div class="col"></div>
    <div class="col"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { SensorValues } from '@/models/SensorValues';
import type { ControlSwitch } from '@/models/ControlSwitch';

import EnvironmentSensor from '@/components/controls/EnvironmentSensor.vue';
import PanicControl from '@/components/controls/PanicControl.vue';
import SwitchControl from '@/components/controls/SwitchControl.vue';

const sensors = ref({
  indoor: {
    label: 'Indoor',
    temperature: 23.0,
    humidity: 56,
    pressure: 1020
  } as SensorValues,
  outdoor: {
    label: 'Outdoor',
    temperature: 32.0,
    humidity: 85,
    pressure: 1020
  } as SensorValues
});

const switches = ref({
  alfrescoStringLights: {
    label: 'Alfresco string lights',
    state: true
  } as ControlSwitch,
  panic: {
    label: 'PANIC',
    state: false
  } as ControlSwitch
});

const switchClicked = (theSwitch: ControlSwitch): void => {
  theSwitch.state = !theSwitch.state ? true : false;
};
</script>

<style lang="css">
.page {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
</style>
