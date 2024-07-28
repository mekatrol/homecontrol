import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { AccessToken } from 'src/services/authService';
import { useLocalSessionJsonObject } from '@/composables/local-session';
import { useRouter } from 'vue-router';

export const TOKEN_SESSION_KEY = 'mekatrol-token';

export const useAppStore = defineStore('app', () => {
  const isBusyCount = ref(0);
  const apiBaseUrl = ref('/');
  const currentUser = ref<AccessToken | undefined>(undefined);

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

  const setUserToken = (userToken: AccessToken | undefined, rememberMe: boolean): void => {
    const persistSettings = useLocalSessionJsonObject<AccessToken>(TOKEN_SESSION_KEY);

    currentUser.value = userToken;

    if (rememberMe && !!userToken) {      
      persistSettings.setting = userToken;
    } else {
      persistSettings.remove();
    }    
  };

  return { isBusy, incrementBusy, decrementBusy, apiBaseUrl, currentUser, setUserToken };
});
