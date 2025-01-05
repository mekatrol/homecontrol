import { defineStore } from 'pinia';
import { type Flow } from '@/services/api-generated';
import { blockTemplates } from '@/types/block-template';
import { FlowController } from '@/services/flow-edit-controller';
import { removeFlowEmitter } from '@/services/flow-event-emitter';

const flowControllers: Record<string, FlowController> = {};
const newFlowControllers: Record<string, FlowController> = {};

export const useFlowStore = defineStore('flow', () => {
  const addFlow = (flow: Flow, isNew: boolean): FlowController => {
    // Does a flow with the specified ID already exist?
    if (flow.id in flowControllers) {
      throw new Error(`A flow with the ID '${flow.id}' has already been added.`);
    }

    // Create new instance of flow controller
    const flowController = new FlowController(flow);

    // Add to flow controller dictionary
    flowControllers[flow.id] = flowController;

    // If this is a new flow then we need to keep track of it being new
    // for when calling the server API for post/put
    if (isNew) {
      newFlowControllers[flow.id] = flowController;
    }

    return flowControllers[flow.id];
  };

  const deleteFlow = (id: string): void => {
    removeFlowEmitter(id);
    delete flowControllers[id];
  };

  const removeNewFlow = (id: string): void => {
    delete newFlowControllers[id];
  };

  const getFlowController = (id: string): FlowController | undefined => {
    if (!(id in flowControllers)) {
      return undefined;
    }

    return flowControllers[id];
  };

  const isNewFlow = (id: string): boolean => {
    return id in newFlowControllers;
  };

  return { blockTemplates, flows: flowControllers, addFlow, deleteFlow, getFlowController, isNewFlow, removeNewFlow };
});
