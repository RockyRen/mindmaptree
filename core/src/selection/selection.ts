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
  public constructor() {
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

  public getSelectIds(): string[] {
    return this.selectNodes.map((node) => node.id);
  }

  public getSingleSelectNode(): Node | null {
    if (this.selectNodes.length !== 1) {
      return null;
    }
    return this.selectNodes[0];
  }

  public getTopNodes = (): Node[] => {
    if (this.selectNodes.length === 0) return [];

    const selectNodeMap = this.selectNodes.reduce<Record<string, Node>>((map, item) => {
      map[item.id] = item;
      return map;
    }, {});

    const root = this.selectNodes[0].getRoot();

    if (!root || selectNodeMap[root.id]) {
      return [];
    }

    return this.getTopNodesInner(root, selectNodeMap);
  }

  public getRemoveNextNode(): Node | null {
    return this.selectionRemoveNext.getRemoveNextNode(this.selectNodes);
  }

  private getTopNodesInner(node: Node, selectNodeMap: Record<string, Node>): Node[] {
    if (!node.isRoot() && selectNodeMap[node.id]) {
      return [node];
    }

    let removeTopNodes: Node[] = [];

    node.children && node.children.forEach((child) => {
      const childRemoveTopNodes = this.getTopNodesInner(child, selectNodeMap);
      if (childRemoveTopNodes.length > 0) {
        removeTopNodes = removeTopNodes.concat(childRemoveTopNodes);
      }
    });

    return removeTopNodes;
  }
}

export default Selection;
