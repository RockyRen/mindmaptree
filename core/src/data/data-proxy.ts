import Snapshot from './snapshot';
import { generateId } from '../helper';
import { Direction } from '../types';
import Selection from '../selection/selection';
import Node from '../node/node';
import EventEmitter from 'eventemitter3';

export interface NodeData {
  children: string[];
  label: string;
  direction: Direction;
  isRoot?: boolean;
  isExpand?: boolean;
}

export type NodeDataMap = Record<string, NodeData>;

interface SnapshotData {
  data: NodeDataMap;
  selectIds: string[];
}

interface DataProxyEventMap {
  changeData: () => void;
}

export const getInitData = (data?: NodeDataMap): NodeDataMap => {
  const initData = data || {
    [generateId()]: {
      children: [],
      label: '中心主题',
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

    this.eventEmitter.emit('changeData');

    return snapshotData;
  }

  public redo(): SnapshotData | null {
    if (!this.snapshot.canRedo()) return null;

    const snapshotData = this.snapshot.redo({
      data: this.data,
      selectIds: this.selection.getSelectIds(),
    })!;
    this.data = snapshotData.data;

    this.eventEmitter.emit('changeData');

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


    console.log('set data', this.data);
  }

  // todo resetData需要先记录reset之前的root，导致调用要调用两个方法
  public resetData(): void {
    const newData: NodeDataMap = {};
    this.resetDataInner(this.root, newData);
    this.data = newData;

    console.log('reset data', this.data);
  }

  public addSnapshot(selectIds?: string[]): void {
    this.snapshot.add({
      data: this.data,
      selectIds: selectIds || this.selection.getSelectIds(),
    });
    this.eventEmitter.emit('changeData');
  }

  private resetDataInner(node: Node, nodeDataMap: NodeDataMap): void {
    nodeDataMap[node.id] = {
      children: node.children.map((child) => child.id),
      label: node.label,
      direction: node.direction,
      isRoot: node.isRoot(),
      isExpand: node.isExpand,
    };

    node.children.forEach((child) => {
      this.resetDataInner(child, nodeDataMap);
    });
  }
}

export default DataProxy;
