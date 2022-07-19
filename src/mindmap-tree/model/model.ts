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

interface RootNodeData extends CommonNodeData {

}

interface NormalNodeData extends CommonNodeData {
  father: string;
  direction: Direction;
}

class Model {
  public readonly rootNode: RootNodeData = {
    id: '',
    children: [],
    label: '中心主题',
  }
  public readonly nodes: NormalNodeData[] = [];

  public constructor() {

  }
}

export default Model;
