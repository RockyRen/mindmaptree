import { RaphaelPaper, RaphaelSet, RaphaelElement, RaphaelAxisAlignedBoundingBox } from 'raphael';
import { setNodeAccessoryPosition } from './shape-helper';

interface RootNodeShapeOptions {
  paper: RaphaelPaper;
  x: number;
  y: number;
  label: string;
}

// 根节点shape
class RootNodeShape {
  private readonly paper: RaphaelPaper;
  private readonly shapeSet: RaphaelSet;
  private readonly labelShape: RaphaelElement;
  private readonly rectShape: RaphaelElement;

  public constructor({
    paper,
    x,
    y,
    label,
  }: RootNodeShapeOptions) {
    this.paper = paper;
    this.shapeSet = this.paper.set();
    this.labelShape = this.paper.text(x, y, label);
    this.rectShape = this.paper.rect(x, y, 0, 0, 4);
    this.draw({ x, y, label });
  }

  public getBBox(): RaphaelAxisAlignedBoundingBox {
    return this.rectShape.getBBox();
  }

  public translate(offsetX: number, offsetY: number): void {
    // this.shapeSet.forEach((shape) => {
    //   shape.translate(offsetX, offsetY);
    // });
    this.shapeSet.translate(offsetX, offsetY);
  }

  public select(): void {
    this.rectShape?.attr({
      'stroke': '#ff0033',
      'stroke-width': 2.5
    });
  }

  public unSelect(): void {
    this.rectShape?.attr({
      'stroke': '#808080',
      'stroke-width': 1,
    });
  }

  public remove(): void {
    this.shapeSet.remove();
  }

  private draw({ x, y, label }: {
    x: number;
    y: number;
    label: string;
  }): void {
    this.labelShape.toFront();
    this.labelShape.attr({
      'font-size': 25,
      'fill': 'white',
      'text': label,
    });

    this.rectShape.attr({
      'fill': '#428bca',
      'stroke': '#808080',
      'stroke-width': 1,
    });

    setNodeAccessoryPosition({
      label: this.labelShape,
      rect: this.rectShape,
      nodeX: x,
      nodeY: y,
      paddingWidth: 42,
      paddingHeight: 24,
    });

    this.shapeSet.push(this.labelShape).push(this.rectShape);
  }
}

export default RootNodeShape;
