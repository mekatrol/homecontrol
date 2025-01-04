import type { Flow } from '@/services/api-generated';

export const loadFlowFromJson = (json: string): Flow => {
  const flow = JSON.parse(json) as Flow;
  return flow;
};

export const flowToJson = (flow: Flow): string => {
  const json = JSON.stringify(flow);
  return json;
};
