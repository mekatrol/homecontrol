import { defineStore } from 'pinia';
import { type Flow } from '@/services/api-generated';
import { blockTemplates } from '@/types/block-template';
import { FlowController } from '@/services/flow-edit-controller';
import { removeFlowEmitter } from '@/services/flow-event-emitter';
import { ref, type Ref } from 'vue';

export const useFlowStore = defineStore('flow', () => {
  const flowControllers: Record<string, Ref<FlowController | undefined>> = {};
  const newFlowControllers: Record<string, FlowController> = {};
  const flows = ref<Flow[]>([]);

  const addFlowController = (flow: Flow, isNew: boolean): Ref<FlowController | undefined> => {
    let flowControllerRef: Ref<FlowController | undefined>;

    if (flow.id in flowControllers) {
      flowControllerRef = flowControllers[flow.id];

      // Does a flow controller with the specified flow ID already exist?
      if (flowControllerRef.value !== undefined) {
        throw new Error(`A flow controller with the flow ID '${flow.id}' has already been added.`);
      }
    } else {
      // Else add a new empty one
      flowControllerRef = addEmptyController(flow.id);

      flows.value = [...flows.value, flow];
    }

    // Create new instance of flow controller
    const flowController = new FlowController(flow);

    // Update the value
    flowControllerRef.value = flowController;

    // If this is a new flow then we need to keep track of it being new
    // for when calling the server API for post/put
    if (isNew) {
      newFlowControllers[flow.id] = flowController;
    }

    return flowControllerRef;
  };

  const deleteFlowController = (flowId: string): void => {
    removeFlowEmitter(flowId);
    delete flowControllers[flowId];
    flows.value = flows.value.filter((f) => f.id != flowId);
  };

  const removeNewFlowController = (flowId: string): void => {
    delete newFlowControllers[flowId];
  };

  const getFlowController = (flowId: string): Ref<FlowController | undefined> => {
    if (!(flowId in flowControllers)) {
      return ref(undefined);
    }

    return flowControllers[flowId];
  };

  const addEmptyController = (flowId: string): Ref<FlowController | undefined> => {
    flowControllers[flowId] = ref(undefined);
    return flowControllers[flowId];
  };

  const isNewFlowController = (id: string): boolean => {
    return id in newFlowControllers;
  };

  return {
    flows,
    blockTemplates,
    flowControllers,
    addFlowController,
    addEmptyController,
    deleteFlowController,
    getFlowController,
    isNewFlowController,
    removeNewFlowController
  };
});
