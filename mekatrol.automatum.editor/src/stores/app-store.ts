import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { EMPTY_GUID } from '@/constants';
import type { Flow } from '@/services/api-generated';
import { Api } from '@/services/api-generated';
import { useFlowStore } from '@/stores/flow-store';
import { wrapApiCall, type HandleErrorCallback } from '@/services/api';
import type { MessageType } from '@/services/message';
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

  const { getFlowController, addFlow, deleteFlow, isNewFlow, removeNewFlow } = useFlowStore();

  const activeFlow = ref<Flow | undefined>(undefined);

  const closeMessageOverlay = () => {
    clearMessage();
  };

  const getFlowSummaries = async (errorHandlerCallback?: HandleErrorCallback): Promise<Flow[]> => {
    return await wrapApiCall(
      'Get flows',
      async () => {
        return await api.flow.list();
      },
      errorHandlerCallback
    );
  };

  const newFlow = async (makeActive: boolean, errorHandlerCallback?: HandleErrorCallback): Promise<Flow> => {
    return await wrapApiCall(
      'Create new flow',
      async () => {
        const flow = await api.flow.get(EMPTY_GUID);
        addFlow(flow, true);

        if (makeActive) {
          activeFlow.value = flow;
        }
        return flow;
      },
      errorHandlerCallback
    );
  };

  const saveFlow = async (flow: Flow, errorHandlerCallback?: HandleErrorCallback): Promise<void> => {
    return await wrapApiCall(
      `Save flow with ID '${flow.id}'`,
      async () => {
        if (isNewFlow(flow.id)) {
          await api.flow.post(flow);

          // Remove from new flows list
          removeNewFlow(flow.id);

          return;
        }

        await api.flow.put(flow);
      },
      errorHandlerCallback
    );
  };

  const openFlow = async (id: string, errorHandlerCallback?: HandleErrorCallback): Promise<Flow> => {
    return await wrapApiCall(
      `Open flow with ID '${id}'`,
      async () => {
        const flow = await api.flow.get(id);

        if (!getFlowController(flow.id)) {
          addFlow(flow, false);
        }
        activeFlow.value = flow;
        return flow;
      },
      errorHandlerCallback
    );
  };

  const closeFlow = (id: string): void => {
    if (activeFlow.value?.id === id) {
      activeFlow.value = undefined;
    }

    deleteFlow(id);
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

  return {
    isBusy,
    messageData,
    closeMessageOverlay,
    incrementBusy,
    decrementBusy,
    activeFlow,
    saveFlow,
    newFlow,
    openFlow,
    closeFlow,
    getFlowSummaries
  };
});
