import { RaphaelPaper, RaphaelSet, RaphaelElement, RaphaelAxisAlignedBoundingBox, RaphaelAttributes } from 'raphael';

interface CustomAttr {
  defaultLabel: Partial<RaphaelAttributes>;
  defaultRect: Partial<RaphaelAttributes>;
  selected: Partial<RaphaelAttributes>;
  unSelected: Partial<RaphaelAttributes>;
}

export interface NodeShapeBaseOptions {
  paper: RaphaelPaper;
  x?: number;
  y?: number;
  label: string;
}

interface NodeShapeOptions extends NodeShapeBaseOptions {
  customAttr: CustomAttr;
  paddingWidth: number;
  rectHeight: number;
}

interface NodeDrawShapeOptions extends NodeShapeOptions {
  x: number;
  y: number; 
}

const invisibleX = -999999;
const invisibleY = -999999;

// 根节点shape
export class NodeShape {
  private readonly paper: RaphaelPaper;
  private readonly shapeSet: RaphaelSet;
  private readonly labelShape: RaphaelElement;
  private readonly rectShape: RaphaelElement;
  private readonly customAttr: CustomAttr;

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

    const hasValidPosition = (x !== undefined && y !== undefined);
    const shapeX = hasValidPosition ? x : invisibleX;
    const shapeY = hasValidPosition ? y : invisibleY;

    this.labelShape = this.paper.text(shapeX, shapeY, label);
    this.rectShape = this.paper.rect(shapeX, shapeY, 0, 0, 4);
    this.draw({
      ...options,
      x: shapeX,
      y: shapeY,
    });

    if (!hasValidPosition) {
      this.shapeSet.hide();
    }
  }

  
  public show(x?: number, y?: number) {
    if (x && y) {
      this.shapeSet.translate(-invisibleX + x, -invisibleY + y);
    }
    this.shapeSet.show();
  }

  public hide() {
    this.shapeSet.hide();
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
  }: NodeDrawShapeOptions): void {
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
      x: x + rectWidth * 0.5,
      y: y + rectHeight * 0.5
    });
    rectShape.attr({
      width: rectWidth,
      height: rectHeight
    });
  }
}
