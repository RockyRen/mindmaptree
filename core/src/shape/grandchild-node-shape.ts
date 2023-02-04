import NodeShape from './node-shape';
import type { NodeShapeOptions } from './node-shape';

export const fontSize = 13;
const paddingWidth = 20;
export const rectHeight = 21;

export function createGrandchildNodeShape(options: NodeShapeOptions): NodeShape {
  return new NodeShape({
    ...options,
    labelBaseAttr: {
      'font-size': fontSize,
    },
    rectBaseAttr: {
      'stroke-opacity': 0,
    },
    paddingWidth,
    rectHeight,
  });
}

