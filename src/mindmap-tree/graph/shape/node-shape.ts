import { RaphaelPaper, RaphaelSet, RaphaelElement, RaphaelAxisAlignedBoundingBox, RaphaelAttributes } from 'raphael';

interface CustomAttr {
  defaultLabel: Partial<RaphaelAttributes>;
  defaultRect: Partial<RaphaelAttributes>;
  selected: Partial<RaphaelAttributes>;
  unSelected: Partial<RaphaelAttributes>;
}

export interface NodeShapeBaseOptions {
  paper: RaphaelPaper;
  x: number;
  y: number;
  label: string;
}

interface NodeShapeOptions extends NodeShapeBaseOptions {
  customAttr: CustomAttr;
  paddingWidth: number;
  rectHeight: number;
}

// 根节点shape
export class NodeShape {
  private readonly paper: RaphaelPaper;
  private readonly shapeSet: RaphaelSet;
  private readonly labelShape: RaphaelElement;
  private readonly rectShape: RaphaelElement;
  private customAttr: CustomAttr;

  public constructor(options: NodeShapeOptions) {
    const {
      paper,
      x,
      y,
      label,
      customAttr,
    } = options;
    this.paper = paper;
    this.customAttr = customAttr;
    this.shapeSet = this.paper.set();
    this.labelShape = this.paper.text(x, y, label);
    this.rectShape = this.paper.rect(x, y, 0, 0, 4);
    this.draw(options);
  }

  public getBBox(): RaphaelAxisAlignedBoundingBox {
    return this.rectShape.getBBox();
  }

  public translate(offsetX: number, offsetY: number): void {
    this.shapeSet.translate(offsetX, offsetY);
  }

  public select(): void {
    this.rectShape?.attr(this.customAttr.selected);
  }

  public unSelect(): void {
    this.rectShape?.attr(this.customAttr.unSelected);
  }

  public remove(): void {
    this.shapeSet.remove();
  }

  private draw({
    x,
    y,
    label,
    paddingWidth,
    rectHeight,
  }: NodeShapeOptions): void {
    const { labelShape, rectShape, shapeSet, }  = this;
    labelShape.toFront();
    labelShape.attr({
      ...this.customAttr.defaultLabel,
      'text': label,
    });

    rectShape.attr({
      ...this.customAttr.defaultRect,
      'stroke-width': 1,
    });

    this.setNodeElementPosition({
      x,
      y,
      paddingWidth,
      rectHeight,
    });

    shapeSet.push(this.labelShape).push(rectShape);
  }

  private setNodeElementPosition({
    x, y, paddingWidth, rectHeight,
  }: {
    x: number;
    y: number;
    paddingWidth: number;
    rectHeight: number;
  }): void {
    const { labelShape, rectShape } = this;
    const labelBox = labelShape.getBBox();
    const rectWidth = labelBox.width + paddingWidth;
  
    labelShape.attr({
      x: x+ rectWidth * 0.5,
      y: y + rectHeight * 0.5
    });
    rectShape.attr({
      width: rectWidth,
      height: rectHeight
    });
  }
  
}
