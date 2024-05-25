<template>
  <div v-if="model" class="control-switch">
    <div>
      <button class="switch">
        <SvgIcon width="60" :name="model.state === true ? 'switch-on' : 'switch-off'" :class="model.state === undefined ? 'offline' : ''" @click="switchClicked" />
      </button>
    </div>
    <div></div>
    <p>{{ model.label }}</p>
  </div>
</template>

<script setup lang="ts">
import { type ControlSwitch } from '@/models/ControlSwitch';

import SvgIcon from '@/components/controls/SvgIcon.vue';

interface Emits {
  (evt: 'click'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<ControlSwitch>();

const switchClicked = (): void => {
  if (model.value?.state !== undefined) {
    emit('click');
  }
};
</script>

<style lang="css">
.control-switch {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  background-color: #333;
  padding: 1rem;
  align-items: center;
  margin: 1rem;
  border-radius: 10rem;
  border: 2px solid #ff4500;
}

.control-switch > div {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.control-switch > div:first-child {
  font-size: 2em;
}

.control-switch .offline {
  color: var(--clr-negative);
}

.control-switch button {
  background-color: inherit;
  border: none;
  padding: 0;
  margin: 0;
  min-height: 66px;
}
</style>
