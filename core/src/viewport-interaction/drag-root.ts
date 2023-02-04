import Node from '../node/node';
import DragViewportHandler from './drag-viewport-handler';

class DragRoot {
  private isStart: boolean = false;
  public constructor(
    private readonly root: Node,
    private readonly dragViewportHandler: DragViewportHandler
  ) {
    root.on('drag', this.move, this.start, this.end);
    this.dragViewportHandler = dragViewportHandler;
  }

  // start的x，y代表浏览器视口的鼠标位置
  private start = (clientX: number, clientY: number, event: MouseEvent): void => {
    event.stopPropagation();
    this.isStart = true;
    this.dragViewportHandler.handleMousedown.call(this.dragViewportHandler, clientX, clientY);
  }

  private move = (dx: number, dy: number, clientX: number, clientY: number): void => {
    if (!this.isStart) return;
    this.dragViewportHandler.handleMousemove.call(this.dragViewportHandler, clientX, clientY);
  }

  private end = (): void => {
    this.isStart = false;
    this.dragViewportHandler.handleMouseup.call(this.dragViewportHandler);
  }
}

export default DragRoot;
