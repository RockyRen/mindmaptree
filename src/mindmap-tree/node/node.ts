import { RaphaelPaper, RaphaelAxisAlignedBoundingBox } from 'raphael';
import { NodeShape, MousedownCallback } from '../shape/node-shape';
import { Direction } from '../types';
import { getDepthType, DepthType } from '../helper';
import Drag from '../drag/drag';
import type { CreateSingleNodeFunc } from '../tree';
import ShapeExports from './shape-exports';
import ShapeGenerator from './shape-generator';
import type { EdgeShape } from './shape-generator';

// 节点类
class Node {
  public readonly shapeExports: ShapeExports;

  private readonly dragHandler?: Drag;
  private readonly mousedownHandlers: MousedownCallback[] = [];
  private readonly shapeGenerator: ShapeGenerator;
  private readonly _id: string;
  private readonly _depth: number;
  private readonly _direction: Direction | null;
  private readonly _father: Node | null = null;
  private readonly _children: Node[];
  private readonly nodeShape: NodeShape;
  private _label: string;
  private edgeShape?: EdgeShape;

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
    createSingleNode: CreateSingleNodeFunc;
  }) {
    this._id = id;
    this._depth = depth;
    this._direction = direction;
    this._father = father;
    this._label = label;
    this._children = [];

    this.shapeGenerator = new ShapeGenerator({
      paper,
      depth,
      label,
      direction,
      father,
    });

    this.nodeShape = this.shapeGenerator.createNode(x, y);
    if (x !== undefined || y !== undefined) {
      this.edgeShape = this.shapeGenerator.createEdge(this.nodeShape);
    }

    this.shapeExports = new ShapeExports(this, this.nodeShape);

    if (this.getDepthType() !== DepthType.root) {
      this.dragHandler = new Drag(this, createSingleNode);
    }
  }

  public get id() { return this._id; }
  public get depth() { return this._depth; }
  public get direction() { return this._direction; }
  public get father() { return this._father; }
  public get label() { return this._label; }
  public get children() { return this._children; }

  public getDirectionChildren(direction: Direction | null): Node[] {
    return this.children?.filter((child) => child.direction === direction) || [];
  }

  public getBBox(): RaphaelAxisAlignedBoundingBox {
    return this.nodeShape.getBBox()!;
  }

  public getDepthType(): DepthType {
    return getDepthType(this.depth);
  }

  public mousedown(callback: MousedownCallback) {
    this.nodeShape.mousedown(callback);
    this.mousedownHandlers.push(callback);
  }

  public pushChild(child: Node): void {
    this.children.push(child);
  }

  public translateTo(x: number, y: number) {
    this.nodeShape.translateTo(x, y);

    this.edgeShape?.remove();
    this.edgeShape = this.shapeGenerator.createEdge(this.nodeShape);
  }

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

  public setLabel(label: string): void {
    const offset = this.nodeShape.setLabel(label) / 2;

    const depthType = this.getDepthType();
    if (depthType === DepthType.root) {
      this.children?.forEach((child) => {
        this.translateAll(child, child.direction! * offset, 0);
      });
    } else {
      const direction = this.direction!;
      this.translate(direction * offset, 0);
      this.children?.forEach((child) => {
        this.translateAll(child, direction * offset * 2, 0);
      });
    }

    this._label = label;
  }

  private removeAll(node: Node): void {
    node.nodeShape.remove();
    node.edgeShape?.remove();

    // 删除事件
    this.mousedownHandlers.forEach((handler) => this.nodeShape.unmousedown(handler));
    this.dragHandler?.unbind();

    node.children?.forEach((child) => this.removeAll(child));
  }

  // todo 和translate有什么区别？
  private translate(x: number, y: number): void {
    this.nodeShape.translate(x, y);

    this.edgeShape?.remove();
    this.edgeShape = this.shapeGenerator.createEdge(this.nodeShape);
  }

  private translateAll(node: Node, x: number, y: number) {
    node.translate(x, y);
    node.children?.forEach((child) => {
      this.translateAll(child, x, y);
    })
  }
}

export default Node;
