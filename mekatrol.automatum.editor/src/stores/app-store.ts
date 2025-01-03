import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { BLOCK_WIDTH, PALETTE_GAP, SCROLLBAR_SIZE, EMPTY_GUID } from '@/constants';
import type { Flow } from '@/services/api-generated';
import { Api } from '@/services/api-generated';
import { useFlowStore } from '@/stores/flow-store';
import { handleApiError, type HandleErrorCallback } from '@/services/http';
import type { MessageType } from '@/types/message-type';
import { clearMessage, type MessageData } from '@/services/message';

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
  const messageData = ref<MessageData | undefined>(undefined);

  const { addFlow, isNewFlow, removeNewFlow } = useFlowStore();

  const activeFlow = ref<Flow | undefined>(undefined);

  const closeMessageOverlay = () => {
    clearMessage();
  };

  const newFlow = async (makeActive: boolean, errorHandlerCallback?: HandleErrorCallback): Promise<Flow> => {
    try {
      incrementBusy();

      const flow = await api.flow.get(EMPTY_GUID);
      addFlow(flow.id, flow, true);

      if (makeActive) {
        activeFlow.value = flow;
      }

      return flow;
    } catch (err) {
      const apiError = handleApiError(err, 'Create new flow', errorHandlerCallback, false);
      throw apiError;
    } finally {
      decrementBusy();
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

  return {
    isBusy,
    messageData,
    closeMessageOverlay,
    incrementBusy,
    decrementBusy,
    blockPaletteWidth,
    activeFlow,
    saveFlow,
    newFlow
  };
});
