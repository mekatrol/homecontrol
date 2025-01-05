import { getFlowEmitter, type FlowEventEmitter } from '@/services/event-emitter';
import type { FlowController } from '@/services/flow-controller';
import { onMounted, ref, watch, type Ref } from 'vue';

export const useFlowEmitter = (flowController: Ref<FlowController | undefined>): Ref<FlowEventEmitter | undefined> => {
  const flowEventEmitter = ref<FlowEventEmitter | undefined>(undefined);

  const setEmitter = (fc: FlowController | undefined) => {
    if (!fc) {
      flowEventEmitter.value = undefined;
      return;
    }

    const emitter = getFlowEmitter(flowController.value!.flow.id);
    flowEventEmitter.value = emitter;
  };

  onMounted(() => {
    setEmitter(flowController.value);
  });

  watch(
    () => flowController.value,
    (fc: FlowController | undefined) => {
      setEmitter(fc);
    }
  );

  return flowEventEmitter;
};
