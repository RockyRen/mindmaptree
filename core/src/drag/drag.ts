
import EventEmitter from 'eventemitter3';
import Node from '../node/node';
import NodeShape from '../shape/node-shape';
import Viewport from '../viewport';
import DragArea, { HitArea } from './drag-area';
import DragClonedNode from './drag-cloned-node';
import type { RaphaelPaper } from 'raphael';
import type { TraverseFunc } from '../node/node';
import type { StyleType } from '../shape/common/node-shape-style';

const validDiff = 2;

export interface DragEventMap {
  dragEnd: (hitArea: HitArea) => void;
}

// Drag node to change father, except root node.
class Drag {
  private readonly node: Node;
  private readonly viewport: Viewport;
  private readonly paper: RaphaelPaper;
  private readonly dragArea: DragArea;
  private readonly dragClonedNode: DragClonedNode;
  private readonly eventEmitter: EventEmitter<DragEventMap>;
  private hitFather: Node | null = null;
  private traverse: TraverseFunc;
  private isStart: boolean = false;
  private isMoveInited: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private lastDx: number = 0;
  private lastDy: number = 0;
  private styleTypeMap: Record<string, StyleType> = {};

  public constructor({
    paper,
    node,
    nodeShape,
    viewport,
    traverse,
  }: {
    paper: RaphaelPaper;
    node: Node;
    nodeShape: NodeShape;
    viewport: Viewport;
    traverse: TraverseFunc;
  }) {
    this.paper = paper;
    this.node = node;
    this.viewport = viewport;
    this.traverse = traverse;

    this.dragArea = new DragArea(this.paper, node);
    this.dragClonedNode = new DragClonedNode(nodeShape);
    this.eventEmitter = new EventEmitter<DragEventMap>();

    // init drag event
    nodeShape.on('drag', this.move, this.start, this.end);
  }

  public clear(): void {
    this.eventEmitter.removeAllListeners();
  }

  public on<T extends EventEmitter.EventNames<DragEventMap>>(
    eventName: T,
    callback: EventEmitter.EventListener<DragEventMap, T>
  ) {
    this.eventEmitter.on(eventName, callback);
  }

  private start = (clientX: number, clientY: number, event: MouseEvent): void => {
    event.stopPropagation();

    this.isStart = true;

    const viewportPosition = this.viewport.getViewportPosition(clientX, clientY);
    this.startX = viewportPosition.x;
    this.startY = viewportPosition.y;
  }

  private move = (originDx: number, originDy: number): void => {
    const scale = this.viewport.getScale();
    const dx = originDx / scale;
    const dy = originDy / scale;

    if (!this.isStart) return;

    // Start initing when move the valid distance.
    if (!this.isMoveInited && (Math.abs(originDx) > validDiff || Math.abs(originDy) > validDiff)) {
      this.dragArea.init();
      this.dragClonedNode.init();
      this.dragClonedNode.translate(this.lastDx, this.lastDy);

      this.traverse(this.node, ({ node, nodeShape, expander, edgeShape }) => {
        this.styleTypeMap[node.id] = nodeShape.getStyle();
        nodeShape.setStyle('disable');
        expander.setStyle('disable');
        edgeShape?.setStyle('disable');
      });

      document.body.style.cursor = 'grabbing';

      this.isMoveInited = true;
    }

    if (this.isMoveInited) {
      const x = this.startX + dx;
      const y = this.startY + dy;
      this.dragArea.drawTemp(x, y);

      const offsetX = (dx - this.lastDx);
      const offsetY = (dy - this.lastDy);
      this.dragClonedNode.translate(offsetX, offsetY);

      const currentHitArea = this.dragArea.getCurrentHitArea();
      if (currentHitArea?.father.id !== this.hitFather?.id) {
        currentHitArea?.father.setStyle('overlay');
        this.hitFather?.setStyle('base');
      }

      this.hitFather = currentHitArea?.father || null;
    }

    this.lastDx = dx;
    this.lastDy = dy;
  }

  // clear data when mousedown
  private end = (): void => {
    this.isStart = false;
    this.startX = 0;
    this.startY = 0;

    if (!this.isMoveInited) return;

    this.isMoveInited = false;
    this.lastDx = 0;
    this.lastDy = 0;

    this.hitFather?.setStyle('base');
    this.hitFather = null;

    const hitArea = this.dragArea.getCurrentHitArea();
    this.eventEmitter.emit('dragEnd', hitArea);

    this.dragArea.clear();
    this.dragClonedNode.clear();

    document.body.style.cursor = 'default';

    this.traverse(this.node, ({ node, nodeShape, expander, edgeShape }) => {
      const curStyleType = this.styleTypeMap[node.id];
      nodeShape.setStyle(curStyleType);
      expander.setStyle('base');
      edgeShape?.setStyle('base');
    });

    this.styleTypeMap = {};
  }

}

export default Drag;
