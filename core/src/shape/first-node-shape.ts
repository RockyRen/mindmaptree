import NodeShape from './node-shape';
import type { NodeShapeOptions } from './node-shape';

export const fontSize = 16;
const paddingWidth = 40;
export const rectHeight = 37;

export function createFirstNodeShape(options: NodeShapeOptions): NodeShape {
  return new NodeShape({
    ...options,
    labelBaseAttr: {
      'font-size': fontSize,
    },
    rectBaseAttr: {
      'fill': '#eee',
      'fill-opacity': 1,
      'stroke': '#808080',
      'stroke-opacity': 0, 
    },
    paddingWidth,
    rectHeight,
  });
}

