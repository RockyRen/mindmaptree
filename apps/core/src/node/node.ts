import Position from '../position';
import Viewport from '../viewport';
import Expander from './expander';
import Drag from '../drag/drag';
import NodeShape from '../shape/node-shape';
import ShapeGenerator from './shape-generator';
import { getDepthType, DepthType } from '../helper';
import { Direction } from '../types';
import type { ExpanderEventMap } from './expander';
import type { RaphaelPaper, RaphaelAxisAlignedBoundingBox } from 'raphael';
import type { DragEventMap } from '../drag/drag';
import type { EdgeShape } from './shape-generator';
import type { EventNames as ShapeEventNames, EventArgs as ShapeEventArgs } from '../shape/common/shape-event-emitter';
import type { StyleType } from '../shape/common/node-shape-style';
import type { ImageData } from '../types';

export interface TraverseOptions {
  node: Node;
  nodeShape: NodeShape;
  edgeShape: EdgeShape | null;
  expander: Expander;
  removeEdgeShape: () => void;
}
export type TraverseFunc = (node: Node, callback: (options: TraverseOptions) => void) => void;

export interface NodeEventMap {
  mousedown: ShapeEventArgs<'mousedown'>;
  click: ShapeEventArgs<'click'>;
  dblclick: ShapeEventArgs<'dblclick'>;
  drag: ShapeEventArgs<'drag'>;
  touchstart: ShapeEventArgs<'touchstart'>;
  mousedownExpander: [ExpanderEventMap['mousedownExpander']];
  dragEnd: [DragEventMap['dragEnd']];
};

export type NodeEventNames = keyof NodeEventMap;

export interface NodeOptions {
  paper: RaphaelPaper;
  id: string;
  depth: number;
  label: string;
  direction: Direction;
  x?: number;
  y?: number;
  father?: Node | null;
  isExpand?: boolean;
  viewport: Viewport;
  imageData?: ImageData | null;
  link?: string;
}

class Node {
  private readonly position: Position;
  private readonly shapeGenerator: ShapeGenerator;
  private readonly _id: string;
  private readonly _depth: number;
  private readonly _direction: Direction;
  private readonly _father: Node | null = null;
  private readonly nodeShape: NodeShape;
  private readonly expander: Expander;
  private readonly drag: Drag | null = null;
  private readonly _imageData: ImageData | null = null;
  private readonly _link: string = '';
  private _label: string;
  private _children: Node[];
  private edgeShape: EdgeShape | null = null;

  public constructor({
    paper,
    id,
    depth,
    label,
    direction,
    x,
    y,
    father = null,
    isExpand,
    viewport,
    imageData,
    link,
  }: NodeOptions) {
    this._id = id;
    this._depth = depth;
    this._direction = direction;
    this._father = father || null;
    this._label = label;
    this._children = [];
    this._imageData = imageData || null;
    this._link = link || '';

    this.shapeGenerator = new ShapeGenerator({
      paper,
      depth,
      label,
      direction,
      father,
      imageData,
      link,
    });

    // render node & edge
    this.nodeShape = this.shapeGenerator.createNode(x, y);
    if (x !== undefined || y !== undefined) {
      this.edgeShape = this.shapeGenerator.createEdge(this.nodeShape);
    }

    if (!this.isRoot()) {
      this.drag = new Drag({
        paper,
        node: this,
        viewport,
        nodeShape: this.nodeShape,
        traverse: this.traverse,
      });
    }

    this.position = new Position(this.getRoot());

    this.expander = new Expander({
      paper,
      position: this.position,
      node: this,
      nodeShape: this.nodeShape,
      isExpand: isExpand === undefined ? true : isExpand,
      traverse: this.traverse,
    });
  }

  public get id() { return this._id; }
  public get depth() { return this._depth; }
  public get direction() { return this._direction; }
  public get father() { return this._father; }
  public get label() { return this._label; }
  public get children() { return this._children; }
  public get isExpand() { return this.expander.getIsExpand(); }
  public get imageData() { return this._imageData; }
  public get link() { return this._link; }

  public getDirectionChildren(direction: Direction): Node[] {
    return this.children?.filter((child) => {
      return child.direction === direction;
    }) || [];
  }

  public getBBox(): RaphaelAxisAlignedBoundingBox {
    return this.nodeShape.getBBox()!;
  }

  public getLabelBBox(): RaphaelAxisAlignedBoundingBox {
    return this.nodeShape.getLabelBBox();
  }

  public getDepthType(): DepthType {
    return getDepthType(this.depth);
  }

  public getRoot(): Node | null {
    let root: Node | null = this;
    while (root && root.getDepthType() !== DepthType.root) {
      root = root.father;
    }
    return root;
  }

  public isRoot(): boolean {
    return this.getDepthType() === DepthType.root;
  }

  public on<T extends NodeEventNames>(eventName: T, ...args: NodeEventMap[T]): void {
    const shapeEventNames: NodeEventNames[] = ['mousedown', 'click', 'dblclick', 'drag', 'touchstart'];
    const expanderEventNames: NodeEventNames[] = ['mousedownExpander'];
    const dragEventNames: NodeEventNames[] = ['dragEnd'];

    if (shapeEventNames.includes(eventName)) {
      if (eventName === 'drag' && !this.isRoot()) {
        return;
      }
      this.nodeShape.on(eventName as ShapeEventNames, ...args as ShapeEventArgs<ShapeEventNames>);
    } else if (expanderEventNames.includes(eventName)) {
      this.expander.on(eventName as keyof ExpanderEventMap, ...args as [ExpanderEventMap[keyof ExpanderEventMap]]);
    } else if (dragEventNames.includes(eventName)) {
      this.drag?.on(eventName as keyof DragEventMap, ...args as [DragEventMap[keyof DragEventMap]])
    }
  }

  public clearChild(): void {
    this._children = [];
  }

  public pushChild(child: Node): void {
    this.children.push(child);
  }

  public insertAfterChild(relativeChild: Node, child: Node): void {
    const relativeIndex = this.children.findIndex((itemChild) => itemChild.id === relativeChild.id);
    if (relativeIndex > -1) {
      this.children.splice(relativeIndex + 1, 0, child);
    }
  }

  public spliceChild(start: number, deleteCount: number, direction: Direction, nodes: Node[]): void {
    if (this.isRoot()) {
      let directionStart = -1;
      let directionIndex = 0;
      let i = 0;

      for (i = 0; i < this.children.length; i++) {
        if (this.children[i].direction !== direction) {
          continue;
        }
        if (start === directionIndex) {
          directionStart = i;
          break;
        }
        directionIndex++;
      }

      if (directionStart === -1) {
        directionStart = i;
      }

      this.children.splice(directionStart, deleteCount, ...nodes);
    } else {
      this.children.splice(start, deleteCount, ...nodes);
    }
  }

  public changeExpand(isExpand: boolean, isResetPosition: boolean = true): void {
    if (isExpand === undefined) return;
    this.expander.changeExpand(isExpand, isResetPosition);
  }

  public translateTo(x: number, y: number) {
    this.nodeShape.translateTo(x, y);

    this.removeEdgeShape();
    this.edgeShape = this.shapeGenerator.createEdge(this.nodeShape);

    this.father?.expander.create();
    this.expander.create();
  }

  public remove(): void {
    if (!this.isRoot()) {
      const brothers = this.father?.children;
      if (!brothers) return;

      // Remove the relationship from father node's children
      const index = brothers?.findIndex((brother) => this.id === brother.id);
      if (index > -1) {
        brothers.splice(index, 1);
      }

      // If brothers is empty, then remove the expander of father
      if (brothers.length === 0) {
        this.father?.expander.remove();
      }
    }

    this.traverse(this, ({ node: curNode }) => {
      curNode.nodeShape.remove();
      curNode.removeEdgeShape();
      curNode.expander.remove();
      curNode.drag?.clear();
    });
  }

  public setLabel(label: string, isResetPosition: boolean = true): void {
    this._label = label;
    this.nodeShape.setLabel(label, this.direction);
    isResetPosition && this.position.reset(this.direction);
  }

  public setStyle(styleType: StyleType): void {
    this.nodeShape.setStyle(styleType);
  }

  public nodeShapeToFront(): void {
    this.nodeShape.toFront();
  }

  public isInvisible(): boolean {
    return this.nodeShape.isInvisible();
  }

  private traverse(node: Node, callback: (options: TraverseOptions) => void): void {
    callback({
      node,
      nodeShape: node.nodeShape,
      expander: node.expander,
      edgeShape: node.edgeShape,
      removeEdgeShape: node.removeEdgeShape,
    });
    node.children.forEach((child) => this.traverse(child, callback));
  }

  private removeEdgeShape = (): void => {
    this.edgeShape?.remove();
    this.edgeShape = null;
  }
}

export default Node;
