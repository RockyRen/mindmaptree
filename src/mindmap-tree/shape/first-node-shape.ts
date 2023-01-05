import { NodeShape, NodeShapeBaseOptions } from './node-shape';

const customAttr = {
  defaultLabel: {
    'font-size': 16,
  },
  defaultRect: {
    'fill': 'white',
    'stroke': '#808080',
    'stroke-width': 1,
  },
  selected: {
    'stroke': '#ff0033',
    'stroke-width': 2.5,
  },
  unSelected: {
    'stroke': '#808080',
    'stroke-width': 1,
  },
};

const paddingWidth = 40;
export const rectHeight = 37;

export function createFirstNodeShape(options: NodeShapeBaseOptions): NodeShape {
  return new NodeShape({
    ...options,
    customAttr,
    paddingWidth,
    rectHeight,
  });
}
