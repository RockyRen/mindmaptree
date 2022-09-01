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

  // todo 兄弟节点，front向上移动，back向下移动。然后递归father的兄弟节点
  // todo 获取当前节点的y点
  public moveAdd(newNode: Node): void {
    const father = newNode.father;
    if (!father) {
      return;
    }

    const newNodeBBox = newNode.getBBox();
    const fatherBBox = father?.getBBox();

    const newNodeAreaHeight = newNodeBBox.height; // todo 这里换成areaHeight的获取
    
    const yGap = getNodeYGap(newNode.depth);
    const moveHeight = (newNodeAreaHeight + yGap) / 2;

    // 兄弟节点移动
    this.moveBrother(newNode, moveHeight);

    const newNodeX = fatherBBox.x2 + getNodeXGap(father.depth + 1);

    newNode.show({
      x: newNodeX,
      y: newNodeY,
    })
  }

  private moveBrother(node: Node, moveHeight: number) {
    const father = node.father;
    if (!father || !father.children) {
      return;
    }

    const children = father.getDirectionChildren(node.direction);


    // todo 优雅的写法？？
    let isFront = true;
    children.forEach((child) => {
      if (node.id === child.id) {
        isFront = false;
      } else if (isFront) {
        child.translateWithChild({
          y: -moveHeight,
        })
      } else {
        child.translateWithChild({
          y: moveHeight,
        })
      }
    });

    this.moveBrother(father, moveHeight);

  }
}

export default Position2;
