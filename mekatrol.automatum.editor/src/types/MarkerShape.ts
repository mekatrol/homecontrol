import type { Offset, Size } from '@/services/api-generated';
import type { Shape } from '@/types/Shape';

export type MarkerShape = {
  offset: Offset;
  size: Size;
  shape: Shape;
  strokeColor: string;
  fillColor: string;
};
