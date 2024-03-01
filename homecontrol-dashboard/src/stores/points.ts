import { ref } from 'vue';
import { defineStore } from 'pinia';

export interface Point {
  name: string;
  status: string;
}

export const useCounterStore = defineStore('points', () => {
  const points = ref<Point[]>([]);
  return { points };
});
