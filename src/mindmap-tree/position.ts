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

function getNodeGap(depth: number): number {
  const depthType = getDepthType(depth);
  let gap = 0;
  if (depthType === DepthType.firstLevel) {
    gap = 36;
  } else {
    gap = 25;
  }
  return gap;
}


// todo 重构
class Position {
  private readonly areaHeightMap: Record<string, number> = {};
  public constructor(node: Node) {
    this.initPosition(node, Direction.LEFT);
    this.initPosition(node, Direction.RIGHT);
  }

  private initPosition(node: Node, direction: Direction): void {
    const areaHeight = this.getAreaHeight(node, direction);

    // todo 和下面的children能否复用？
    const children = node.children?.filter((currentNode) => {
      return currentNode.direction === direction;
    }) || [];

    let nodeBBox = node.getBBox();
    let startY = nodeBBox.cy - (areaHeight / 2);

    children.forEach((child) => {
      const childAreaHeight = this.getAreaHeight(child, direction);
      const childBBox = child.getBBox();

      const nodeXInterval = 40;
      let childX = 0;
      if (direction === Direction.RIGHT) {
        childX = nodeBBox.cx + nodeXInterval + nodeBBox.width / 2;
      } else {
        childX = nodeBBox.cx - nodeXInterval - nodeBBox.width / 2 - childBBox.width; 
      }

      const childNodeHeight = getNodeHeight(child.depth);

      // todo ???
      const useAreaHeight = children.length === 1 ? areaHeight : childAreaHeight;

      const childY = startY + (useAreaHeight / 2) - (childNodeHeight / 2);

      child.show({
        x: childX,
        y: childY,
      });

      this.initPosition(child, direction);

      startY += childAreaHeight + getNodeGap(child.depth);
    });

  }

  private getAreaHeight(node: Node, direction: Direction): number {
    const areaKey = `${node.id}_${direction}`;
    if (this.areaHeightMap[areaKey]) {
      return this.areaHeightMap[areaKey];
    }

    let areaHeight = 0;

    const children = node.children?.filter((currentNode) => {
      return currentNode.direction === direction;
    }) || [];

    if (children.length === 0 || children.length === 1) {
      areaHeight = getNodeHeight(node.depth);
    } else {
      const childrenAreaHeight = children.reduce((total, child) => {
        const childAreaHeight = this.getAreaHeight(child, direction);
        return total + childAreaHeight;
      }, 0);

      const gap = getNodeGap(node.depth);

      areaHeight = childrenAreaHeight + (children.length - 1) * gap;
    }

    this.areaHeightMap[node.id] = areaHeight;

    return areaHeight;
  }
}

export default Position;