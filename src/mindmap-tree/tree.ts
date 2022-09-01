import Node from './node';
import { RaphaelPaper } from 'raphael';
import Position from './position';
import Position2 from './position2';
import { Direction } from './types';
import { generateId } from './helper';

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
  private selections: Node[] = [];
  private readonly onLabelChange: (label: string) => void;
  public constructor({
    paper,
    nodeDataList,
    containerWidth,
    onLabelChange,
  }: {
    paper: RaphaelPaper;
    nodeDataList: NodeData[];
    containerWidth: number;
    onLabelChange: (label: string) => void;
  }) {
    this.paper = paper;
    this.onLabelChange = onLabelChange;

    const rootData = nodeDataList.find((item) => item.isRoot) || {
      id: generateId(),
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

    const rootBBox = this.root.getBBox();

    this.root.show({
      x: (containerWidth - rootBBox.width) / 2,
      y: 200,
    });

    new Position(this.root);
  }

  public initNode({
    currentData,
    nodeDataList,
    depth,
    father,
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
      mousedownHandler: (node) => {
        this.selectNode(node);
      },
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
    if (this.selections.length !== 1) {
      return;
    }

    const selection = this.selections[0];

    // todo 根节点先全加到右边
    const direction = selection.direction || Direction.LEFT;

    const newNode = new Node({
      paper: this.paper,
      id: generateId(),
      depth: selection.depth + 1,
      label: '子主题',
      direction, // todo 根节点的direction不一样
      father: selection,
      mousedownHandler: (node) => {
        this.selectNode(node);
      },
    });

    selection.pushChild(newNode);

    const position2 = new Position2();
    position2.moveAdd(newNode, direction);
  }

  // todo 可删除多个节点，后面再做
  // todo 删除后选择下一个节点
  public removeNode(): void {
    if (this.selections.length === 0) {
      return;
    }

    const selection = this.selections[0];

    const position2 = new Position2();
    position2.moveRemove(selection);

    selection.remove();

    this.selections = [];
  }

  public setLabel(label: string): void {
    if (this.selections.length !== 1) {
      return;
    }

    const selection = this.selections[0];

    selection.setLabel(label);
  }

  private selectNode(node: Node): void {
    this.selections.forEach((selection) => {
      selection.unSelect();
    });

    node.select();
    this.selections = [node];

    this.onLabelChange(node.label);
  }
}

export default Tree;