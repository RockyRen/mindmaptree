import { DepthType, getDepthType } from './helper';
import Node from './node';
import { Direction } from './types';

// todo 放到同一个地方
const rootNodeHeight = 52;
const firstLevelNodeHeight = 37;
const grandchildNodeHeight = 27;

// todo
function getNodeHeight(depth: number): number {
  const depthType = getDepthType(depth);
  if (depthType === DepthType.root) {
    return rootNodeHeight;
  } else if (depthType === DepthType.firstLevel) {
    return firstLevelNodeHeight;
  }
  return grandchildNodeHeight;
}

// todo
export function getNodeYGap(depth: number): number {
  const depthType = getDepthType(depth);
  let gap = 0;
  if (depthType === DepthType.firstLevel) {
    gap = 36;
  } else {
    gap = 25;
  }
  return gap;
}

export function getNodeXGap(depth: number): number {
  const depthType = getDepthType(depth);
  let gap = 0;
  if (depthType === DepthType.firstLevel) {
    gap = 40;
  } else {
    gap = 14;
  }
  return gap;
}


export class AreaHeight {
  private readonly areaHeightMap: Record<string, number> = {};
  public constructor() { }
  public getAreaHeight(node: Node, aDirection?: Direction) {
    const direction = aDirection || node.direction;

    if (!direction) {
      throw new Error('No direction when use getAreaHeight');
    }

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


// todo 重构
class Position {
  private readonly areaHeightHandler: AreaHeight;
  public constructor(node: Node) {
    this.areaHeightHandler = new AreaHeight();
    this.initPosition(node, Direction.LEFT);
    this.initPosition(node, Direction.RIGHT);
  }

  private initPosition(node: Node, direction: Direction): void {
    const areaHeight = this.areaHeightHandler.getAreaHeight(node, direction);

    const children = node.getDirectionChildren(direction);

    let nodeBBox = node.getBBox();
    let startY = nodeBBox.cy - (areaHeight / 2);

    children.forEach((child) => {
      const childAreaHeight = this.areaHeightHandler.getAreaHeight(child, direction);
      const childBBox = child.getBBox();

      const xGap = getNodeXGap(child.depth);
      let childX = 0;
      if (direction === Direction.RIGHT) {
        childX = nodeBBox.cx + xGap + nodeBBox.width / 2;
      } else {
        childX = nodeBBox.cx - xGap - nodeBBox.width / 2 - childBBox.width;
      }

      const childNodeHeight = getNodeHeight(child.depth);

      // todo ???
      // todo 如果children只有1个就不能用这种startY的计算方式，能不能改下？
      const useAreaHeight = children.length === 1 ? areaHeight : childAreaHeight;

      const childY = startY + (useAreaHeight / 2) - (childNodeHeight / 2);

      child.show({
        x: childX,
        y: childY,
      });

      this.initPosition(child, direction);

      startY += childAreaHeight + getNodeYGap(child.depth);
    });

  }
}

export default Position;