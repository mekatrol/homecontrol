import type { Offset } from './Offset';

// A line (straight or spline) from start to finish in SVG view coordinates

export type Line = {
  start: Offset;
  end: Offset;
};
