<template>
  <nav><MenuControl /></nav>
  <main>
    <div>
      <EditorControl
        v-if="activeFlow"
        :flow-id="activeFlow.id"
      />
    </div>
    <div>
      <FlowInformationControl />
    </div>
  </main>
  <BusyOverlay
    :show="appStore.isBusy"
    full-screen
  />
</template>

<script setup lang="ts">
import MenuControl from '@/components/MenuControl.vue';
import EditorControl from '@/components/EditorControl.vue';
import FlowInformationControl from '@/components/FlowInformationControl.vue';
import { BusyOverlay } from 'vue-boosted';
import { useAppStore } from '@/stores/app-store';
import { useIntervalTimer } from 'vue-boosted';
import { storeToRefs } from 'pinia';

const appStore = useAppStore();

const { activeFlow } = storeToRefs(appStore);

appStore.incrementBusy();

// TODO: This is just for development to see delay, remove when really loading from server
useIntervalTimer(async () => {
  appStore.decrementBusy();

  // Return false to stop timer, else true to continue running.
  return false;
}, 500);
</script>

<style scoped lang="scss">
main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;

  > div {
    width: 80%;
    max-width: 80%;
  }

  > div:last-child {
    max-width: 20%;
  }
}
</style>
