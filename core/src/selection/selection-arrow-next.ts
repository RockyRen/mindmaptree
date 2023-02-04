import Node from '../node/node';
import { Direction } from '../types';

export type ArrowType = 'ArrowUp' | 'ArrowRight' | 'ArrowDown' | 'ArrowLeft';

class SelectionNext {
  public constructor() { }

  public getArrowNextNode(node: Node, arrowType: ArrowType): Node | null {
    let nextNode: Node | null = null;

    switch (arrowType) {
      case 'ArrowUp': {
        nextNode = this.getVeriticalNext(node, true);
        break;
      }
      case 'ArrowRight': {
        nextNode = this.getHorizontal(node, Direction.RIGHT);
        break;
      }
      case 'ArrowDown': {
        nextNode = this.getVeriticalNext(node, false);
        break;
      }
      case 'ArrowLeft': {
        nextNode = this.getHorizontal(node, Direction.LEFT);
        break;
      }
      default: {
        break;
      }
    }

    return nextNode;
  }

  private getHorizontal(node: Node, targetDirection: Direction.RIGHT | Direction.LEFT): Node | null {
    const isToFather = (node.direction !== Direction.NONE) && (node.direction !== targetDirection)

    if (isToFather) {
      return node.father;
    }

    const children = node.getDirectionChildren(targetDirection);
    const middleIndex = Math.floor((children.length - 1) / 2);
    const middleChild = children[middleIndex] || null;

    return middleChild;
  }

  private getVeriticalNext(node: Node, isUp: boolean): Node | null {
    if (node.isRoot()) {
      const rightChildren = node.getDirectionChildren(Direction.RIGHT);
      const leftChildren = node.getDirectionChildren(Direction.LEFT);

      const children = rightChildren.length > 0 ? rightChildren : leftChildren;

      const firstChild = children[0] || null;
      const lastChild = children[children.length - 1] || null;

      return isUp ? firstChild : lastChild;
    }

    let targetDepth = 0;
    let curNode: Node | null = node;
    let nextNode: Node | null = null;

    while (curNode !== null && !curNode?.isRoot()) {
      const nextBrothers = this.getNextBrothers(curNode, isUp);

      for (let i = 0; i < nextBrothers.length; i++) {
        const curNextNode = this.findTargetDepthNode(nextBrothers[i], targetDepth, 0, isUp);
        if (curNextNode) {
          nextNode = curNextNode;
          break;
        }
      }

      if (nextNode) {
        break;
      }

      curNode = curNode?.father;
      targetDepth += 1;
    }

    return nextNode;
  }

  private findTargetDepthNode(node: Node, targetDepth: number, curDepth: number, isUp: boolean): Node | null {
    if (targetDepth === curDepth) {
      return node;
    }

    let targetNode: Node | null = null;

    let children = node.getDirectionChildren(node.direction);
    if (isUp) {
      children = children.reverse();
    }

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const curTargetNode = this.findTargetDepthNode(child, targetDepth, curDepth + 1, isUp);
      if (curTargetNode) {
        targetNode = curTargetNode;
        break;
      }
    }

    return targetNode;
  }

  private getNextBrothers(node: Node, isUp: boolean): Node[] {
    const nextBrothers: Node[] = [];
    let brothers = node?.father?.getDirectionChildren(node.direction) || [];
    if (isUp) {
      brothers = brothers.reverse();
    }

    let isFound = false;
    for (let i = 0; i < brothers.length; i++) {
      if (isFound) {
        nextBrothers.push(brothers[i]);
      }
      if (brothers[i].id === node.id) {
        isFound = true;
      }
    }

    return nextBrothers;
  }
}

export default SelectionNext;
