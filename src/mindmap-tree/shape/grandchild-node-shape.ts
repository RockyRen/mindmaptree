import { NodeShape, NodeShapeBaseOptions } from './node-shape';

const customAttr = {
  defaultLabel: {
    'font-size': 15,
  },
  defaultRect: {
    'stroke': 'none',
  },
  selected: {
    'stroke': '#ff0033',
    'stroke-width': 2.5,
  },
  unSelected: {
    'stroke': 'none',
    'stroke-width': 1,
  },
};

const paddingWidth = 10;
const rectHeight = 27;

export function createGrandchildNodeShape(options: NodeShapeBaseOptions): NodeShape {
  return new NodeShape({
    ...options,
    customAttr,
    paddingWidth,
    rectHeight,
  });
}
