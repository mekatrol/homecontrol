<template>
  <div class="menu">
    <div
      class="menu-item"
      v-if="!showingPointsView"
    >
      <button @click="emit('points')"><FontAwesomeIcon :icon="faSitemap" />Points</button>
    </div>
    <div
      class="menu-item"
      v-else
    >
      <button @click="emit('close-points')"><FontAwesomeIcon :icon="faClose" />Close Points</button>
    </div>
    <div
      class="menu-item"
      v-if="!showingPointsView"
    >
      <button @click="emit('open')"><FontAwesomeIcon :icon="faFolder" />Open</button>
    </div>
    <div
      class="menu-item"
      v-if="!showingPointsView"
    >
      <button @click="emit('new')"><FontAwesomeIcon :icon="faPlus" />New</button>
    </div>
    <div
      v-if="isFlowOpen && !showingPointsView"
      class="menu-item"
    >
      <button @click="emit('save')"><FontAwesomeIcon :icon="faSave" />Save</button>
    </div>
    <div
      v-if="isFlowOpen && !showingPointsView"
      class="menu-item"
    >
      <button @click="emit('close')"><FontAwesomeIcon :icon="faClose" />Close</button>
    </div>

    <div
      class="menu-item"
      v-for="flow in flows"
      :key="flow.id"
    >
      <button @click="emit('switch-flow', flow.id)">
        <FontAwesomeIcon :icon="faChartDiagram" />
        {{ flow.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFlowStore } from '@/stores/flow-store';
import { storeToRefs } from 'pinia';

import { faClose, faChartDiagram, faSave, faFolder, faPlus, faSitemap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

interface Props {
  isFlowOpen: boolean;
  showingPointsView: boolean;
}

defineProps<Props>();

const flowStore = useFlowStore();

const { flows } = storeToRefs(flowStore);

const emit = defineEmits<{
  (e: 'points'): void;
  (e: 'close-points'): void;
  (e: 'open'): void;
  (e: 'switch-flow', flowId: string): void;
  (e: 'new'): void;
  (e: 'save'): void;
  (e: 'close'): void;
}>();
</script>

<style scoped lang="css">
.menu {
  display: flex;
  flex-direction: row;
  padding: 0.5rem;
  gap: 0.5rem;
}

.menu-item {
  display: flex;
  flex-direction: row;
}

.menu-item button {
  padding-inline: 0.5rem;
  padding-block: 0.2rem;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.3rem;
}

.menu-item button svg {
  font-size: 1rem;
}
</style>
