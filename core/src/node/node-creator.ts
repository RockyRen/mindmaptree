
import { RaphaelPaper } from 'raphael';
import EventEmitter from 'eventemitter3';
import Node from '../node/node';
import Viewport from '../viewport';
import { generateId } from '../helper';
import type { NodeOptions, NodeEventMap, NodeEventNames } from '../node/node';

export interface CreateNodeParams {
  id?: NodeOptions['id'];
  depth: NodeOptions['depth'];
  label: NodeOptions['label'];
  direction: NodeOptions['direction'];
  x?: NodeOptions['x'];
  y?: NodeOptions['y'];
  father?: NodeOptions['father'];
  isExpand?: NodeOptions['isExpand'];
}

export type CreateNodeFunc = (params: CreateNodeParams) => Node;

type NodeCallbackArgs<EventNames extends NodeEventNames> = Parameters<NodeEventMap[EventNames][0]>;
type NodeCreatorCallback<EventNames extends NodeEventNames> = (
  node: Node,
  ...args: Parameters<NodeEventMap[EventNames][0]>
) => void;

interface NodeCreatorEventMap {
  mousedown: NodeCreatorCallback<'mousedown'>;
  click: NodeCreatorCallback<'click'>;
  dblclick: NodeCreatorCallback<'dblclick'>;
  mousedownExpander: NodeCreatorCallback<'mousedownExpander'>;
  dragEnd: NodeCreatorCallback<'dragEnd'>;
}

type NodeCreatorEventNames = keyof NodeCreatorEventMap;

// 只能监听单个callback的事件
const nodeCreatorEventNames: NodeCreatorEventNames[] = ['mousedown', 'click', 'dblclick', 'mousedownExpander', 'dragEnd'];

class NodeCreator {
  private readonly paper: RaphaelPaper;
  private readonly viewport: Viewport;
  private readonly eventEmitter: EventEmitter<NodeCreatorEventMap>;
  public constructor({
    paper,
    viewport,
  }: {
    paper: RaphaelPaper;
    viewport: Viewport;
  }) {
    this.paper = paper;
    this.viewport = viewport;
    this.eventEmitter = new EventEmitter<NodeCreatorEventMap>();
  }

  public createNode = ({
    id,
    depth,
    label,
    direction,
    x,
    y,
    father,
    isExpand,
  }: CreateNodeParams): Node => {
    const newNode = new Node({
      paper: this.paper,
      id: id || generateId(),
      depth,
      label,
      direction,
      x,
      y,
      father,
      isExpand,
      viewport: this.viewport,
    });

    nodeCreatorEventNames.forEach((eventName) => {
      newNode.on(eventName, (...args: NodeCallbackArgs<NodeEventNames>) => {
        // @ts-ignore
        this.eventEmitter.emit(eventName, newNode, ...args);
      });
    });

    return newNode;
  }

  public on<EventName extends NodeCreatorEventNames>(
    eventName: EventName,
    callback: NodeCreatorEventMap[EventName]
  ): void {
    // @ts-ignore
    this.eventEmitter.on(eventName, callback);
  }

  public clear(): void {
    this.eventEmitter.removeAllListeners();
  }
};

export default NodeCreator;
