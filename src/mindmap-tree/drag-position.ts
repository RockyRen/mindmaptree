import { DepthType } from './helper';
import Node from './node';
import Position from './position';
import { Direction } from './types';

class DragPosition {
  public constructor(
    private readonly node: Node,
    private readonly newFather: Node,
    private readonly createNewNode: Function,
  ) {
    const position = new Position(this.node.getRoot());
    this.init(position);
  }


  // todo 重新创建节点
  // depth可能会改变
  private init(position: Position) {
    const direction = this.newFather.direction || Direction.RIGHT;

    const newNode = this.createNewNode({
      node: this.node,
      depth: this.newFather.depth + 1,
      direction,
      father: this.newFather,
    });
    
    this.newFather.children?.push(newNode);

    const originDirection = this.node.direction;

    this.node.remove();

    if (originDirection === direction) {
      position.setPosition(direction);
    } else {
      position.setPosition(Direction.LEFT);
      position.setPosition(Direction.RIGHT);
    }
  }
}

export default DragPosition;