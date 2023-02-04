export interface NodeData {
  children: string[];
  label: string;
  direction: -1 | 0 | 1;
  isRoot?: boolean;
  isExpand?: boolean;
}

export type NodeDataMap = Record<string, NodeData>;

declare class MindmapTree {
  public constructor (options: {
    container: string | Element;
    data?: NodeDataMap;
    isDebug?: boolean;
  })
  public clear(): void
}

export default MindmapTree;
