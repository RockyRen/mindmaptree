import { RaphaelPaper, RaphaelSet, RaphaelElement, RaphaelAxisAlignedBoundingBox, RaphaelAttributes, RaphaelBaseElement } from 'raphael';

interface CustomAttr {
  defaultLabel: Partial<RaphaelAttributes>;
  defaultRect: Partial<RaphaelAttributes>;
  selected: Partial<RaphaelAttributes>;
  unSelected: Partial<RaphaelAttributes>;
}

// export type RaphaelBaseElementCallback<T> = Parameters<RaphaelBaseElement[keyof T]>[0]

// todo 这里可以统一一个泛型
export type MousedownCallback = Parameters<RaphaelBaseElement['mousedown']>[0];
export type MousemoveCallback = Parameters<RaphaelBaseElement['mousemove']>[0];
export type MouseupCallback = Parameters<RaphaelBaseElement['mouseup']>[0];

export type UnMousedownCallback = Parameters<RaphaelBaseElement['unmousedown']>[0];
export type UnMousemoveCallback = Parameters<RaphaelBaseElement['unmousemove']>[0];
export type UnMouseupCallback = Parameters<RaphaelBaseElement['unmouseup']>[0];

export type DragCallbackList = Parameters<RaphaelBaseElement['drag']>;

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
  public readonly shapeSet: RaphaelSet;
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

  public setLabel(label: string): number {
    const beforeLabelBBox = this.labelShape.getBBox();
    const rectBBox = this.rectShape.getBBox();

    this.labelShape.attr({
      text: label,
    });

    const afterLabelBBox = this.labelShape.getBBox();
    const diff = afterLabelBBox.width - beforeLabelBBox.width;

    this.rectShape.attr({
      width: rectBBox.width + diff,
    });

    this.rectShape.translate(-diff / 2, 0);

    return diff;
  }


  public show(x?: number, y?: number) {
    if (x !== undefined && y !== undefined) {
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

  public overlay(): void {
    this.rectShape?.attr({
      stroke: 'blue',
    });
  }

  public unOverlay(): void {
    this.rectShape?.attr({
      stroke: this.customAttr.defaultRect.stroke,
    });
  }

  public opacity(): void {
    this.shapeSet.attr({
      opacity: 0.4,
    });
  }

  public unOpacity(): void {
    this.shapeSet.attr({
      opacity: 1,
    }); 
  }

  public remove(): void {
    this.shapeSet.remove();
  }

  public mousedown(callback: MousedownCallback): void {
    this.shapeSet.mousedown(callback);
  }

  public mousemove(callback: MousemoveCallback): void {
    this.shapeSet.mousemove(callback);
  }

  public mouseup(callback: MouseupCallback): void {
    this.shapeSet.mouseup(callback);
  }

  public unmousedown(callback: UnMousedownCallback): void {
    this.shapeSet.unmousedown(callback);
  }

  public unmousemove(callback: UnMousemoveCallback): void {
    this.shapeSet.unmousemove(callback);
  }

  public unmouseup(callback: UnMouseupCallback): void {
    this.shapeSet.unmouseup(callback);
  }

  public drag(...params: DragCallbackList): void {
    this.shapeSet.drag(...params);
  }

  public undrag(): void {
    this.shapeSet.undrag();
  }

  public clone(): RaphaelSet {
    const rectShape = this.rectShape.clone();
    const labelShape = this.labelShape.clone();
    rectShape.attr({
      r: 4,
    })
    return this.paper.set().push(labelShape).push(rectShape);
  }

  private draw({
    x,
    y,
    label,
    paddingWidth,
    rectHeight,
  }: NodeDrawShapeOptions): void {
    const { labelShape, rectShape, shapeSet, } = this;
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
