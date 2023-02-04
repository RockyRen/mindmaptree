import type { RaphaelPaper, RaphaelElement, RaphaelAxisAlignedBoundingBox } from 'raphael';

class MultiSelectShape {
  private startX: number = 0;
  private startY: number = 0;
  private isInit: boolean = false;
  private rectShape: RaphaelElement | null = null;
  public constructor(private readonly paper: RaphaelPaper) {}

  public init(startX: number, startY: number) {
    this.startX = startX;
    this.startY = startY;
    this.isInit = true;
  }

  public resize(endX: number, endY: number) {
    if (!this.isInit) return;

    const { startX, startY } = this;

    const x = startX < endX ? startX : endX;
    const y = startY < endY ? startY : endY;
    const width = Math.abs(startX - endX);
    const height = Math.abs(startY - endY);

    if (this.rectShape === null) {
      this.rectShape = this.paper.rect(x, y, width, height);
      this.rectShape.attr({
        stroke: '#73a1bf',
        fill: 'rgba(153,124,255,0.1)',
        opacity: 0.8,
      })
    } else {
      this.rectShape.attr({ x, y, width, height });
    }
  }

  public hide() {
    this.isInit = false;
    this.rectShape?.remove();
    this.rectShape = null;
  }

  public getBBox(): RaphaelAxisAlignedBoundingBox {
    return this.rectShape?.getBBox()!;
  }
}


export default MultiSelectShape;
