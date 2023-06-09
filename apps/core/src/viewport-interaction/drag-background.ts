import DragViewportHandler from './drag-viewport-handler';
import { isMobile } from '../helper';

class DragBackground {
  public constructor(
    private readonly svgDom: SVGSVGElement | null,
    private readonly dragViewportHandler: DragViewportHandler,
    private able: boolean,
  ) {
    this.svgDom = svgDom;

    if (isMobile) {
      this.svgDom?.addEventListener('touchstart', this.handleMousedown);
      this.svgDom?.addEventListener('touchmove', this.handleMousemove);
      this.svgDom?.addEventListener('touchend', this.handleMouseup);

    } else {
      this.svgDom?.addEventListener('mousedown', this.handleMousedown);
      this.svgDom?.addEventListener('mousemove', this.handleMousemove);
      this.svgDom?.addEventListener('mouseup', this.handleMouseup);
    }
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

  private handleMousedown = (event: MouseEvent | TouchEvent): void => {
    if (!this.able) return;
    let clientX = 0;
    let clientY = 0;

    if (isMobile) {
      const mobileEvent = event as TouchEvent;
      clientX = mobileEvent.touches[0].clientX;
      clientY = mobileEvent.touches[0].clientY;
      event.preventDefault();
    } else {
      const pcEvent = event as MouseEvent;
      clientX = pcEvent.clientX;
      clientY = pcEvent.clientY;
    }

    this.dragViewportHandler.handleMousedown(clientX, clientY);
  }

  private handleMousemove = (event: MouseEvent | TouchEvent): void => {
    let clientX = 0;
    let clientY = 0;

    if (isMobile) {
      const mobileEvent = event as TouchEvent;
      clientX = mobileEvent.touches[0].clientX;
      clientY = mobileEvent.touches[0].clientY;
    } else {
      const pcEvent = event as MouseEvent;
      clientX = pcEvent.clientX;
      clientY = pcEvent.clientY;
    }

    this.dragViewportHandler.handleMousemove(clientX, clientY);
  }

  private handleMouseup = (): void => {
    this.dragViewportHandler.handleMouseup();
  }
}

export default DragBackground;

