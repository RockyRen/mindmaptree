import { NodeShape, NodeShapeBaseOptions } from './node-shape';

const customAttr = {
  defaultLabel: {
    'font-size': 25,
    'fill': 'white',
  },
  defaultRect: {
    'fill': '#428bca',
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


const paddingWidth = 42;
const rectHeight = 52;

export function createRootNodeShape(options: NodeShapeBaseOptions): NodeShape {
  return new NodeShape({
    ...options,
    customAttr,
    paddingWidth,
    rectHeight,
  });
}
