import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import { defaultTheme, type ThemeDefinition } from '@/types/theme';

export const useThemeStore = defineStore('theme', () => {
  const theme: Ref<ThemeDefinition> = ref(defaultTheme);
  return { theme };
});
