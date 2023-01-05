import Node from './node';
import { RaphaelPaper } from 'raphael';
import { Direction, NodeData } from './types';
import { DepthType, generateId, getDepthType } from './helper';
import Position from './position';

export interface CreateSingleNodeOptions {
  id?: string;
  depth: number;
  label: string;
  direction: Direction | null;
  father: Node | null;
}

export interface CreateSingleNodeFunc {
  (options: CreateSingleNodeOptions): Node;
}

// 思维导图树类，操作节点之间的关系
class Tree {
  private readonly paper: RaphaelPaper;
  private readonly root: Node;
  private readonly position: Position;
  private readonly onLabelChange: (label: string) => void;

  private selections: Node[] = [];
  public constructor({
    paper,
    data,
    containerWidth,
    onLabelChange,
  }: {
    paper: RaphaelPaper;
    data?: NodeData[];
    containerWidth: number;
    onLabelChange: (label: string) => void;
  }) {
    this.paper = paper;
    this.onLabelChange = onLabelChange;

    const nodeDataList = data || [];

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
      depth: 0,
      father: null,
    });

    // 初始化根节点的位置
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
    const node = this.createSingleNode({
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
    if (this.selections.length !== 1) {
      return;
    }

    const selection = this.selections[0];

    // 如果节点时根节点，则两边的节点平衡增加
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

    const newNode = this.createSingleNode({
      depth: selection.depth + 1,
      label: '子主题',
      direction,
      father: selection,
    });

    selection.pushChild(newNode);
    this.position.setPosition(direction);
  }

  // todo 可删除多个节点，后面再做
  // todo 删除后选择下一个节点
  public removeNode(): void {
    if (this.selections.length === 0) return;

    const selection = this.selections[0];
    selection.remove();

    this.position.setPosition(selection.direction!);
    this.selections = [];
  }

  public setLabel(label: string): void {
    if (this.selections.length !== 1) return;
    const selection = this.selections[0];
    selection.setLabel(label);
  }

  // todo 
  public getData() {

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

  // 创建新的node应该使用这个方法
  private createSingleNode({
    id,
    depth,
    label,
    direction,
    father,
  }: CreateSingleNodeOptions): Node {
    const newNode = new Node({
      paper: this.paper,
      id: id || generateId(),
      depth,
      label,
      direction,
      father,
      createSingleNode: this.createSingleNode.bind(this),
    });

    newNode.mousedown((event: MouseEvent) => {
      this.selectNode(newNode, event);
    });

    return newNode;
  }

}

export default Tree;