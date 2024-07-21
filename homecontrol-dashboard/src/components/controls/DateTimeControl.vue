<template>
  <div class="date-time-container">
    <div class="time">{{ timeDisplay }}</div>
    <div class="date">{{ dateDisplay }}</div>
  </div>
</template>

<script setup lang="ts">
import { getShortDateWithDay, getTimeWithMeridiem } from '@/utils/date-helper';
import { ref } from 'vue';
import { useIntervalTimer } from 'vue-boosted';

const timeDisplay = ref('');
const dateDisplay = ref('');

useIntervalTimer(async () => {
  const dt = new Date();

  timeDisplay.value = getTimeWithMeridiem(dt);
  dateDisplay.value = getShortDateWithDay(dt);
  return true;
}, 500);
</script>

<style scoped lang="css">
.date-time-container {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  padding: 1rem;
  align-items: center;

  > .time {
    font-size: 3rem;
    color: #74e906;
  }

  > .date {
    font-size: 1.5rem;
    color: #c4f3cb;
  }
}
</style>
