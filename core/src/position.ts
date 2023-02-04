import Node from './node/node';
import { Direction } from './types';
import { getNodeYGap, getNodeXGap } from './shape/gap';

// areaHeight is combined of all children node areaHeight
class AreaHeight {
  private readonly areaHeightMap: Record<string, number> = {};
  public constructor() { }
  public getAreaHeight(node: Node, direction: Direction) {
    const nodeHeight = node.getBBox().height;
    if (!node.isExpand) {
      return nodeHeight;
    }

    // use cache
    const areaKey = `${node.id}_${direction}`;
    if (this.areaHeightMap[areaKey]) {
      return this.areaHeightMap[areaKey];
    }

    let areaHeight = 0;

    const children = node.getDirectionChildren(direction);

    if (children.length === 0) {
      areaHeight = nodeHeight;
    } else {
      const childrenAreaHeight = children.reduce((total, child) => {
        const childAreaHeight = this.getAreaHeight(child, direction);
        return total + childAreaHeight;
      }, 0);

      const childGap = getNodeYGap(node.depth + 1);

      areaHeight = childrenAreaHeight + (children.length - 1) * childGap;

      if (areaHeight < nodeHeight) {
        return nodeHeight;
      }
    }

    this.areaHeightMap[node.id] = areaHeight;

    return areaHeight;
  }
}

// set pall nodes' position
class Position {
  private root: Node | null;
  public constructor(root?: Node | null) {
    this.root = root === undefined ? null : root;
  }

  public init(root: Node): void {
    this.root = root;
  }

  public reset(direction?: Direction): void {
    if (!this.root) {
      throw new Error('Position is called without root.');
    }

    const areaHeightHandler = new AreaHeight();
    if (direction === Direction.LEFT || direction === Direction.RIGHT) {
      this.resetInner({ node: this.root, direction, areaHeightHandler });
    } else {
      this.resetInner({ node: this.root, direction: Direction.LEFT, areaHeightHandler });
      this.resetInner({ node: this.root, direction: Direction.RIGHT, areaHeightHandler });
    }
  }

  private resetInner({
    node,
    direction,
    areaHeightHandler,
  }: {
    node: Node;
    direction: Direction;
    areaHeightHandler: AreaHeight;
    fatherAreaHeight?: number
  }): void {
    if (!node.isExpand) {
      return;
    }

    const childDepth = node.depth + 1;

    let areaHeight = areaHeightHandler.getAreaHeight(node, direction);
    const yGap = getNodeYGap(childDepth);
    const nodeBBox = node.getBBox();
    let startY = nodeBBox.cy - (areaHeight / 2);

    const children = node.getDirectionChildren(direction);

    children.forEach((child) => {
      const childAreaHeight = areaHeightHandler.getAreaHeight(child, direction);
      let targetAreaHeight = children.length === 1 ? areaHeight : childAreaHeight;

      const childBBox = child.getBBox();
      const xGap = getNodeXGap(childDepth);

      const childX = direction === Direction.RIGHT ? (nodeBBox.x2 + xGap) : (nodeBBox.x - xGap - childBBox.width);
      const childY = startY + (targetAreaHeight / 2) - (childBBox.height / 2);

      child.translateTo(childX, childY);

      this.resetInner({ node: child, direction, areaHeightHandler });

      startY += targetAreaHeight + yGap;
    });
  }
}

export default Position;

