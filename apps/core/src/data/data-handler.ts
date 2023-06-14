import * as Y from 'yjs';
import EventEmitter from 'eventemitter3';
import { Direction } from '../types';
import UndoHandler from './undo-handler';
import AddHandler from './add-handler';
import RemoveHandler from './remove-handler';
import ChangeFatherHandler from './change-father-handler';
import { updateNodeDataMap } from './data-helper';
import {  generateId } from '../helper';
import type Selection from '../selection/selection';
import type { NodeData, NodeDataMap } from '../types';

export const getInitialData = (data?: NodeDataMap): NodeDataMap => {
  const initialData = data || {
    root: {
      children: [],
      label: 'Central Topic',
      direction: Direction.NONE,
      isRoot: true,
    },
  }

  Object.keys(initialData).forEach((id) => {
    const item = initialData[id]
    const isExpand = item.isExpand
    item.isExpand = isExpand === undefined ? true : isExpand;
  });

  return initialData;
}

export interface DataHandlerEventMap {
  data: (result: { data: NodeDataMap; preSelectIds: string[] }) => void;
}

class DataHandler {
  private readonly ydoc: Y.Doc;
  private readonly nodeDataMap: Y.Map<NodeData>;
  private readonly eventEmitter: EventEmitter<DataHandlerEventMap>;
  private readonly undoHandler: UndoHandler;
  private readonly addHandler: AddHandler;
  private readonly removeHandler: RemoveHandler;
  private readonly changeFatherHandler: ChangeFatherHandler;
  private preSelectIds: string[] = [];

  public constructor(
    private readonly selection: Selection,
    initialData?: Record<string, NodeData>,
    ydoc?: Y.Doc,
  ) {
    this.eventEmitter = new EventEmitter<DataHandlerEventMap>();
    this.ydoc = ydoc || new Y.Doc();

    this.nodeDataMap = this.ydoc.getMap('mindmaptree node data map');

    if (initialData) {
      Object.keys(initialData).forEach((id) => {
        const nodeData = initialData[id];
        this.nodeDataMap.set(id, nodeData);
      });
    }

    this.undoHandler = new UndoHandler(this.nodeDataMap);
    this.addHandler = new AddHandler(this.ydoc, this.nodeDataMap);
    this.removeHandler = new RemoveHandler(this.ydoc, this.nodeDataMap);
    this.changeFatherHandler = new ChangeFatherHandler(this.ydoc, this.nodeDataMap);

    this.nodeDataMap.observe((event) => {
      this.eventEmitter.emit('data', {
        data: event.target.toJSON(),
        preSelectIds: [...this.preSelectIds],
      });
      this.preSelectIds = [];
    });
  }

  public on<T extends EventEmitter.EventNames<DataHandlerEventMap>>(
    eventName: T,
    callback: EventEmitter.EventListener<DataHandlerEventMap, T>
  ): void {
    this.eventEmitter.on(eventName, callback);
  }

  public undo(): void {
    this.undoHandler.undo();
  }

  public redo(): void {
    this.undoHandler.redo();
  }

  public canUndo(): boolean {
    return this.undoHandler.canUndo();
  }

  public canRedo(): boolean {
    return this.undoHandler.canRedo();
  }

  public addChildNode(selectionId: string, depth: number): void {
    const newId = generateId();
    this.preSelectIds = [newId];
    this.addHandler.addChildNode(selectionId, depth, newId);
  }

  public addBrotherNode(selectionId: string, depth: number): void {
    const newId = generateId();
    this.preSelectIds = [newId];
    this.addHandler.addBrotherNode(selectionId, depth, newId);
  }

  public removeNode(selecNodeIds: string[]): void {
    const removeNextNode = this.selection.getRemoveNextNode();
    if (removeNextNode) {
      this.preSelectIds = [removeNextNode.id];
    }

    this.removeHandler.removeNode(selecNodeIds);
  }

  public changeFather(params: {
    selectionId: string;
    newFatherId: string;
    direction: Direction;
    childIndex?: number;
  }): void {
    this.preSelectIds = [params.selectionId];
    this.changeFatherHandler.changeFather(params);
  }

  public update(id: string, params: {
    label?: string;
    isExpand?: boolean;
  }): void {
    updateNodeDataMap(this.nodeDataMap, id, params);
  }
}

export default DataHandler;
