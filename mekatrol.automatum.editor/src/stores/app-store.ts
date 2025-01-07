import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { EMPTY_GUID } from '@/constants';
import type { Flow, Point } from '@/services/api-generated';
import { useFlowStore } from '@/stores/flow-store';
import { wrapApiCall, type HandleErrorCallback } from '@/services/api';
import { clearMessage, type MessageData } from '@/services/message';
import { useApi } from '@/composables/api';
import { usePointStore } from './point-store';

// Create an Api singleton to use for calling server APIs
const api = useApi();

export const useAppStore = defineStore('app', () => {
  const isBusyCount = ref(0);
  const messageData = ref<MessageData | undefined>(undefined);

  const { getFlowController, addFlowController, deleteFlowController, isNewFlowController, removeNewFlowController } = useFlowStore();
  const { addPoint, deletePoint, isNewPoint, removeNewPoint } = usePointStore();

  const closeMessageOverlay = () => {
    clearMessage();
  };

  const getFlowSummaries = async (errorHandlerCallback?: HandleErrorCallback): Promise<Flow[]> => {
    return await wrapApiCall(
      'Get flows',
      async () => {
        return await api.flow.list();
      },
      errorHandlerCallback
    );
  };

  const getNewFlow = async (errorHandlerCallback?: HandleErrorCallback): Promise<Flow> => {
    return await wrapApiCall(
      'Create new flow',
      async () => {
        const flow = await api.flow.get(EMPTY_GUID);
        addFlowController(flow, true);
        return flow;
      },
      errorHandlerCallback
    );
  };

  const saveFlow = async (flow: Flow, errorHandlerCallback?: HandleErrorCallback): Promise<void> => {
    return await wrapApiCall(
      `Save flow with ID '${flow.id}'`,
      async () => {
        if (isNewFlowController(flow.id)) {
          await api.flow.post(flow);

          // Remove from new flows list
          removeNewFlowController(flow.id);

          return;
        }

        await api.flow.put(flow);
      },
      errorHandlerCallback
    );
  };

  const getFlow = async (flowId: string, errorHandlerCallback?: HandleErrorCallback): Promise<Flow> => {
    return await wrapApiCall(
      `Get flow with ID '${flowId}'`,
      async () => {
        const flow = await api.flow.get(flowId);

        const flowController = getFlowController(flow.id);

        if (!flowController.value) {
          addFlowController(flow, false);
        }

        return flow;
      },
      errorHandlerCallback
    );
  };

  const closeFlow = (flowId: string, removeFromStore: boolean): void => {
    if (removeFromStore) {
      deleteFlowController(flowId);
    }
  };

  const getNewPoint = async (errorHandlerCallback?: HandleErrorCallback): Promise<Point> => {
    return await wrapApiCall(
      'Create new point',
      async () => {
        const point = await api.point.get(EMPTY_GUID);
        addPoint(point, true);
        return point;
      },
      errorHandlerCallback
    );
  };

  const savePoint = async (point: Point, errorHandlerCallback?: HandleErrorCallback): Promise<void> => {
    return await wrapApiCall(
      `Save point with ID '${point.id}'`,
      async () => {
        if (isNewPoint(point.id)) {
          await api.point.post(point);

          // Remove from new flows list
          removeNewPoint(point.id);

          return;
        }

        await api.point.put(point);
      },
      errorHandlerCallback
    );
  };

  const getPoint = async (pointId: string, errorHandlerCallback?: HandleErrorCallback): Promise<Point> => {
    return await wrapApiCall(
      `Get point with ID '${pointId}'`,
      async () => {
        const point = await api.point.get(pointId);

        const flowController = getFlowController(point.id);

        if (!flowController.value) {
          addPoint(point, false);
        }

        return point;
      },
      errorHandlerCallback
    );
  };

  const closePoint = (pointId: string, removeFromStore: boolean): void => {
    if (removeFromStore) {
      deletePoint(pointId);
    }
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

  return {
    isBusy,
    messageData,
    closeMessageOverlay,
    incrementBusy,
    decrementBusy,

    // Flow related
    getFlowSummaries,
    saveFlow,
    getNewFlow,
    getFlow,
    closeFlow,

    // Point related
    savePoint,
    getNewPoint,
    getPoint,
    closePoint
  };
});
