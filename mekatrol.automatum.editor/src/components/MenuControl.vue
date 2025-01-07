<template>
  <div class="menu">
    <div class="menu-item">
      <button
        class="btn icon"
        @click="emit('open')"
      >
        <FontAwesomeIcon :icon="faFolder" />Open flow
      </button>
    </div>
    <div class="menu-item">
      <button
        class="btn icon"
        @click="emit('new')"
      >
        <FontAwesomeIcon :icon="faPlus" />New flow
      </button>
    </div>
    <div
      v-if="isFlowOpen"
      class="menu-item"
    >
      <button
        class="btn icon"
        @click="emit('save')"
      >
        <FontAwesomeIcon :icon="faSave" />Save
      </button>
    </div>
    <div
      v-if="isFlowOpen"
      class="menu-item"
    >
      <button
        class="btn icon"
        @click="emit('close')"
      >
        <FontAwesomeIcon :icon="faClose" />Close
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { faClose, faSave, faFolder, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

interface Props {
  isFlowOpen: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'open'): void;
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

.menu-item button svg {
  font-size: 1rem;
}
</style>
