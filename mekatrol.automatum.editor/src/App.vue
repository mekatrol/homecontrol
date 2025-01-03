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

  <p>
    <button @click="showDialog = true">Show the dialog</button>
  </p>
</template>

<script setup lang="ts">
import AppControl from '@/components/AppControl.vue';
import AppDialog from './components/AppDialog.vue';
import { ref } from 'vue';

const showDialog = ref(true);
</script>
