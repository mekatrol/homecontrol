import { computed, reactive, ref, type Ref, type WritableComputedRef } from 'vue';
import { defineStore } from 'pinia';
import { BLOCK_WIDTH, PALETTE_GAP, SCROLLBAR_SIZE, EMPTY_GUID } from '../constants';
import type { Flow } from '@/services/api-generated';
import { Api, PersistState } from '@/services/api-generated';
import { useFlowStore } from './flow-store';

const api = new Api({
  baseURL: 'https://localhost:7058'
});

export const useAppStore = defineStore('app', () => {
  const isBusyCount = ref(0);
  const { addFlow } = useFlowStore();

  const activeFlow = ref<Flow | undefined>(undefined);

  const newFlow = async (makeActive: boolean): Promise<Flow> => {
    const flow = await api.flow.get(EMPTY_GUID);
    addFlow(flow.id, flow);

    if (makeActive) {
      activeFlow.value = flow;
    }

    return flow;
  };

  const saveFlow = async (flow: Flow): Promise<void> => {
    if (flow.persistState == PersistState.New) {
      await api.flow.post(flow);
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
