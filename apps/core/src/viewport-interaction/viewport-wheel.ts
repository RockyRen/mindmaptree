import Viewport from '../viewport';

class ViewportWheel {
  private isMoveZoom: boolean = false;
  public constructor(
    private readonly viewport: Viewport,
    private readonly wrapperDom: HTMLDivElement,
  ) {
    wrapperDom.addEventListener('wheel', this.wheelCallback);
  }

  public clear(): void {
    this.wrapperDom.removeEventListener('wheel', this.wheelCallback);
  }

  public enableMoveScale(): void {
    this.isMoveZoom = true;
  }

  public disableMoveScale(): void {
    this.isMoveZoom = false;
  }

  private wheelCallback = (event: WheelEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    if (event.ctrlKey || this.isMoveZoom) {
      const speed = 0.02;
      const dScale = -Math.floor(event.deltaY) * speed;
      this.viewport.addScale(dScale);
    } else {
      const sensitivity = 0.6;
      const x = event.deltaX * sensitivity;
      const y = event.deltaY * sensitivity;
      this.viewport.translate(x, y);
    }
  };
}

export default ViewportWheel;
