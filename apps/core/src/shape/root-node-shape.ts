import NodeShape from './node-shape';
import type { NodeShapeOptions } from './node-shape';

export const fontSize = 25;
const paddingWidth = 42;
export const rectHeight = 52;

export function createRootNodeShape(options: NodeShapeOptions): NodeShape {
  return new NodeShape({
    ...options,
    labelBaseAttr: {
      'font-size': fontSize,
      'fill': '#fff',
      'fill-opacity': 1,
    },
    rectBaseAttr: {
      'fill': '#3F89DE',
      'fill-opacity': 1,
      'stroke-opacity': 0, 
    },
    paddingWidth,
    rectHeight,
  });
}
