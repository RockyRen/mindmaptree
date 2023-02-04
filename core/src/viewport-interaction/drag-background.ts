import DragViewportHandler from './drag-viewport-handler';

class DragBackground {
  private able: boolean = false;
  public constructor(
    private readonly svgDom: SVGSVGElement | null,
    private readonly dragViewportHandler: DragViewportHandler
  ) {
    this.svgDom = svgDom
    this.svgDom?.addEventListener('mousedown', this.handleMousedown);

    this.svgDom?.addEventListener('mousemove', this.handleMousemove);

    this.svgDom?.addEventListener('mouseup', this.handleMouseup);
  }

  public disable(): void {
    this.able = false;
  }

  public enable(): void {
    this.able = true;
  }

  public clear(): void {
    this.svgDom?.removeEventListener('mousedown', this.handleMousedown);
    this.svgDom?.removeEventListener('mousemove', this.handleMousemove);
    this.svgDom?.removeEventListener('mouseup', this.handleMouseup);
  }

  private handleMousedown = (event: MouseEvent): void => {
    if (!this.able) {
      return;
    }
    this.dragViewportHandler.handleMousedown(event.clientX, event.clientY);
  }

  private handleMousemove = (event: MouseEvent): void => {
    this.dragViewportHandler.handleMousemove(event.clientX, event.clientY);
  }

  private handleMouseup = (): void => {
    this.dragViewportHandler.handleMouseup();
  }
}

export default DragBackground;

