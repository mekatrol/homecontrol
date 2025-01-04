/********************************************************************************************************************
 * Parts (control point adjustment) of this code are taken from:
 * https://github.com/node-red/node-red/blob/master/packages/node_modules/%40node-red/editor-client/src/js/view.js
 ********************************************************************************************************************/

import { BlockSide, type Offset } from '@/services/api-generated';

// This algorithm assumes that start point is always the right hand side of the block
// and the end point is the left hand side of the block. That is, the start
// control point is to the right of start and the end control point is to the left of end.
export const generateCubicBezierPoints = (start: Offset, end: Offset, blockSide: BlockSide): Offset[] => {
  // Y distance between start and end points
  const dy = end.y - start.y;

  // X distance between start and end points
  const dx = end.x - start.x;

  // Straight line distance (hypotenuse) between start and end points
  const delta = Math.sqrt(dy * dy + dx * dx);

  // The connection flow direction based on input (left === -1) vs output (right === 1)
  const xFlowDirection = blockSide === BlockSide.Right ? 1 : -1;

  // Flag to indicate direction of spline mid line (the mid line between the two spline curves):
  //  * -dx, right side: Control point X is to 'right' of start X
  //  * -dx, left  side: Control point X is to 'left'  of start X
  //  * +dx, right side: Control point X is to 'right' of start X
  //  * +dx, left  side: Control point X is to 'left'  of start X
  if (dx * xFlowDirection > 0) {
    return generateSingleCubicBezierPoints(start, end, delta, xFlowDirection);
  }

  // The connection mid line flows from right to left so we need a chained bezier
  return generateChainedCubicBezierPoints(start, end, dx, dy, xFlowDirection);
};

const controlPointOffsetX = 200;

const generateSingleCubicBezierPoints = (start: Offset, end: Offset, pointDistance: number, xFlowDirection: number): Offset[] => {
  // Scale xOffset to 3/4 by default to give more rounded curve
  let xOffsetScale = 0.75;

  // If the length of the line between the two points is less than the control point x offset then adjust scale
  //
  if (pointDistance < controlPointOffsetX) {
    // Scale further when the curve is small (the line length is smaller than the control point X offset)
    const smallCurveScale = 0.5;

    xOffsetScale = smallCurveScale - smallCurveScale * ((controlPointOffsetX - pointDistance) / controlPointOffsetX);
  }

  // We need to:
  // 1. scale the offset relative on the distance between the two points
  // 2. multiple by the flow direction (+1 for left to right, -1 for right to left)
  const adjustedXOffset = controlPointOffsetX * xOffsetScale * xFlowDirection;

  const controlPoints: Offset[] = [
    // Start point
    start,

    // Control point 1
    {
      // x is start x + scaled offset the flow direction
      x: start.x + adjustedXOffset,

      // y is simple start y
      y: start.y
    },

    // Control point 2
    {
      // x is start x - scaled offset the flow direction
      x: end.x - adjustedXOffset,

      // y is simple end y
      y: end.y
    },

    // End point
    end
  ];

  return controlPoints;
};

const generateChainedCubicBezierPoints = (start: Offset, end: Offset, dx: number, dy: number, xFlowDirection: number): Offset[] => {
  // The amount to offset control point in Y direction
  const controlPointOffsetY = 50;

  // Control point height offset half the Y offset
  const controlPointHeightOffset = controlPointOffsetY / 2;

  // Flow direction top to bottom (1) or bottom to top (-1)
  const yFlowDirection = dy > 0 ? 1 : -1;

  // The mid point between the start and end points
  const mid: Offset = { x: end.x - dx / 2, y: end.y - dy / 2 };

  // If y values are almost the same then deflect the curve below the block
  if (Math.abs(dy) < 0.1) {
    mid.y = end.y + controlPointOffsetY;
  }

  // Half way Y between end Y and mid Y
  const y1 = (end.y + mid.y) / 2;

  // The half way Y reflected about the mid Y point
  const y2 = y1 - dy / 2;

  // The smaller of the dx and dy values
  const minDxDy = Math.min(Math.abs(dx), Math.abs(dy));

  // Scale xOffset to 1/3 by default to give more rounded curve
  const xOffsetScaleFactor = 0.33;

  // Spline is right to left
  const xOffsetScale = xOffsetScaleFactor - (xOffsetScaleFactor / 2) * Math.max(0, (controlPointOffsetX - minDxDy) / controlPointOffsetX);

  // We need to:
  // 1. scale the offset relative on the distance between the two points
  // 2. multiple by the flow direction (+1 for left to right, -1 for right to left)
  const adjustedXOffset = controlPointOffsetX * xOffsetScale * xFlowDirection;

  const topX = start.x + adjustedXOffset;
  const topY =
    dy > 0
      ? // Heading downward then use the minimum of the two y values
        Math.min(y2, start.y + controlPointHeightOffset)
      : // Heading upward then use the maximum of the two y values
        Math.max(y2, start.y - controlPointHeightOffset);

  const bottomX = end.x - adjustedXOffset;
  const bottomY =
    dy > 0
      ? // Heading downward then use the maximum of the two y values
        Math.max(y1, end.y - controlPointHeightOffset)
      : // Heading upward then use the minimum of the two y values
        Math.min(y1, end.y + controlPointHeightOffset);

  const x1 = (start.x + topX) / 2;

  const points: Offset[] = [
    start,
    { x: x1, y: start.y },
    { x: topX, y: dy > 0 ? Math.max(start.y, topY - controlPointHeightOffset) : Math.min(start.y, topY + controlPointHeightOffset) },
    { x: topX, y: topY },
    { x: x1, y: dy > 0 ? Math.min(mid.y, topY + controlPointHeightOffset) : Math.max(mid.y, topY - controlPointHeightOffset) },
    { x: mid.x, y: mid.y },
    { x: bottomX, y: dy > 0 ? Math.max(mid.y, bottomY - controlPointHeightOffset) : Math.min(mid.y, bottomY + controlPointHeightOffset) },
    { x: bottomX, y: bottomY },
    { x: (end.x + bottomX) / 2, y: end.y },
    end
  ];

  // Will only make turns sharper in mid distance range.
  // That is, once dy bigger that halfPointOffsetY * midDistanceScale
  // then the additional sharpness is no longer applied
  const midDistanceScale = 15;

  if (points[4].y === topY + yFlowDirection * controlPointHeightOffset) {
    if (Math.abs(dy) < controlPointHeightOffset * midDistanceScale) {
      // For large splines make spline turns sharper (to remove curve flatness)
      points[2].y = topY - (yFlowDirection * controlPointHeightOffset) / 2;
      points[6].y = bottomY - (yFlowDirection * controlPointHeightOffset) / 2;
    }

    // Move x outward to smoothen curve turns (else large curves look kinked)
    points[4].x = topX;
  }

  return points;
};
