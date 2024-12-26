import type { Shape } from './Shape';
import type { Offset } from './Offset';
import type { Size } from './Size';

export type MarkerShape = {
  offset: Offset;
  size: Size;
  shape: Shape;
  strokeColor: string;
  fillColor: string;
};
