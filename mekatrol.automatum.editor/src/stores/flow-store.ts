import { defineStore } from 'pinia';
import { toRef, type Ref } from 'vue';
import { type Flow } from '@/services/api-generated';
import { blockTemplates } from '@/types/block-template';
import { initFlowController, type FlowController } from '@/types/FlowController';

const flows: Record<string, Ref<FlowController>> = {};
const newFlows: Record<string, FlowController> = {};

export const useFlowStore = defineStore('flow', () => {
  const addFlow = (flow: Flow, isNew: boolean): Ref<FlowController> => {
    // Does a flow with the specified ID already exist?
    if (flow.id in flows) {
      throw new Error(`A flow with the ID '${flow.id}' has already been added.`);
    }

    const flowController = initFlowController(flow);

    const flowControllerRef = toRef<FlowController>(flowController);

    flows[flow.id] = flowControllerRef;

    // If this is a new flow then we need to keep track of it being new
    // for when calling the API
    if (isNew) {
      newFlows[flow.id] = flowController;
    }

    return flows[flow.id];
  };

  const deleteFlow = (id: string): void => {
    delete flows[id];
  };

  const removeNewFlow = (id: string): void => {
    delete newFlows[id];
  };

  const getFlowController = (id: string): Ref<FlowController> | undefined => {
    if (!(id in flows)) {
      return undefined;
    }

    return flows[id];
  };

  const isNewFlow = (id: string): boolean => {
    return id in newFlows;
  };

  return { blockTemplates, flows, addFlow, deleteFlow, getFlowController, isNewFlow, removeNewFlow };
});
