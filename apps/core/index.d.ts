export interface ImageData {
  src: string;
  width: number;
  height: number;
  gap?: number;
  toward: 'left' | 'right';
}

export interface NodeData {
  children: string[];
  label: string;
  direction: -1 | 0 | 1;
  isRoot?: boolean;
  isExpand?: boolean;
  imageData?: ImageData;
  link?: string;
}

export type NodeDataMap = Record<string, NodeData>;

export interface EventMap {
  data: (data: NodeDataMap) => void;
}

export type EventNames = keyof EventMap;

declare class MindmapTree {
  public constructor(options: {
    container: string | Element;
    data?: NodeDataMap;
    isDebug?: boolean;
    scale?: number;
  })
  public on<T extends EventNames>(eventName: T, callback: EventMap[T]): void
  public clear(): void
}

export default MindmapTree;
