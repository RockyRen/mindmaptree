import { RaphaelPaper, RaphaelSet, RaphaelElement } from 'raphael';
import { setTopicAccessoryPosition } from './shape-helper';

interface RootTopicShapeOptions {
  paper: RaphaelPaper;
  x: number;
  y: number;
  label: string;
}

// 根节点shape
class RootTopicShape {
  private readonly paper: RaphaelPaper;
  private readonly shapeSet: RaphaelSet;
  private labelShape: RaphaelElement;
  private rectShape: RaphaelElement;

  public constructor({
    paper,
    x,
    y,
    label,
  }: RootTopicShapeOptions) {
    this.paper = paper;
    this.shapeSet = this.paper.set();
    this.labelShape = this.paper.text(x, y, label);
    this.rectShape = this.paper.rect(x, y, 0, 0, 4);
    this.draw({ x, y, label });
  }

  public getPosition(): {
    x: number;
    y: number;
  } {
    return {
      x: this.rectShape?.attr('x') || 0,
      y: this.rectShape?.attr('y') || 0,
    };
  }

  public translate(offsetX: number, offsetY: number): void {
    const labelX = this.labelShape?.attr('x') || 0;
    const labelY = this.labelShape?.attr('y') || 0;
    this.labelShape?.attr({
      x: labelX + offsetX,
      y: labelY + offsetY,
    });

    const rectX = this.rectShape?.attr('x') || 0;
    const rectY = this.rectShape?.attr('y') || 0;
    this.rectShape?.attr({
      x: rectX + offsetX,
      y: rectY + offsetY,
    });
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

    setTopicAccessoryPosition({
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

export default RootTopicShape;
