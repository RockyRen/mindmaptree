import Node from './node';
import { RaphaelPaper } from 'raphael';
import Position from './position';
import { translateWhenChange } from './position2';
import { Direction } from './types';
import { DepthType, getDepthType } from './helper';

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
      x: 500,
      y: 200,
    });
  }

  // todo init children
  public initNode({
    currentData,
    nodeDataList,
    depth,
    father,
    x,
    y,
    position,
  }: {
    currentData: NodeData,
    nodeDataList: NodeData[],
    depth: number,
    father: Node | null,
    x: number,
    y: number,
    position?: Position,
  }): Node {
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

    let positionIns: Position;
    if (!position) {
      const rootBBox = node.getBBox();
      positionIns = new Position({
        nodeDataList,
        rootBBox,
      });
    } else {
      positionIns = position;
    }


    // // 一开始就算出所有子节点的位置
    // const childrenPositionMap = getChildrenPosition({
    //   currentData,
    //   nodeDataList,
    //   nodeBBox: node.getBBox(),
    //   depth,
    // });

    currentData.children.forEach((childId) => {
      const childData = nodeDataList.find((nodeData) => nodeData.id === childId);
      if (childData) {
        // const {
        //   x: childX,
        //   y: childY,
        // } = childrenPositionMap[childData.id];
        const {
          x: childX,
          y: childY,
        } = positionIns.getPosition(childId);

        // const childX = 700;
        // const childY = 700;

        const childNode = this.initNode({
          currentData: childData,
          nodeDataList,
          depth: depth + 1,
          father: node,
          x: childX,
          y: childY,
          position: positionIns,
        });
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