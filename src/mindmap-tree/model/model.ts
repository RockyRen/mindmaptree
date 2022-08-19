export enum Direction {
  LEFT = -1,
  RIGHT = 1,
}

export interface CommonNodeData {
  id: string;
  children: string[];
  label: string; // node文本
  // todo attr 样式对象，以后搞
}

export interface RootNodeData extends CommonNodeData {
  isRoot: true;
}

export interface NormalNodeData extends CommonNodeData {
  father: string;
  direction: Direction;
}

export type NodeData = RootNodeData | NormalNodeData;

// todo model的作用是提供数据、数据操作和一些compute数据
class Model {
  // todo
  public readonly rootNode: RootNodeData = {
    id: '111',
    children: ['222', '333'],
    label: '中心主题',
    isRoot: true,
  }
  public readonly nodes: NormalNodeData[] = [
    {
      id: '222',
      children: ['444', '555'],
      label: '任务2',
      father: '111',
      direction: Direction.RIGHT,
    },
    {
      id: '333',
      children: [],
      label: '任务3',
      father: '111',
      direction: Direction.RIGHT,
    },
    {
      id: '444',
      children: [],
      label: '任务4',
      father: '222',
      direction: Direction.RIGHT,
    },
    {
      id: '555',
      children: [],
      label: '任务5',
      father: '222',
      direction: Direction.RIGHT,
    },
  ];

  public constructor() {

  }

  public getNode(nodeId: string): NodeData | undefined {
    if (this.rootNode.id === nodeId) {
      return this.rootNode;
    }
    return this.nodes.find((node) => node.id === nodeId);
  }
  public getRootNode(): RootNodeData {
    return this.rootNode;
  }
}

export default Model;
