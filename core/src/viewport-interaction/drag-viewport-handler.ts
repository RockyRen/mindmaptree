import Viewport from '../viewport';

const validDiff = 2;

class DragViewportHandler {
  private isStart: boolean = false;
  private lastClientX: number = 0;
  private lastClientY: number = 0;
  private isMoveInited: boolean = false;

  public constructor(private readonly viewport: Viewport) { }

  // clientX、clientY表示距离浏览器窗口的距离
  public handleMousedown = (clientX: number, clientY: number): void => {
    this.isStart = true;
    this.lastClientX = clientX;
    this.lastClientY = clientY;
  }

  public handleMousemove = (clientX: number, clientY: number): void => {
    if (!this.isStart) return;

    const dx = this.lastClientX - clientX;
    const dy = this.lastClientY - clientY;

    if (!this.isMoveInited && (Math.abs(dx) > validDiff || Math.abs(dy) > validDiff)) {
      this.isMoveInited = true;
    }

    if (this.isMoveInited) {
      this.viewport.translate(dx, dy);
    }

    this.lastClientX = clientX;
    this.lastClientY = clientY;
  }

  public handleMouseup = (): void => {
    this.isStart = false;
    this.isMoveInited = false;
    this.lastClientX = 0;
    this.lastClientY = 0;
  }
}

export default DragViewportHandler;
