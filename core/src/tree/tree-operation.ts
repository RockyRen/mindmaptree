import Position from '../position';
import DataProxy from '../data/data-proxy';
import Selection from '../selection/selection';
import Node from '../node/node';
import NodeCreator from '../node/node-creator';
import ChangeFatherOperation from './change-father-operation';
import { Direction } from '../types';
import type { ChangeFatherParams } from './change-father-operation';

class TreeOperation {
  private readonly position: Position;
  private readonly selection: Selection;
  private readonly dataProxy: DataProxy;
  private readonly nodeCreator: NodeCreator;
  private readonly changeFatherOperation: ChangeFatherOperation;
  public constructor({
    root,
    selection,
    dataProxy,
    nodeCreator,
  }: {
    root: Node;
    selection: Selection;
    dataProxy: DataProxy;
    nodeCreator: NodeCreator;
  }) {
    this.position = new Position(root);
    this.dataProxy = dataProxy;
    this.selection = selection;

    this.nodeCreator = nodeCreator;

    this.changeFatherOperation = new ChangeFatherOperation({
      position: this.position,
      selection,
      dataProxy,
      createNode: this.nodeCreator.createNode,
    });
  }

  public addChildNode(): void {
    const selectNode = this.selection.getSingleSelectNode();
    if (!selectNode) return;

    // 如果节点时根节点，则两边的节点平衡增加
    let direction = selectNode.direction;
    if (selectNode.isRoot()) {
      const directionCounts = selectNode.children?.reduce((counts: number[], child) => {
        if (child.direction === Direction.LEFT) {
          counts[0] += 1;
        } else {
          counts[1] += 1;
        }
        return counts;
      }, [0, 0]);

      // 如果右边节点比左边多，则在左边增加
      direction = directionCounts[1] > directionCounts[0] ? Direction.LEFT : Direction.RIGHT;
    }

    const newNode = this.nodeCreator.createNode({
      depth: selectNode.depth + 1,
      label: '子主题',
      direction,
      father: selectNode,
    });

    this.dataProxy.addSnapshot();

    selectNode.pushChild(newNode);
    selectNode.changeExpand(true);
    this.position.reset(direction);
    this.selection.select([newNode]);

    this.dataProxy.resetData();
  }

  public addBrotherNode(): void {
    const selectNode = this.selection.getSingleSelectNode();
    if (!selectNode) return;

    if (selectNode.isRoot()) {
      this.addChildNode();
      return;
    }

    const direction = selectNode.direction!;
    const father = selectNode.father!;

    const newNode = this.nodeCreator.createNode({
      depth: selectNode.depth,
      label: '子主题',
      direction,
      father,
    });

    this.dataProxy.addSnapshot();

    father.insertAfterChild(selectNode, newNode);
    this.position.reset(direction);
    this.selection.select([newNode]);

    this.dataProxy.resetData();
  }

  public removeNode(): void {
    const removableSelectNodes = this.selection.getTopNodes();
    if (removableSelectNodes.length === 0) return;

    const removeNextNode = this.selection.getRemoveNextNode();

    this.dataProxy.addSnapshot();

    removableSelectNodes.forEach((node) => {
      node.remove();
    });

    this.position.reset();

    // todo 暂时还没找到一个很好的多选删除节点，下一个选择节点的算法
    this.selection.select(removeNextNode !== null ? [removeNextNode] : []);

    this.dataProxy.resetData();
  }

  public changeFather = (params: ChangeFatherParams): void => {
    this.changeFatherOperation.changeFather(params);
  }
}

export default TreeOperation;
