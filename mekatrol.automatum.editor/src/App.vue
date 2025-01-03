<template>
  <AppControl />
  <AppDialog
    :show="showDialog"
    @confirm="showDialog = false"
    @cancel="showDialog = false"
  >
    <p>
      <label>
        Favourite animal:
        <select>
          <option value="default">Choose…</option>
          <option>Brine shrimp</option>
          <option>Red panda</option>
          <option>Spider monkey</option>
        </select>
      </label>
    </p>
  </AppDialog>
  <AppDialog
    :show="showDialog1"
    @confirm="showDialog1 = false"
    @cancel="showDialog1 = false"
  >
    <p>Second dialog</p>
  </AppDialog>

  <p>
    <button @click="showDialog = true">Show the dialog</button>
  </p>
  <p>
    <button @click="showDialog1 = true">Show the dialog 1</button>
  </p>
</template>

<script setup lang="ts">
import AppControl from '@/components/AppControl.vue';
import AppDialog from './components/AppDialog.vue';
import { ref } from 'vue';

const showDialog = ref(false);
const showDialog1 = ref(false);
</script>
