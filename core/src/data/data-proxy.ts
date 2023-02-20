import EventEmitter from 'eventemitter3';
import Node from '../node/node';
import Selection from '../selection/selection';
import Snapshot from './snapshot';
import { generateId } from '../helper';
import { Direction } from '../types';
import type { NodeData, NodeDataMap } from '../types';


interface SnapshotData {
  data: NodeDataMap;
  selectIds: string[];
}

export interface DataProxyEventMap {
  data: (data: NodeDataMap) => void;
}

export const getInitData = (data?: NodeDataMap): NodeDataMap => {
  const initData = data || {
    [generateId()]: {
      children: [],
      label: 'Central Topic',
      direction: Direction.NONE,
      isRoot: true,
    },
  }

  Object.keys(initData).forEach((id) => {
    const isExpand = initData[id].isExpand
    initData[id].isExpand = isExpand === undefined ? true : isExpand;
  });

  return initData;
}

class DataProxy {
  private readonly snapshot: Snapshot<SnapshotData>;
  private readonly selection: Selection;
  private readonly root: Node;
  private readonly eventEmitter: EventEmitter<DataProxyEventMap>;
  private data: NodeDataMap;

  public constructor({
    data,
    selection,
    root,
  }: {
    data?: NodeDataMap;
    selection: Selection;
    root: Node;
  }) {
    this.snapshot = new Snapshot<SnapshotData>();
    this.root = root;
    this.selection = selection;
    this.data = getInitData(data);
    this.eventEmitter = new EventEmitter<DataProxyEventMap>();
  }

  public canUndo = (): boolean => this.snapshot.canUndo();

  public canRedo = (): boolean => this.snapshot.canRedo();

  public undo(): SnapshotData | null {
    if (!this.snapshot.canUndo()) return null;

    const snapshotData = this.snapshot.undo({
      data: this.data,
      selectIds: this.selection.getSelectIds(),
    })!;
    this.data = snapshotData.data;

    this.eventEmitter.emit('data', this.data);

    return snapshotData;
  }

  public redo(): SnapshotData | null {
    if (!this.snapshot.canRedo()) return null;

    const snapshotData = this.snapshot.redo({
      data: this.data,
      selectIds: this.selection.getSelectIds(),
    })!;
    this.data = snapshotData.data;

    this.eventEmitter.emit('data', this.data);

    return snapshotData;
  }

  public on<T extends EventEmitter.EventNames<DataProxyEventMap>>(
    eventName: T,
    callback: EventEmitter.EventListener<DataProxyEventMap, T>
  ) {
    this.eventEmitter.on(eventName, callback);
  }

  public getData = (): NodeDataMap => this.data;

  public setData(nodeId: string, nodeData: Partial<NodeData>, selectIds?: string[]): void {
    if (!this.data[nodeId]) return;
    this.addSnapshot(selectIds);

    this.data[nodeId] = {
      ...this.data[nodeId],
      ...nodeData,
    };

    this.eventEmitter.emit('data', this.data);
  }

  public resetData(): void {
    const newData: NodeDataMap = {};
    this.resetDataInner(this.root, newData);
    this.data = newData;

    this.eventEmitter.emit('data', this.data);
  }

  public addSnapshot(selectIds?: string[]): void {
    this.snapshot.add({
      data: this.data,
      selectIds: selectIds || this.selection.getSelectIds(),
    });
  }

  private resetDataInner(node: Node, nodeDataMap: NodeDataMap): void {
    nodeDataMap[node.id] = {
      children: node.children.map((child) => child.id),
      label: node.label,
      direction: node.direction,
      isRoot: node.isRoot(),
      isExpand: node.isExpand,
    };

    if (node.imageData) {
      nodeDataMap[node.id].imageData = node.imageData;
    }

    if (node.link) {
      nodeDataMap[node.id].link = node.link;
    }

    node.children.forEach((child) => {
      this.resetDataInner(child, nodeDataMap);
    });
  }
}

export default DataProxy;
