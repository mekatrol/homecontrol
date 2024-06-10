<template>
  <div class="date-time-container">
    <div class="time">{{ timeDisplay }}</div>
    <div class="date">{{ dateDisplay }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useIntervalTimer } from 'vue-boosted';

const timeDisplay = ref('');
const dateDisplay = ref('');

useIntervalTimer(async () => {
  const dt = new Date();

  const hrs24 = dt.getHours();
  const hrs = hrs24 >= 12 ? hrs24 - 12 : hrs24;
  const meridiem = hrs24 >= 12 ? 'PM' : 'AM';
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  timeDisplay.value = `${hrs}`.padStart(2, '0') + ':' + `${dt.getMinutes()}`.padStart(2, '0') + ' ' + meridiem;
  dateDisplay.value = daysOfWeek[dt.getDay()].toLocaleUpperCase() + ' ' + dt.getDate() + ' ' + months[dt.getMonth()].toLocaleUpperCase() + ' ' + dt.getFullYear();
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
