
export interface NodeData {
  children: string[];
  label: string;
  direction: number;
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
}

export default MindmapTree;
