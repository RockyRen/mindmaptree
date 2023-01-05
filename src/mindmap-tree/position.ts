import Node from './node/node';
import { DepthType, getDepthType } from './helper';
import { Direction } from './types';
import { rectHeight as rootRectHeight } from './shape/root-node-shape';
import { rectHeight as firstLevelRectHeight } from './shape/first-node-shape';
import { rectHeight as grandchildRectHeight } from './shape/grandchild-node-shape';

const firstLevelYGap = 36;
const grandchildYGap = 25;

const firstLevelXGap = 40;
const grandchildXGap = 14;

// 获取单个节点的高度
function getNodeHeight(depth: number): number {
  const depthType = getDepthType(depth);
  if (depthType === DepthType.root) {
    return rootRectHeight;
  } else if (depthType === DepthType.firstLevel) {
    return firstLevelRectHeight;
  }
  return grandchildRectHeight;
}

export function getNodeYGap(depth: number): number {
  const depthType = getDepthType(depth);
  let gap = 0;
  if (depthType === DepthType.firstLevel) {
    gap = firstLevelYGap;
  } else {
    gap = grandchildYGap;
  }
  return gap;
}

export function getNodeXGap(depth: number): number {
  const depthType = getDepthType(depth);
  let gap = 0;
  if (depthType === DepthType.firstLevel) {
    gap = firstLevelXGap;
  } else {
    gap = grandchildXGap;
  }
  return gap;
}

// 区域高度类，一个节点的区域高度由子节点的区域高度加上间隔组成
class AreaHeight {
  private readonly areaHeightMap: Record<string, number> = {};
  public constructor() { }
  public getAreaHeight(node: Node, aDirection?: Direction) {
    const direction = aDirection || node.direction;

    if (!direction) {
      throw new Error('No direction when use getAreaHeight');
    }

    // 如果有区域高度的缓存，则直接用缓存
    const areaKey = `${node.id}_${direction}`;
    if (this.areaHeightMap[areaKey]) {
      return this.areaHeightMap[areaKey];
    }

    let areaHeight = 0;

    const children = node.getDirectionChildren(direction);

    if (children.length === 0 || children.length === 1) {
      areaHeight = getNodeHeight(node.depth);
    } else {
      const childrenAreaHeight = children.reduce((total, child) => {
        const childAreaHeight = this.getAreaHeight(child, direction);
        return total + childAreaHeight;
      }, 0);

      const childGap = getNodeYGap(node.depth + 1);

      areaHeight = childrenAreaHeight + (children.length - 1) * childGap;
    }

    this.areaHeightMap[node.id] = areaHeight;

    return areaHeight;
  }
}

// 位置类，用于递归算出节点位置
class Position {
  public constructor(
    private readonly root: Node | null
  ) {}

  // 拿到root节点，然后改变该方向所有子节点的位置
  public setPosition(direction: Direction): void {
    if (!this.root) {
      return;
    }
    const areaHeightHandler = new AreaHeight();
    this.setPositionInner(this.root, direction, areaHeightHandler);
  }

  private setPositionInner(node: Node, direction: Direction, areaHeightHandler: AreaHeight): void {
    const areaHeight = areaHeightHandler.getAreaHeight(node, direction);

    const children = node.getDirectionChildren(direction);

    const nodeBBox = node.getBBox();
    let startY = nodeBBox.cy - (areaHeight / 2);

    children.forEach((child) => {
      const childAreaHeight = areaHeightHandler.getAreaHeight(child, direction);
      const childBBox = child.getBBox();

      const xGap = getNodeXGap(child.depth);
      let childX = 0;
      if (direction === Direction.RIGHT) {
        childX = nodeBBox.cx + xGap + nodeBBox.width / 2;
      } else {
        childX = nodeBBox.cx - xGap - nodeBBox.width / 2 - childBBox.width;
      }

      const childNodeHeight = getNodeHeight(child.depth);

      const targetAreAHeight = children.length === 1 ? areaHeight : childAreaHeight;

      const childY = startY + (targetAreAHeight / 2) - (childNodeHeight / 2);

      // 选出子节点的位置后，调用Node的translateTo方法移动节点
      child.translateTo(childX, childY);

      this.setPositionInner(child, direction, areaHeightHandler);

      startY += childAreaHeight + getNodeYGap(child.depth);
    });
  }
}

export default Position;
