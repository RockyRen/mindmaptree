import Node from './node';
import { DepthType, getDepthType } from './helper';
import { Direction } from './types';

// todo
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

// todo
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


// todo 主要还是Y的变化
class Position2 {
  public constructor() {

  }

  // todo 兄弟节点，front向上移动，back向下移动。然后递归father的兄弟节点
  // todo 获取当前节点的y点
  // todo 测试有多个子节点的节点的情况
  public moveAdd(newNode: Node): void {
    const father = newNode.father;
    if (!father) {
      return;
    }

    const newNodeBBox = newNode.getBBox();
    const fatherBBox = father?.getBBox();

    const newNodeAreaHeight = newNodeBBox.height; // todo 这里换成areaHeight的获取

    const yGap = getNodeYGap(newNode.depth);

    let moveHeight = 0;
    const children = father.getDirectionChildren(newNode.direction);

    if (children.length > 1) {
      moveHeight = (newNodeAreaHeight + yGap) / 2;
    } else if (children.length === 1) {
      if (newNodeAreaHeight > fatherBBox.height) {
        moveHeight = newNodeAreaHeight / 2;
      }
    }

    if (moveHeight > 0) {
      // 兄弟节点移动
      this.moveBrother(newNode, moveHeight);
    }

    const nodeXGap = getNodeXGap(father.depth + 1);;

    const newNodeX = newNode.direction === Direction.RIGHT ?
      fatherBBox.x2 + nodeXGap :
      fatherBBox.x - nodeXGap - newNodeBBox.width;

    const newNodeY = this.getNewNodeY(newNode, newNodeAreaHeight, yGap);

    newNode.show({
      x: newNodeX,
      y: newNodeY,
    })
  }

  // todo 需要考虑从其他地方插入，而不是从最后一个插入
  private getNewNodeY(newNode: Node, newNodeAreaHeight: number, yGap: number): number {
    if (!newNode.father) {
      return 0;
    }

    let newNodeY = 0;
    const children = newNode.father.getDirectionChildren(newNode.direction) || [];

    const newNodeIndex = children.findIndex((child) => child.id === newNode.id);

    if (children.length > 1) {
      if (newNodeIndex < children.length - 1) {
        newNodeY = children[newNodeIndex + 1].getBBox().y - yGap;
      } else {
        newNodeY = children[newNodeIndex - 1].getBBox().y2 + yGap;
      }
    } else if (children.length === 1) {
      // 如果只有新节点一个子节点，则放在y的中间
      const {
        cy: fatherCy,
      } = newNode.father.getBBox();

      newNodeY = fatherCy - (newNodeAreaHeight / 2);
    }

    return newNodeY;
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
