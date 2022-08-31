import { RaphaelPaper, RaphaelAxisAlignedBoundingBox } from 'raphael';
import { createFirstNodeShape } from './shape/first-node-shape';
import { createGrandchildNodeShape } from './shape/grandchild-node-shape';
import { createRootNodeShape } from './shape/root-node-shape';
import { createFirstEdgeShape, FirstEdgeShape } from './shape/first-edge-shape';
import { createGrandchildEdgeShape, GrandchildEdgeShape } from './shape/grandchild-edge-shape';
import { NodeShape } from './shape/node-shape';
import { Direction } from './types';
import { getDepthType, DepthType } from './helper';

// todo 如何解决多态对象的类型问题？有些属性只有那个对象有
type EdgeShape = FirstEdgeShape | GrandchildEdgeShape;

// todo 如果不是root，direction等数据是一定有的。是否应该区分RootNode和普通Node？？
// readonly的属性值是public还是private好？
class Node {
  private readonly paper: RaphaelPaper;
  public readonly id: string;
  public readonly depth: number;
  public readonly direction: Direction | null;
  private readonly nodeShape: NodeShape;
  private label: string;
  private edgeShape?: EdgeShape;

  // todo 是否用null？还是undefined？
  public readonly father: Node | null = null;
  public children?: Node[];
  public constructor({
    paper,
    id,
    depth,
    label,
    direction,
    x,
    y,
    father,
  }: {
    paper: RaphaelPaper,
    id: string,
    depth: number,
    label: string,
    direction: Direction | null,
    x?: number,
    y?: number,
    father: Node | null,
  }) {
    this.paper = paper;
    this.id = id;
    this.depth = depth;
    this.direction = direction;
    this.father = father;
    this.label = label; // todo label是否要存到Node上？？

    this.nodeShape = this.createNode(x, y);
    if (x !== undefined || y !== undefined) {
      this.edgeShape = this.createEdge();
    } 
  }

  // todo ??
  public pushChild(child: Node): void {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(child);
  }

  public getChildren(): Node[] | undefined {
    return this.children;
  }

  public getBBox(): RaphaelAxisAlignedBoundingBox {
    return this.nodeShape.getBBox()!;
  }

  // todo
  public show({ x = 0, y = 0 }: { x?: number, y?: number }): void {
    this.nodeShape.show(x, y);

    this.edgeShape?.remove();
    this.edgeShape = this.createEdge();
  }

  public translate({ x = 0, y = 0 }: { x?: number, y?: number }): void {
    this.nodeShape.translate(x, y);

    this.edgeShape?.remove();
    this.edgeShape = this.createEdge();
  }

  public getDepthType(): DepthType {
    return getDepthType(this.depth);
  }

  private createNode(x?: number, y?: number): NodeShape {
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

  private createEdge(): EdgeShape | undefined {
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
        targetBBox: this.nodeShape.getBBox(),
        direction,
      })

    } else if (depthType === DepthType.grandchild) {
      return createGrandchildEdgeShape({
        paper: this.paper,
        sourceBBox: father.getBBox(),
        targetBBox: this.nodeShape.getBBox(),
        direction,
        depth: this.depth,
      })
    }
  }
}

export default Node;
