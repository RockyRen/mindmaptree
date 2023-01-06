import Node from '../node/node';
import Position from '../position';
import { Direction } from '../types';
import type { CreateSingleNodeFunc } from '../tree';
import { DepthType } from '../helper';

// 改变父节点的类 
class ChangeFather {
  public constructor(
    private readonly node: Node,
    private readonly newFather: Node,
    private readonly createSingleNode: CreateSingleNodeFunc,
  ) {
    const position = new Position(this.node.getRoot());
    this.init(position);
  }

  private init(position: Position) {
    const direction = this.newFather.direction || Direction.RIGHT;

    // 递归创建新的节点
    const newNode = this.createNewNode({
      node: this.node,
      depth: this.newFather.depth + 1,
      direction,
      father: this.newFather,
    });
    this.newFather.children?.push(newNode);

    const originDirection = this.node.direction;

    // 删除
    this.node.remove();

    if (originDirection === direction) {
      position.setPosition(direction);
    } else {
      position.setPosition(Direction.LEFT);
      position.setPosition(Direction.RIGHT);
    }
  }

  private createNewNode({
    node,
    depth,
    direction,
    father,
  }: {
    node: Node;
    depth: number;
    direction: Direction;
    father: Node;
  }): Node {
    const newNode = this.createSingleNode({
      depth,
      label: node.label,
      direction,
      father,
    });

    node.children.forEach((oldChild) => {
      const newChild = this.createNewNode({
        node: oldChild,
        depth: depth + 1,
        direction,
        father: newNode
      });
      newNode.pushChild(newChild);
    });

    return newNode;
  }
}

export default ChangeFather;