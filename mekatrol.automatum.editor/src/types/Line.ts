// A line (straight or spline) from start to finish in SVG view coordinates

import type { Offset } from '@/services/api-generated';

export type Line = {
  start: Offset;
  end: Offset;
};
