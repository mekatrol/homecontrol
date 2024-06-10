<template>
  <div class="home-container">
    <div class="head"><DateTimeControl v-model="switches.panic" class="date-time" /></div>
    <div class="left"><EnvironmentSensor v-model="sensors.indoor" /></div>
    <div class="mid"><SwitchControl v-model="switches.alfrescoStringLights" @click="() => switchClicked(switches.alfrescoStringLights)" /></div>
    <div class="right"><EnvironmentSensor v-model="sensors.outdoor" /></div>
    <div class="foot">
      <PanicControl v-model="switches.panic" @click="() => switchClicked(switches.panic)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { SensorValues } from '@/models/SensorValues';
import type { ControlSwitch } from '@/models/ControlSwitch';

import EnvironmentSensor from '@/components/controls/EnvironmentSensor.vue';
import PanicControl from '@/components/controls/PanicControl.vue';
import SwitchControl from '@/components/controls/SwitchControl.vue';
import DateTimeControl from '@/components/controls/DateTimeControl.vue';

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

<style scoped lang="css">
.home-container {
  display: grid;
  grid-auto-flow: row;
  grid-template-areas:
    'head head head'
    'left mid right'
    'foot foot foot';
}

.head {
  grid-area: head;
}

.foot {
  grid-area: foot;
}

.left {
  grid-area: left;
}

.mid {
  grid-area: mid;
}

.right {
  grid-area: right;
}
</style>
