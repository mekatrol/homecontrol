import { defineStore } from 'pinia';
import { type Point } from '@/services/api-generated';
import { blockTemplates } from '@/types/block-template';
import { ref, type Ref } from 'vue';

export const usePointStore = defineStore('point', () => {
  const points: Record<string, Ref<Point>> = {};
  const newPoints: Record<string, Point> = {};

  const addPoint = (point: Point, isNew: boolean): Ref<Point | undefined> => {
    if (point.id in points) {
      throw new Error(`A point with the flow ID '${point.id}' has already been added.`);
    }

    if (isNew) {
      newPoints[point.id] = point;
    }

    points[point.id] = ref(point);

    return points[point.id];
  };

  const deletePoint = (pointId: string): void => {
    delete points[pointId];
  };

  const removeNewPoint = (pointId: string): void => {
    delete newPoints[pointId];
  };

  const getPoint = (pointId: string): Ref<Point | undefined> => {
    if (!(pointId in points)) {
      return ref(undefined);
    }

    return points[pointId];
  };

  const isNewPoint = (pointId: string): boolean => {
    return pointId in newPoints;
  };

  return {
    flows: points,
    blockTemplates,
    addPoint,
    deletePoint,
    getPoint,
    isNewPoint,
    removeNewPoint
  };
});
