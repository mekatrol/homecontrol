import type { Flow } from '@/services/api-generated';
import { useAppStore } from '@/stores/app-store';
import { useFlowStore } from '@/stores/flow-store';
import type { FlowController } from '@/services/flow-edit-controller';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch, type Ref } from 'vue';

// Use singleton instance
const activeFlowController = ref<FlowController>();

export const useActiveFlowController = (
  onComponentMounted?: ((controller: FlowController | undefined) => void) | undefined,
  onControllerChanged?: ((controller: FlowController | undefined) => void) | undefined
): Ref<FlowController | undefined> => {
  const flowStore = useFlowStore();
  const appStore = useAppStore();
  const { activeFlow } = storeToRefs(appStore);

  onMounted(() => {
    if (!activeFlow.value) {
      if (onComponentMounted) {
        onComponentMounted(undefined);
      }
      return;
    }

    const flowController = flowStore.getFlowController(activeFlow.value.id);
    activeFlowController.value = flowController;

    if (onComponentMounted) {
      onComponentMounted(flowController);
    }
  });

  watch(
    () => activeFlow.value,
    (flow: Flow | undefined) => {
      if (!flow) {
        activeFlowController.value = undefined;

        if (onControllerChanged) {
          onControllerChanged(undefined);
        }
        return;
      }

      const flowController = flowStore.getFlowController(flow.id)!;
      activeFlowController.value = flowController;

      if (onControllerChanged) {
        onControllerChanged(flowController);
      }
    }
  );

  return activeFlowController;
};
