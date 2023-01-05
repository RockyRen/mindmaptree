import { RaphaelPaper, RaphaelAxisAlignedBoundingBox, RaphaelSet } from 'raphael';
import { createFirstNodeShape } from './shape/first-node-shape';
import { createGrandchildNodeShape } from './shape/grandchild-node-shape';
import { createRootNodeShape } from './shape/root-node-shape';
import { createFirstEdgeShape, FirstEdgeShape } from './shape/first-edge-shape';
import { createGrandchildEdgeShape, GrandchildEdgeShape } from './shape/grandchild-edge-shape';
import { NodeShape, MousedownCallback, DragCallbackList } from './shape/node-shape';
import { Direction } from './types';
import { getDepthType, DepthType } from './helper';
import Drag from './drag';
import type { CreateSingleNodeFunc } from './tree';

// todo 如何解决多态对象的类型问题？有些属性只有那个对象有
type EdgeShape = FirstEdgeShape | GrandchildEdgeShape;

// todo 如果不是root，direction等数据是一定有的。是否应该区分RootNode和普通Node？？
// readonly的属性值是public还是private好？
// todo node的操作有可能影响到子节点
// todo node节点最需要拆分
class Node {
  private readonly paper: RaphaelPaper;
  public readonly id: string;
  public depth: number;
  public direction: Direction | null;
  // 这么多public真的好吗？
  public nodeShape: NodeShape;
  public label: string;
  private edgeShape?: EdgeShape;
  private mousedownHandlers: MousedownCallback[] = [];
  private readonly dragHandler?: Drag;

  // todo 是否用null？还是undefined？
  public father: Node | null = null;
  public children: Node[];
  public constructor({
    paper,
    id,
    depth,
    label,
    direction,
    x,
    y,
    father,
    createSingleNode,
  }: {
    paper: RaphaelPaper,
    id: string,
    depth: number,
    label: string,
    direction: Direction | null,
    x?: number,
    y?: number,
    father: Node | null,
    createSingleNode: CreateSingleNodeFunc; // todo
  }) {
    this.paper = paper;
    this.id = id;
    this.depth = depth;
    this.direction = direction;
    this.father = father;
    this.label = label; // todo label是否要存到Node上？？
    this.children = [];

    this.nodeShape = this.createNode(x, y);
    if (x !== undefined || y !== undefined) {
      this.edgeShape = this.createEdge();
    }


    if (this.getDepthType() !== DepthType.root) {
      this.dragHandler = new Drag(this, createSingleNode);
    }
  }

  // todo 名字
  public resetAll(depth: number, direction: Direction) {
    this.resetAllInner(this, depth, direction);
  }

  public resetAllInner(node: Node, depth: number, direction: Direction) {
    const oldDepthType = getDepthType(node.depth);
    const newDepthType = getDepthType(depth);

    node.depth = depth;
    node.direction = direction;

    if (oldDepthType !== newDepthType) {
      node.nodeShape.remove();
      node.nodeShape = this.createNode();
      node.edgeShape?.remove();
      node.edgeShape = this.createEdge();
    }

    node.children?.forEach((child) => this.resetAllInner(child, depth + 1, direction));
  }

  public setFather(newFather: Node): void {
    this.father = newFather;
  }

  public getRoot(): Node | null {
    let root: Node | null = this;

    while(root && root.getDepthType() !== DepthType.root) {
      root = root.father;
    }

    return root;
  }

  // todo 是否暴露解除绑定事件的方法
  public mousedown(callback: MousedownCallback) {
    this.nodeShape.mousedown(callback);
    this.mousedownHandlers.push(callback);
  }

  public drag(...params: DragCallbackList) {
    this.nodeShape.drag(...params);
  }

  // todo 取个好听点的名字？还有如果要插入到前面或者中间怎么办？
  public pushChild(child: Node): void {
    this.children.push(child);
  }

  public getDirectionChildren(direction: Direction | null): Node[] {
    return this.children?.filter((child) => child.direction === direction) || [];
  }

  public getBBox(): RaphaelAxisAlignedBoundingBox {
    return this.nodeShape.getBBox()!;
  }

  public translateTo(x: number, y: number) {
    this.nodeShape.translateTo(x, y);

    this.edgeShape?.remove();
    this.edgeShape = this.createEdge();
  }

  public translate(x: number, y: number): void {
    this.nodeShape.translate(x, y);

    this.edgeShape?.remove();
    this.edgeShape = this.createEdge();
  }

  // todo 带着子节点移动
  // todo 改成非对象
  public translateAll(x: number, y: number): void {

    this.translateWithChildInner(this, x, y);
  }

  // todo
  private translateWithChildInner(node: Node, x: number, y: number) {
    node.translate(x, y);

    node.children?.forEach((child) => {
      this.translateWithChildInner(child, x, y);
    })
  }


  public getDepthType(): DepthType {
    return getDepthType(this.depth);
  }

  // todo 会不会有内存泄露问题？
  public remove(): void {
    const brothers = this.father?.children;

    if (this.getDepthType() === DepthType.root || !brothers) {
      return;
    }

    // 删除关系
    const index = brothers?.findIndex((brother) => this.id === brother.id);
    brothers.splice(index, 1);

    this.removeAll(this);
  }

  // todo 递归删除
  private removeAll(node: Node): void {
    node.nodeShape.remove();
    node.edgeShape?.remove();

    // 删除事件
    this.mousedownHandlers.forEach((handler) => this.nodeShape.unmousedown(handler));
    this.dragHandler?.unbind();

    node.children?.forEach((child) => this.removeAll(child));
  }


  // todo 样式名字是不是改一改比较好？
  public cloneShape = (): RaphaelSet => this.nodeShape.clone();

  public undrag = (): void => this.nodeShape.undrag();

  public select = (): void => this.nodeShape.select();

  public unSelect = (): void => this.nodeShape.unSelect();

  public overlay = (): void => this.nodeShape.overlay();

  public unOverlay = (): void => this.nodeShape.unOverlay();

  public opacity = (): void => this.nodeShape.opacity();

  public unOpacity = (): void => this.nodeShape.unOpacity();

  public opacityAll(): void {
    const opacityInner = (node: Node): void => {
      node.opacity(); 
      node.children?.forEach((child) => opacityInner(child));
    }

    opacityInner(this);
  }

  public unOpacityAll(): void {
    const unOpacityInner = (node: Node): void => {
      node.nodeShape.unOpacity();
      node.children?.forEach((child) => unOpacityInner(child));
    }

    unOpacityInner(this);
  }

  public setLabel(label: string): void {
    const offset = this.nodeShape.setLabel(label) / 2;

    const depthType = this.getDepthType();
    if (depthType === DepthType.root) {
      this.children?.forEach((child) => {
        child.translateAll(child.direction! * offset, 0);
      });
    } else {
      const direction = this.direction!;
      this.translate(direction * offset, 0);
      this.children?.forEach((child) => {
        child.translateAll(direction * offset * 2, 0)
      });
    }

    this.label = label;
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
