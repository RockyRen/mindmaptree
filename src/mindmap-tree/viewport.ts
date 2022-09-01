import { RaphaelPaper } from 'raphael';

class Viewport {
  private isDragging: boolean = false;
  private lastX: number = 0;
  private lastY: number = 0;
  private viewportX: number = 0;
  private viewportY: number = 0;
  public constructor(
    private readonly paper: RaphaelPaper,
    private readonly graphWidth: number,
    private readonly graphHeight: number
  ) { }

  public handleMousedown(x: number, y: number): void {
    this.isDragging = true;
    this.lastX = x;
    this.lastY = y;
  }

  public handleMousemove(x: number, y: number): void {
    if (!this.isDragging) {
      return;
    }

    this.viewportX += (this.lastX - x);
    this.viewportY += (this.lastY - y);

    this.paper.setViewBox(this.viewportX, this.viewportY, this.graphWidth, this.graphHeight);

    this.lastX = x;
    this.lastY = y;
  }

  public handleMouseup(): void {
    this.isDragging = false;
  }
}

export class GraphViewport {
  public constructor(paper: RaphaelPaper, graphDom: HTMLDivElement) {
    const svgDom = graphDom.querySelector('svg');
    const graphWidth = graphDom.clientWidth;
    const graphHeight = graphDom.clientHeight;

    if (!svgDom) {
      return;
    }

    const viewport = new Viewport(paper, graphWidth, graphHeight);

    svgDom.addEventListener('mousedown', function (event: MouseEvent) {
      viewport.handleMousedown(event.offsetX, event.offsetY);
    });

    svgDom.addEventListener('mousemove', function (event: MouseEvent) {
      viewport.handleMousemove(event.offsetX, event.offsetY);
    });

    svgDom.addEventListener('mouseup', function () {
      viewport.handleMouseup();
    });
  }
}
