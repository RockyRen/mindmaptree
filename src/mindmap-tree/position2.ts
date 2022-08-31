import Node from './node';
import { DepthType, getDepthType } from './helper';

function getNodeYGap(depth: number): number {
  const depthType = getDepthType(depth);
  let gap = 0;
  if (depthType === DepthType.firstLevel) {
    gap = 36;
  } else {
    gap = 25;
  }
  return gap;
}

function getNodeXGap(depth: number): number {
  const depthType = getDepthType(depth);
  let gap = 0;
  if (depthType === DepthType.firstLevel) {
    gap = 40;
  } else {
    gap = 14;
  }
  return gap;
}

let newNodeY = 0;
// todo 主要还是Y的变化
class Position2 {
  public constructor() {

  }
  public moveAdd(selection: Node, newNode: Node): {
    x: number;
    y: number;
  } {
    // 兄弟节点移动
    const newNodeBBox = newNode.getBBox();
    const yGap = getNodeYGap(newNode.depth);
    const moveHeight = (newNodeBBox.height + yGap) / 2;

    this.moveBrother(selection, newNode, moveHeight, newNode.id);
    console.log('a---', newNodeY);

    return {
      x: selection.getBBox().x2 + getNodeXGap(selection.depth + 1),
      y: newNodeY,
    }
  }

  private moveBrother(father: Node | null, anchor: Node, moveHeight: number, originId: string) {
    if (!father || !father.children) {
      return;
    }

    // todo 从node那里可以直接拿到相同direction的children
    const children = father.children.filter((child) => {
      return child.direction === anchor.direction;
    });

    let isFront = true;
    let preY = 0;
    children.forEach((child) => {
      if (anchor.id === child.id) {
        isFront = false;
        // todo 有可能是第一个开始插入的方式插入
        if (originId === child.id) {
          newNodeY = preY + moveHeight * 2;
        }
      } else if (isFront) {
        child.translateWithChild({
          y: -moveHeight,
        })
      } else {
        child.translateWithChild({
          y: moveHeight,
        })
      }


      const bbox = child.getBBox();
      preY = bbox.y;
    });

    this.moveBrother(father.father, father, moveHeight, originId);

  }
}

export default Position2;
