import { useFlowStore } from '@/stores/flow-store';
import type { FlowController } from '@/services/flow-edit-controller';
import { onMounted, watch, type Ref } from 'vue';

export const useFlowController = (
  flowId: string,
  onComponentMounted?: ((controller: FlowController | undefined) => void) | undefined,
  onControllerChanged?: ((controller: FlowController | undefined) => void) | undefined
): Ref<FlowController | undefined> => {
  const flowStore = useFlowStore();

  // Try and get from flow store
  let flowControllerRef = flowStore.getFlowController(flowId);

  if (!flowControllerRef.value) {
    flowControllerRef = flowStore.addEmptyController(flowId);
  }

  onMounted(() => {
    if (!flowControllerRef.value) {
      if (onComponentMounted) {
        onComponentMounted(undefined);
      }
      return;
    }

    if (onComponentMounted) {
      onComponentMounted(flowControllerRef.value);
    }
  });

  watch(
    () => flowControllerRef.value,
    (flowController: FlowController | undefined) => {
      if (!flowController) {
        flowControllerRef.value = undefined;

        if (onControllerChanged) {
          onControllerChanged(undefined);
        }
        return;
      }

      flowControllerRef.value = flowController;

      if (onControllerChanged) {
        onControllerChanged(flowController);
      }
    }
  );

  return flowControllerRef;
};
