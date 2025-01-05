import type { Flow } from '@/services/api-generated';
import { useAppStore } from '@/stores/app-store';
import { useFlowStore } from '@/stores/flow-store';
import type { FlowController } from '@/services/flow-controller';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch, type Ref } from 'vue';
import { getFlowEmitter, type FlowEventEmitter } from '@/services/event-emitter';

// Use singleton instance
const activeFlowController = ref<FlowController>();

export const useActiveFlowController = (
  onComponentMounted?: ((controller: FlowController | undefined, emitter: FlowEventEmitter | undefined) => void) | undefined,
  onControllerChanged?: ((controller: FlowController | undefined, emitter: FlowEventEmitter | undefined) => void) | undefined
): Ref<FlowController | undefined> => {
  const flowStore = useFlowStore();
  const appStore = useAppStore();
  const { activeFlow } = storeToRefs(appStore);

  onMounted(() => {
    if (!activeFlow.value) {
      if (onComponentMounted) {
        onComponentMounted(undefined, undefined);
      }
      return;
    }

    const flowController = flowStore.getFlowController(activeFlow.value.id);
    activeFlowController.value = flowController;

    const flowEmitter = getFlowEmitter(activeFlow.value.id);

    if (onComponentMounted) {
      onComponentMounted(flowController, flowEmitter);
    }
  });

  watch(
    () => activeFlow.value,
    (flow: Flow | undefined) => {
      if (!flow) {
        activeFlowController.value = undefined;

        if (onControllerChanged) {
          onControllerChanged(undefined, undefined);
        }
        return;
      }

      const flowController = flowStore.getFlowController(flow.id)!;
      activeFlowController.value = flowController;

      const flowEmitter = getFlowEmitter(flowController.flow.id);
      if (onControllerChanged) {
        onControllerChanged(flowController, flowEmitter);
      }
    }
  );

  return activeFlowController;
};
