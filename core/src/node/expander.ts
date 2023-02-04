
import EventEmitter from 'eventemitter3';
import Position from '../position';
import Node from './node';
import NodeShape from '../shape/node-shape';
import ExpanderShape from '../shape/expander-shape';
import type { RaphaelPaper } from 'raphael';
import type { TraverseFunc, TraverseOptions } from './node';

export interface ExpanderEventMap {
  mousedownExpander: (newIsExpander: boolean) => void;
}

class Expander {
  private readonly paper: RaphaelPaper;
  private readonly position: Position;
  private readonly node: Node;
  private readonly nodeShape: NodeShape;
  private readonly eventEmitter: EventEmitter<ExpanderEventMap>;
  private readonly traverse: TraverseFunc;
  private expanderShape: ExpanderShape | null = null;
  private isExpand: boolean;
  public constructor({
    paper,
    position,
    node,
    nodeShape,
    isExpand,
    traverse,
  }: {
    paper: RaphaelPaper;
    position: Position;
    node: Node;
    nodeShape: NodeShape;
    isExpand: boolean;
    traverse: TraverseFunc;
  }) {
    this.paper = paper;
    this.position = position;
    this.node = node;
    this.nodeShape = nodeShape;
    this.isExpand = isExpand;
    this.traverse = traverse;
    this.eventEmitter = new EventEmitter<ExpanderEventMap>();
  }

  public getIsExpand(): boolean {
    return this.isExpand;
  }

  public changeExpand(newIsExpand: boolean, isResetPosition: boolean = true): void {
    if (this.isExpand === newIsExpand) return;

    if (this.node.children.length === 0) {
      this.remove();
      return;
    }

    this.expanderShape?.changeExpand(newIsExpand);
    this.isExpand = newIsExpand;

    if (!newIsExpand) {
      this.node.children.forEach((child) => {
        this.traverse(child, this.hideNode);
      });
    }

    isResetPosition && this.position.reset(this.node.direction);
  }

  public create(): void {
    this.createShape();
    this.translateShape();
  }

  public remove(): void {
    this.expanderShape?.remove();
    this.expanderShape = null;
    this.eventEmitter.removeAllListeners();
  }

  public on<T extends EventEmitter.EventNames<ExpanderEventMap>>(
    eventName: T,
    callback: EventEmitter.EventListener<ExpanderEventMap, T>
  ) {
    this.eventEmitter.on(eventName, callback);
  }

  public setStyle(styleType: 'disable' | 'base'): void {
    this.expanderShape?.setStyle(styleType);
  }

  private createShape(): void {
    if (
      this.node.isRoot() || this.expanderShape !== null
      || this.node.children.length === 0
      || this.nodeShape.getIsHide()
    ) return;

    this.expanderShape = new ExpanderShape({
      paper: this.paper,
      nodeBBox: this.node.getBBox(),
      isExpand: this.isExpand,
      direction: this.node.direction!,
    });
    this.expanderShape?.on('mousedown', (event: MouseEvent) => {
      event.stopPropagation();
      const newIsExpand = !this.isExpand;
      this.changeExpand(newIsExpand);

      this.eventEmitter.emit('mousedownExpander', newIsExpand);
    });
  }

  private translateShape(): void {
    this.expanderShape?.translateTo(this.node.getBBox(), this.node.direction!);
  }

  private hideNode({
    nodeShape,
    expander,
    removeEdgeShape,
  }: TraverseOptions): void {
    nodeShape.hide();
    expander.remove();
    removeEdgeShape();
  }
}

export default Expander;
