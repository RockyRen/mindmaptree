
import Node from './node';
import NodeShape from '../shape/node-shape';
import { createFirstNodeShape } from '../shape/first-node-shape';
import { createGrandchildNodeShape } from '../shape/grandchild-node-shape';
import { createRootNodeShape } from '../shape/root-node-shape';
import { createFirstEdgeShape, FirstEdgeShape } from '../shape/first-edge-shape';
import { createGrandchildEdgeShape, GrandchildEdgeShape } from '../shape/grandchild-edge-shape';
import { getDepthType, DepthType } from '../helper';
import { Direction } from '../types';
import type { RaphaelPaper } from 'raphael';
import type { ImageData } from '../types';

export type EdgeShape = FirstEdgeShape | GrandchildEdgeShape;

// generate Node and Edge for rendering
class ShapeGenerator {
  private readonly paper: RaphaelPaper;
  private readonly depth: number;
  private readonly label: string;
  private readonly father: Node | null = null;
  private readonly direction: Direction;
  private readonly imageData: ImageData | null = null;
  private readonly link: string = '';
  public constructor({
    paper,
    depth,
    label,
    direction,
    father,
    imageData,
    link,
  }: {
    paper: RaphaelPaper,
    depth: number,
    label: string,
    direction: Direction,
    father: Node | null,
    imageData?: ImageData | null;
    link?: string;
  }) {
    this.paper = paper;
    this.depth = depth;
    this.label = label;
    this.father = father;
    this.direction = direction;
    this.imageData = imageData || null;
    this.link = link || '';
  }

  public createNode(x?: number, y?: number): NodeShape {
    const {
      paper,
      depth,
      label,
      imageData,
      link,
    } = this;

    const nodeOptions = {
      paper,
      x,
      y,
      label,
      imageData,
      link,
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

  public createEdge(nodeShape: NodeShape): EdgeShape | null {
    const {
      father,
      direction,
      depth,
    } = this;

    if (!father || !direction) {
      return null;
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
        targetDepth: this.depth,
      })
    }

    return null;
  }
}

export default ShapeGenerator;
