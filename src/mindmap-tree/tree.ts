import Node from './node';
import { RaphaelPaper } from 'raphael';
import { Direction } from './types';
import { DepthType, generateId } from './helper';
import Position from './position';

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
  private readonly position: Position;
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
    this.root.translateTo((containerWidth - rootBBox.width) / 2, 200);

    this.position = new Position(this.root);
    this.position.setPosition(Direction.LEFT);
    this.position.setPosition(Direction.RIGHT);
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
    });
    node.mousedown((event: MouseEvent) => {
      this.selectNode(node, event);
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

    let direction = selection.direction;
    if (!direction) {
      const countMap = selection.children?.reduce((countMap: Record<string, number>, child) => {
        if (child.direction === Direction.LEFT) {
          countMap.left += 1;
        } else {
          countMap.right += 1;
        }
        return countMap;
      }, {
        left: 0,
        right: 0,
      })!;

      // 如果右边节点比左边多，则在左边增加
      direction = countMap.right > countMap.left ? Direction.LEFT : Direction.RIGHT;
    }

    const newNode = new Node({
      paper: this.paper,
      id: generateId(),
      depth: selection.depth + 1,
      label: '子主题',
      direction,
      father: selection,
    });

    newNode.mousedown((event: MouseEvent) => {
      this.selectNode(newNode, event);
    });

    selection.pushChild(newNode);

    this.position.setPosition(direction);
  }

  // todo 可删除多个节点，后面再做
  // todo 删除后选择下一个节点
  public removeNode(): void {
    if (this.selections.length === 0) {
      return;
    }

    const selection = this.selections[0];

    selection.remove();
    
    this.position.setPosition(selection.direction!);

    this.selections = [];
  }

  public setLabel(label: string): void {
    if (this.selections.length !== 1) {
      return;
    }

    const selection = this.selections[0];

    selection.setLabel(label);
  }

  private selectNode(node: Node, event: MouseEvent): void {
    // todo 放在drag？
    if (node.getDepthType() !== DepthType.root) {
      event.stopPropagation();
    }

    // todo 补回来
    this.selections.forEach((selection) => {
      selection.unSelect();
    });

    node.select();

    this.selections = [node];

    this.onLabelChange(node.label);
  }
}

export default Tree;