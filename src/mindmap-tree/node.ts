import { RaphaelPaper, RaphaelAxisAlignedBoundingBox } from 'raphael';
import { createFirstNodeShape } from './shape/first-node-shape';
import { createGrandchildNodeShape } from './shape/grandchild-node-shape';
import { createRootNodeShape } from './shape/root-node-shape';
import { createFirstEdgeShape, FirstEdgeShape } from './shape/first-edge-shape';
import { createGrandchildEdgeShape, GrandchildEdgeShape } from './shape/grandchild-edge-shape';
import { NodeShape } from './shape/node-shape';
import { Direction } from './types';

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
  private readonly edgeShape?: EdgeShape;

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
    x: number,
    y: number,
    father: Node | null,
  }) {
    this.paper = paper;
    this.id = id;
    this.depth = depth;
    this.direction = direction;
    this.father = father;

    // todo render
    if (this.depth === 1) {
      this.nodeShape = createRootNodeShape({
        paper: this.paper,
        x,
        y,
        label: label,
      });
    } else if (this.depth === 2) {
      this.nodeShape = createFirstNodeShape({
        paper: this.paper,
        x, // todo x只受父节点的x影响
        y, // todo y受兄弟节点的y和子节点的areaHeight影响
        label: label,
      });

      if (father) {
        this.edgeShape = createFirstEdgeShape({
          paper: this.paper,
          sourceBBox: father.getBBox(),
          targetBBox: this.nodeShape.getBBox(),
          // todo
          direction: direction!,
        })
      }

    } else {
      this.nodeShape = createGrandchildNodeShape({
        paper: this.paper,
        x,
        y,
        label: label,
      });

      if (father) {
        this.edgeShape = createGrandchildEdgeShape({
          paper: this.paper,
          sourceBBox: father.getBBox(),
          targetBBox: this.nodeShape.getBBox(),
          // todo
          direction: direction!,
          depth: this.depth,
        })
      }
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
}

export default Node;
