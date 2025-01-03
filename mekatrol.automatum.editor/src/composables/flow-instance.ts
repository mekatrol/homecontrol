import { useFlowStore } from '@/stores/flow-store';
import type { FlowController } from '@/types/FlowController';
import { type Ref } from 'vue';

export const useFlowController = (id: string): Ref<FlowController> => {
  const { getFlowController } = useFlowStore();

  const flowInstance = getFlowController(id);

  if (!flowInstance) {
    throw new Error(`Unable to get flow controller for flow with ID: '${id}'`);
  }

  return flowInstance;
};
