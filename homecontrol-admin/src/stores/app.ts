import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { AccessToken, User } from 'src/services/authService';
import { useLocalSessionJsonObject } from '@/composables/local-session';

export const TOKEN_SESSION_KEY = 'mekatrol-token';

export const useAppStore = defineStore('app', () => {
  const isBusyCount = ref(0);
  const apiBaseUrl = ref('/');
  const userToken = ref<AccessToken | undefined>(undefined);
  const user = ref<User | undefined>(undefined);

  const isBusy = computed(() => isBusyCount.value > 0);

  const incrementBusy = (): void => {
    isBusyCount.value++;
  };

  const decrementBusy = (): void => {
    isBusyCount.value--;

    if (isBusyCount.value < 0) {
      isBusyCount.value = 0;
    }
  };

  const setUserToken = (token: AccessToken | undefined, rememberMe: boolean): void => {
    const persistSettings = useLocalSessionJsonObject<AccessToken>(TOKEN_SESSION_KEY);

    userToken.value = token;

    if (rememberMe && !!token) {
      persistSettings.setting = token;
    } else {
      persistSettings.remove();
    }
  };

  return { isBusy, incrementBusy, decrementBusy, apiBaseUrl, userToken, user, setUserToken };
});
