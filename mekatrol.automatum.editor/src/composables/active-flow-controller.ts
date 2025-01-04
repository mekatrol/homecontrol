import type { Flow } from '@/services/api-generated';
import { useAppStore } from '@/stores/app-store';
import { useFlowStore } from '@/stores/flow-store';
import type { FlowController } from '@/types/flow-controller';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch, type Ref } from 'vue';

// Use singleton instance
const activeFlowController = ref<FlowController>();

export const useActiveFlowController = (
  onComponentMounted?: (() => void) | undefined,
  onControllerChanged?: (() => void) | undefined
): Ref<FlowController | undefined> => {
  const flowStore = useFlowStore();
  const appStore = useAppStore();
  const { activeFlow } = storeToRefs(appStore);

  onMounted(() => {
    if (onComponentMounted) {
      onComponentMounted();
    }
  });

  watch(
    () => activeFlow.value,
    (flow: Flow | undefined) => {
      if (!flow) {
        activeFlowController.value = undefined;
        if (onControllerChanged) {
          onControllerChanged();
        }
        return;
      }

      const flowController = flowStore.getFlowController(flow.id);
      activeFlowController.value = flowController;
    }
  );

  return activeFlowController;
};
