import Node from './node';
import { Direction } from './types';
import { getNodeXGap, getNodeYGap, AreaHeight } from './position';

// todo 主要还是Y的变化
class Position2 {
  public constructor() { }

  // todo 是不是等关系改变后，传father和node会比较好？
  public moveRemove(node: Node): void {
    const father = node.father;
    if (!father) {
      return;
    }

    const areaHeightHandler = new AreaHeight();
    const areaHeight = areaHeightHandler.getAreaHeight(node);


    const moveHeight = this.getMoveHeight(node, areaHeight);

    if (moveHeight > 0) {
      // 兄弟节点移动
      this.moveBrother(node, -moveHeight);
    }
  }

  public moveAddBrother(node: Node, direction: Direction): void {
    const father = node.father;
    if (!father) {
      return;
    }

    const areaHeightHandler = new AreaHeight();
    const areaHeight = areaHeightHandler.getAreaHeight(node, direction);

    const moveHeight = this.getMoveHeight(node, areaHeight);

    if (moveHeight > 0) {
      // 兄弟节点移动
      this.moveBrother(node, moveHeight);
    }
  }

  // todo 兄弟节点，front向上移动，back向下移动。然后递归father的兄弟节点
  // todo 获取当前节点的y点
  // todo 测试有多个子节点的节点的情况
  public moveAdd(node: Node, direction: Direction): void {
    const father = node.father;
    if (!father) {
      return;
    }

    this.moveAddBrother(node, direction);


    // todo 递归并
    const newNodeBBox = node.getBBox();
    const fatherBBox = father?.getBBox();

    const areaHeightHandler = new AreaHeight();
    const areaHeight = areaHeightHandler.getAreaHeight(node, direction);

    const yGap = getNodeYGap(node.depth);


    const nodeXGap = getNodeXGap(father.depth + 1);;

    const newNodeX = node.direction === Direction.RIGHT ?
      fatherBBox.x2 + nodeXGap :
      fatherBBox.x - nodeXGap - newNodeBBox.width;

    const newNodeY = this.getNewNodeY(node, areaHeight, yGap);

    node.show({
      x: newNodeX,
      y: newNodeY,
    });
  }

  private getMoveHeight(node: Node, areaHeight: number): number {
    const father = node.father!;
    let moveHeight = 0;
    const children = father.getDirectionChildren(node.direction);
    const yGap = getNodeYGap(node.depth);
    const fatherBBox = father.getBBox();

    if (children.length > 1) {
      moveHeight = (areaHeight + yGap) / 2;
    } else if (children.length === 1) {
      // 能不能不用特殊对待length为1的情况？
      if (areaHeight > fatherBBox.height) {
        moveHeight = areaHeight / 2;
      }
    }

    return moveHeight;
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
        child.translateWithChild(0, -moveHeight)
      } else {
        child.translateWithChild(0, moveHeight);
      }
    });

    this.moveBrother(father, moveHeight);
  }
}

export default Position2;
