import Node from './node';
import { RaphaelPaper } from 'raphael';
import { getChildrenPosition } from './position';
import { translateWhenChange } from './position2';
import { Direction } from './types';

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

    this.root = this.initNode(rootData, nodeDataList, 1, null, 500, 200);

    // todo for test
    // this.selection = this.root;
  }

  // todo depth的1、2、3等需要有个公共方法获取，不要用魔数
  public initNode(
    currentData: NodeData,
    nodeDataList: NodeData[],
    depth: number,
    father: Node | null,
    x: number,
    y: number,
  ): Node {
    // 初始化的时候，father可以确定已初始化，children还没被初始化
    const node = new Node({
      paper: this.paper,
      id: currentData.id,
      depth,
      label: currentData.label,
      direction: currentData.direction,
      x,
      y,
      father,
    });

    // 一开始就算出所有子节点的位置
    const childrenPositionMap = getChildrenPosition(currentData, nodeDataList, node.getBBox(), depth);

    currentData.children.forEach((childId) => {
      const childData = nodeDataList.find((nodeData) => nodeData.id === childId);
      if (childData) {
        const {
          x: childX,
          y: childY,
        } = childrenPositionMap[childData.id];
        const childNode = this.initNode(childData, nodeDataList, depth + 1, node, childX, childY);
        node.pushChild(childNode);
      }
    });

    return node;
  }

  public addNode(): void {
    // todo for test
    this.selection = this.root.children?.[0] || null;
    
    const selection = this.selection;

    if (!selection) {
      return;
    }

    selection.translate({
      x: 100,
      // y: -100,
    });
    
    // translateWhenChange(selection);

    // // 初始化Node
    // const newNode = new Node({
    //   paper: this.paper,
    //   id: '666', // todo 自动生成id
    //   depth: selection.depth + 1,
    //   label: '任务xxx', // todo 自动生成文本
    //   direction: selection.direction,
    //   x: 800,
    //   y: 500,
    //   father: selection,
    // });
  }
}

export default Tree;