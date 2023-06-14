import Node from '../node/node';
import EventEmitter from 'eventemitter3';
import SelectionArrowNext from './selection-arrow-next';
import SelectionRemoveNext from './selection-remove-next';
import type { ArrowType } from './selection-arrow-next';

interface SelectionEventMap {
  'select': (nodes: Node[]) => void;
}

class Selection {
  public selectNodes: Node[] = [];
  private readonly selectionArrowNext: SelectionArrowNext;
  private readonly selectionRemoveNext: SelectionRemoveNext;
  private readonly eventEmitter: EventEmitter<SelectionEventMap>;
  private isMultiClickMode: boolean = false;
  public constructor(private root: Node) {
    this.selectionArrowNext = new SelectionArrowNext();
    this.selectionRemoveNext = new SelectionRemoveNext();
    this.eventEmitter = new EventEmitter<SelectionEventMap>();
  }

  public setIsMultiClickMode(isMultiClickMode: boolean) {
    this.isMultiClickMode = isMultiClickMode;
  }

  public select(nodes: Node[]): void {
    const clonedNodes = [...nodes];
    this.selectNodes.forEach((selection) => selection.setStyle('base'));
    clonedNodes.forEach((node) => node.setStyle('select'));
    this.selectNodes = clonedNodes;

    this.eventEmitter.emit('select', this.selectNodes);
  }

  public selectSingle(node: Node): void {
    if (!this.isMultiClickMode) {
      this.select([node]);
      return;
    }

    const targetNodeIndex = this.selectNodes.findIndex((selectNode) => selectNode.id === node.id);
    if (targetNodeIndex >= 0) {
      node.setStyle('base');
      this.selectNodes.splice(targetNodeIndex, 1);
    } else {
      node.setStyle('select');
      this.selectNodes.push(node);
    }
    this.eventEmitter.emit('select', this.selectNodes);
  }

  public selectArrowNext(arrowType: ArrowType): void {
    const lastSelectNode = this.selectNodes[this.selectNodes.length - 1];
    if (!lastSelectNode) return;

    const nextNode = this.selectionArrowNext.getArrowNextNode(lastSelectNode, arrowType);
    if (nextNode) {
      this.select([nextNode]);
    }
  }

  public empty(): void {
    this.select([]);
  }

  public on<T extends EventEmitter.EventNames<SelectionEventMap>>(
    eventName: T,
    callback: EventEmitter.EventListener<SelectionEventMap, T>
  ) {
    this.eventEmitter.on(eventName, callback);
  }

  public getSelectNodes(): Node[] {
    return this.selectNodes;
  }

  public getSingleSelectNode(): Node | null {
    if (this.selectNodes.length !== 1) {
      return null;
    }
    return this.selectNodes[0];
  }

  public getRemoveNextNode(): Node | null {
    return this.selectionRemoveNext.getRemoveNextNode(this.selectNodes);
  }

  public selectByIds(selectIds: string[]) {
    const nodeMap = this.getNodeMap();
    const selectNodes = selectIds.map((nodeId) => nodeMap[nodeId])
      .filter((node) => !!node) || [];
      
    this.select(selectNodes);
  }

  // todo 抽象
  private getNodeMap = (): Record<string, Node> => {
    const nodeMap: Record<string, Node> = {};
    this.getNodeMapInner(this.root, nodeMap);
    return nodeMap;
  }

  private getNodeMapInner = (node: Node, nodeMap: Record<string, Node>): void => {
    if (!node) return;
    nodeMap[node.id] = node;

    node.children?.forEach((child) => {
      this.getNodeMapInner(child, nodeMap) !== null;
    });
  }
}

export default Selection;
