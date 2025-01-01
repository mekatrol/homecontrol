import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { BLOCK_WIDTH, PALETTE_GAP, SCROLLBAR_SIZE, EMPTY_GUID } from '@/constants';
import type { Flow } from '@/services/api-generated';
import { Api } from '@/services/api-generated';
import { useFlowStore } from '@/stores/flow-store';
import { handleApiResponseError } from '@/services/http';

// The server API base URL is embedded in a hidden field in the page
// it is set by the server on page load
const serverBaseUrlElement = document.getElementById('server-base-url') as HTMLInputElement;
var serverBaseUrl = serverBaseUrlElement?.value ?? '/api';

// Create an Api singleton to use for calling server APIs
const api = new Api({
  baseURL: serverBaseUrl
});

export const useAppStore = defineStore('app', () => {
  const isBusyCount = ref(0);
  const { addFlow, isNewFlow, removeNewFlow } = useFlowStore();

  const activeFlow = ref<Flow | undefined>(undefined);

  const newFlow = async (makeActive: boolean): Promise<Flow> => {
    try {
      const flow = await api.flow.get(EMPTY_GUID);
      addFlow(flow.id, flow, true);

      if (makeActive) {
        activeFlow.value = flow;
      }

      return flow;
    } catch (e) {
      const apiError = handleApiResponseError(e, '');
      console.log(apiError);

      throw e;
    }
  };

  const saveFlow = async (flow: Flow): Promise<void> => {
    if (isNewFlow(flow.id)) {
      await api.flow.post(flow);

      // Remove from new flows list
      removeNewFlow(flow.id);

      return;
    }

    await api.flow.put(flow);
  };

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

  const blockPaletteWidth = computed(() => {
    return BLOCK_WIDTH + 2 * PALETTE_GAP + SCROLLBAR_SIZE;
  });

  return { isBusy, incrementBusy, decrementBusy, blockPaletteWidth, activeFlow, saveFlow, newFlow };
});
