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

const romanize = (num: number): string => {
  if (!+num) return '';
  let digits = String(+num).split(''),
    key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM', '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC', '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
    roman = '',
    i = 3;
  while (i--) roman = (key[+digits.pop()! + i * 10] || '') + roman;
  return Array(+digits.join('') + 1).join('M') + roman;
};

useIntervalTimer(async () => {
  const dt = new Date();
  timeDisplay.value = romanize(dt.getHours() + 1) + ' . ' + romanize(dt.getMinutes()) + ' . ' + romanize(dt.getSeconds());
  dateDisplay.value = romanize(dt.getMonth() + 1) + ' . ' + romanize(dt.getDate()) + ' . ' + romanize(dt.getFullYear()) + 1;
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
