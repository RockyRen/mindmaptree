import Node from './node';
import { RaphaelPaper } from 'raphael';
import Position from './position';
import Position2 from './position2';
import { Direction } from './types';
// import Position from './position-old2';

export interface NodeData {
  id: string;
  children: string[];
  label: string;
  direction: Direction | null;
  isRoot: boolean;
}

// 可以做tree的递归操作
// todo 承载树的特殊功能：根节点、树叶节点；增加节点、删除节点
// todo 属性是否有值的前后顺序问题：有些属性在前置处理后一定会存在的。
class Tree {
  private readonly paper: RaphaelPaper;
  private readonly root: Node;
  private selection: Node | null = null;
  public constructor(paper: RaphaelPaper, nodeDataList: NodeData[]) {
    this.paper = paper;

    const rootData = nodeDataList.find((item) => item.isRoot) || {
      id: '111',
      children: [],
      label: '中心主题',
      direction: null,
      isRoot: true,
    };

    this.root = this.initNode({
      currentData: rootData,
      nodeDataList,
      depth: 0, // todo 魔数
      father: null,
    });

    // todo
    this.root.show({
      x: 400,
      y: 200,
    });

    new Position(this.root);
  }

  public initNode({
    currentData,
    nodeDataList,
    depth,
    father,
    // position,
  }: {
    currentData: NodeData,
    nodeDataList: NodeData[],
    depth: number,
    father: Node | null,
  }): Node {
    // 初始化的时候，father可以确定已初始化，children还没被初始化
    const node = new Node({
      paper: this.paper,
      id: currentData.id,
      depth,
      label: currentData.label,
      direction: currentData.direction,
      father,
    });

    currentData.children.forEach((childId) => {
      const childData = nodeDataList.find((nodeData) => nodeData.id === childId);
      if (childData) {
        const childNode = this.initNode({
          currentData: childData,
          nodeDataList,
          depth: depth + 1,
          father: node,
        });
        node.pushChild(childNode);
      }
    });

    return node;
  }

  public addNode(): void {
    // todo for test
    this.selection = this.root.children?.[2] || null;

    const selection = this.selection;

    if (!selection) {
      return;
    }

    const newNode = new Node({
      paper: this.paper,
      id: 'xxx',
      depth: selection.depth + 1,
      label: '任务xxx',
      direction: selection.direction, // todo 根节点的direction不一样
      father: selection,
    });

    selection.pushChild(newNode);

    const newNodeBBox = newNode.getBBox();

    const position2 = new Position2();
    const newNodePosition = position2.moveAdd(selection, newNode);

    newNode.show({
      x: newNodePosition.x, 
      y: newNodePosition.y
    });
    
  }
}

export default Tree;