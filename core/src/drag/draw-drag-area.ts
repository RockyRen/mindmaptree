import { RaphaelPaper, RaphaelSet } from 'raphael';
import type { Area } from './drag-area';
import { getConfig } from '../config';

// for debug
class DrawDragArea {
  private shapeSet: RaphaelSet | null = null;
  public constructor(
    private readonly paper: RaphaelPaper,
  ) { }

  public draw(areaList: Area[]): void {
    const { isDebug } = getConfig();
    if (!isDebug) return;

    this.shapeSet = this.paper.set();

    areaList.forEach(({ node, areaBox, childrenYList }) => {
      let color = 'green';
      if (node.children.length === 0) {
        color = 'red';
      } else if (node.depth === 0) {
        color = 'orange';
      }

      const { x, y, x2, y2 } = areaBox;

      const rectShape = this.paper.rect(x, y, x2 - x, y2 - y).attr({
        'stroke-opacity': 0,
        'fill': color,
        opacity: 0.2,
      });

      this.shapeSet?.push(rectShape);

      childrenYList?.forEach((y: number) => {
        const edgeShape = this.paper.path(`M${x} ${y}L${x2} ${y}`).attr({
          stroke: color,
          opacity: 0.6,
        });
        this.shapeSet?.push(edgeShape);
      });

      this.shapeSet?.toBack();
    });
  }

  public clear(): void {
    const { isDebug } = getConfig();
    if (!isDebug) return;
    this.shapeSet?.remove();
  }
}

export default DrawDragArea;
