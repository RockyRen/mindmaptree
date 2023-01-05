
import Node from './node';
import { RaphaelPaper } from 'raphael';
import { createFirstNodeShape } from '../shape/first-node-shape';
import { createGrandchildNodeShape } from '../shape/grandchild-node-shape';
import { createRootNodeShape } from '../shape/root-node-shape';
import { createFirstEdgeShape, FirstEdgeShape } from '../shape/first-edge-shape';
import { createGrandchildEdgeShape, GrandchildEdgeShape } from '../shape/grandchild-edge-shape';
import { NodeShape } from '../shape/node-shape';
import { getDepthType, DepthType } from '../helper';
import { Direction } from '../types';

export type EdgeShape = FirstEdgeShape | GrandchildEdgeShape;

class ShapeGenerator {
  private readonly paper: RaphaelPaper;
  private readonly depth: number;
  private readonly label: string;
  private readonly father: Node | null = null;
  private readonly direction: Direction | null;
  public constructor({
    paper,
    depth,
    label,
    direction,
    father,
  }: {
    paper: RaphaelPaper,
    depth: number,
    label: string,
    direction: Direction | null,
    father: Node | null,
  }) {
    this.paper = paper;
    this.depth = depth;
    this.label = label;
    this.father = father;
    this.direction = direction;
  }

  public createNode(x?: number, y?: number): NodeShape {
    const {
      paper,
      depth,
      label,
    } = this;

    const nodeOptions = {
      paper,
      x,
      y,
      label,
    };

    const depthType = getDepthType(depth);
    if (depthType === DepthType.root) {
      return createRootNodeShape(nodeOptions);
    } else if (depthType === DepthType.firstLevel) {
      return createFirstNodeShape(nodeOptions);
    } else {
      return createGrandchildNodeShape(nodeOptions);
    }
  }

  public createEdge(nodeShape: NodeShape): EdgeShape | undefined {
    const {
      father,
      direction,
      depth,
    } = this;

    if (!father || !direction) {
      return;
    }

    const depthType = getDepthType(depth);

    if (depthType === DepthType.firstLevel) {
      return createFirstEdgeShape({
        paper: this.paper,
        sourceBBox: father.getBBox(),
        targetBBox: nodeShape.getBBox(),
        direction,
      })

    } else if (depthType === DepthType.grandchild) {
      return createGrandchildEdgeShape({
        paper: this.paper,
        sourceBBox: father.getBBox(),
        targetBBox: nodeShape.getBBox(),
        direction,
        depth: this.depth,
      })
    }
  }
}

export default ShapeGenerator;
