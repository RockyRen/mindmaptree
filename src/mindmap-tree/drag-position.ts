import { DepthType } from './helper';
import Node from './node';
import Position from './position';
import { Direction } from './types';

class DragPosition {
  public constructor(
    private readonly node: Node,
    private readonly newFather: Node,
  ) {
    const position = new Position(this.node.getRoot());
    this.remove(position);
    this.add(position);
  }

  // 删除旧父节点的children
  private remove(position: Position) {
    const oldFather = this.node.father;

    const removeIndex = oldFather?.children?.findIndex((node) => node.id === this.node.id)
    if (removeIndex !== undefined && removeIndex > -1) {
      oldFather?.children?.splice(removeIndex, 1);
    }

    position.setPosition(this.node.direction!);
  }

  // 父节点变为newFather，增加newFather的children
  private add(position: Position) {
    this.node.setFather(this.newFather);
    this.newFather.children?.push(this.node);

    // todo 后面处理root的方向
    const direction = this.newFather.direction || Direction.RIGHT;
    this.node.resetAll(this.newFather.depth + 1, direction);

    position.setPosition(direction);
  }

}

export default DragPosition;