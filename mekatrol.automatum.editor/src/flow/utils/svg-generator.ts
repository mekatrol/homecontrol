import type { Offset } from '../types/Offset';
import type { Size } from '../types/Size';

export const cubicBezierToSvg = (points: Offset[]): string => {
  // 4 points for single bezier and 10 points for chained bezier (4 chained)
  if (points.length != 4 && points.length != 10) {
    // Invalid point count for SVG generation
    return '';
  }

  if (points.length === 4) {
    return cubicBezierSingleToSvg(points);
  }

  return cubicBezierChainToSvg(points);
};

const cubicBezierSingleToSvg = (points: Offset[]): string => {
  // points[0] = start point
  // points[1] = control point 1
  // points[2] = control point 2
  // points[3] = end point
  return `M ${points[0].x} ${points[0].y} C ${points[1].x} ${points[1].y} ${points[2].x} ${points[2].y} ${points[3].x} ${points[3].y}`;
};

const cubicBezierChainToSvg = (points: Offset[]): string => {
  const svg =
    `M ${points[0].x} ${points[0].y} ` +
    `C ${points[1].x} ${points[1].y} ${points[2].x} ${points[2].y} ${points[3].x} ${points[3].y} ` +
    `S ${points[4].x} ${points[4].y} ${points[5].x} ${points[5].y} ` +
    `S ${points[6].x} ${points[6].y} ${points[7].x} ${points[7].y} ` +
    `S ${points[8].x} ${points[8].y} ${points[9].x} ${points[9].y}`;

  return svg;
};

export const rightPointedRect = (size: Size): string => {
  const w = size.width * 0.98;
  return `M 0 0 l ${w} 0 a ${size.height} ${size.height} 0 0 1 0 ${size.height} l ${-w} 0 z`;
};

export const leftPointedRect = (size: Size) => {
  const w = size.width * 0.98;
  return `M 0 0 l ${w} 0 l 0 ${size.height} l ${-w} 0 a ${size.height} ${size.height} 0 0 1 0 -${size.height} z`;
};
