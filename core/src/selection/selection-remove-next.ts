import Node from '../node/node';
import { DepthType } from '../helper';
import { Direction } from '../types';

class SelectionRemoveNext {
  public constructor() { }

  public getRemoveNextNode(selectNodes: Node[]): Node | null {
    if (selectNodes.length === 0) return null;

    for (let i = selectNodes.length - 1; i >= 0; i--) {
      const curSelectNode = selectNodes[i];
      const curTopNode = this.getTopNode(curSelectNode, selectNodes);
      if (curTopNode.isRoot()) return null;

      const brothers = curTopNode.father!.getDirectionChildren(curTopNode.direction);
      const index = brothers.findIndex((curNode) => curNode.id === curTopNode.id);

      let upIndex = index - 1;
      let upNode = brothers[upIndex];
      while (selectNodes.includes(upNode) && !!upNode) {
        upIndex -= 1;
        upNode = brothers[upIndex];
      }
      if (upNode) return upNode;

      let downIndex = index + 1;
      let downNode = brothers[downIndex];
      while (selectNodes.includes(downNode) && !!downNode) {
        downIndex += 1;
        downNode = brothers[downIndex];
      }
      if (downNode) return downNode;

      if (curTopNode.getDepthType() === DepthType.firstLevel) {
        const oppositeDirection = curTopNode.direction === Direction.RIGHT ? Direction.LEFT : Direction.RIGHT;
        const oppositeBrothers = curTopNode.father!.getDirectionChildren(oppositeDirection);
        const lastOppositeBrother = oppositeBrothers[oppositeBrothers.length - 1];
        if (lastOppositeBrother && !selectNodes.includes(lastOppositeBrother)) return lastOppositeBrother;
      }

      const curTopFatherNode = curTopNode.father!;
      if (!curTopFatherNode.isRoot()) {
        return curTopFatherNode;
      }
    }

    return null;
  }

  private getTopNode(node: Node, selectNodes: Node[]): Node {
    let topNode = node;
    let curNode: Node | null = node;

    while (curNode !== null) {
      if (selectNodes.includes(curNode)) {
        topNode = curNode;
      }
      curNode = curNode.father;
    }

    return topNode;
  }
}

export default SelectionRemoveNext;
