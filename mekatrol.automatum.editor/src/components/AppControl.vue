<template>
  <nav><MenuControl /></nav>
  <main>
    <div>
      <EditorControl
        v-if="activeFlowController"
        :flow-controller="activeFlowController"
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
  <MessageOverlay
    :show="!!appStore.messageData"
    :data="appStore.messageData"
    full-screen
  />
</template>

<script setup lang="ts">
import MenuControl from '@/components/MenuControl.vue';
import EditorControl from '@/components/EditorControl.vue';
import FlowInformationControl from '@/components/FlowInformationControl.vue';
import BusyOverlay from '@/components/BusyOverlay.vue';
import MessageOverlay from '@/components/MessageOverlay.vue';
import { useAppStore } from '@/stores/app-store';
import { useActiveFlowController } from '@/composables/active-flow-controller';

const appStore = useAppStore();

const activeFlowController = useActiveFlowController();
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
