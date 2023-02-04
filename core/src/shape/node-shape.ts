import ShapeEventEmitter from './common/shape-event-emitter';
import NodeShapeStyle from './common/node-shape-style';
import { Direction } from '../types';
import type { EventNames, EventArgs } from './common/shape-event-emitter';
import type { RaphaelPaper, RaphaelSet, RaphaelElement, RaphaelAxisAlignedBoundingBox, RaphaelAttributes } from 'raphael';
import type { StyleType } from './common/node-shape-style';

const invisibleX = -999999;
const invisibleY = -999999;

const defaultPaddingWidth = 40;
const defaultRectHeight = 37;
const borderPadding = 6;

export interface NodeShapeOptions {
  paper: RaphaelPaper;
  x?: number;
  y?: number;
  label: string;
  paddingWidth?: number;
  rectHeight?: number;
  labelBaseAttr?: Partial<RaphaelAttributes>;
  rectBaseAttr?: Partial<RaphaelAttributes>;
  borderBaseAttr?: Partial<RaphaelAttributes>;
}

class NodeShape {
  private readonly paper: RaphaelPaper;
  private readonly shapeSet: RaphaelSet;
  private readonly borderShape: RaphaelElement;
  private readonly labelShape: RaphaelElement;
  private readonly rectShape: RaphaelElement;
  private readonly paddingWidth: number;
  private readonly rectHeight: number;
  private readonly shapeEventEmitter: ShapeEventEmitter;
  private readonly nodeShapeStyle: NodeShapeStyle;
  private label: string;
  private isHide: boolean = false;
  private isHoverInCalled: boolean = false;
  public constructor({
    paper,
    x,
    y,
    label,
    paddingWidth = defaultPaddingWidth,
    rectHeight = defaultRectHeight,
    labelBaseAttr,
    rectBaseAttr,
    borderBaseAttr,
  }: NodeShapeOptions) {
    this.paper = paper;
    this.label = label;
    this.paddingWidth = paddingWidth;
    this.rectHeight = rectHeight;

    const hasValidPosition = (x !== undefined && y !== undefined);
    // If there are no x or y, then move shape to the invisible position.
    const shapeX = hasValidPosition ? x : invisibleX;
    const shapeY = hasValidPosition ? y : invisibleY;

    this.labelShape = paper.text(shapeX, shapeY, label);
    this.borderShape = paper.rect(shapeX, shapeY, 0, 0, 4);
    this.rectShape = paper.rect(shapeX, shapeY, 0, 0, 4);
    this.shapeSet = paper.set().push(this.labelShape).push(this.borderShape).push(this.rectShape);

    this.nodeShapeStyle = new NodeShapeStyle({
      shapeSet: this.shapeSet,
      labelShape: this.labelShape,
      borderShape: this.borderShape,
      rectShape: this.rectShape,
      labelBaseAttr,
      rectBaseAttr,
      borderBaseAttr,
    });
    this.nodeShapeStyle.setBaseStyle();

    this.labelShape.toFront();
    // @ts-ignore
    this.labelShape.node.style['user-select'] = 'none';

    this.setPosition(shapeX, shapeY);
    this.shapeEventEmitter = new ShapeEventEmitter(this.shapeSet);

    if (!hasValidPosition) {
      this.hide();
    }

    this.initHover();
  }

  public getBBox(): RaphaelAxisAlignedBoundingBox {
    return this.rectShape.getBBox();
  }

  public setLabel(label: string, direction?: Direction): void {
    const beforeLabelBBox = this.labelShape.getBBox();
    this.labelShape.attr({
      text: label,
    });
    const afterLabelBBox = this.labelShape.getBBox();

    const bbox = this.getBBox();
    const diff = afterLabelBBox.width - beforeLabelBBox.width;

    this.setPosition(bbox.x, bbox.y);

    if (direction !== Direction.RIGHT && direction !== Direction.LEFT) {
      this.shapeSet.translate(-diff / 2, 0);
    }

    this.label = label;
  }

  public translateTo(x: number, y: number): void {
    const { x: oldX, y: oldY, } = this.getBBox();
    const dx = x - oldX;
    const dy = y - oldY;

    this.show();

    if (dx === 0 && dy === 0) return;

    this.shapeSet.translate(dx, dy);
  }

  public translate(dx: number, dy: number): void {
    this.shapeSet.translate(dx, dy);
  }

  public setStyle(styleType: StyleType): void {
    this.nodeShapeStyle.setStyle(styleType);
  }

  public getStyle(): StyleType {
    return this.nodeShapeStyle.getStyle();
  }

  public clone(): NodeShape {
    const { x, y } = this.getBBox();
    return new NodeShape({
      paper: this.paper,
      x,
      y,
      label: this.label,
      paddingWidth: this.paddingWidth,
      rectHeight: this.rectHeight,
      ...this.nodeShapeStyle.getBaseAttr(),
    });
  }

  public remove(): void {
    this.shapeSet.remove();
    this.shapeEventEmitter.removeAllListeners();
  }

  public on<T extends EventNames>(eventName: EventNames, ...args: EventArgs<T>): void {
    this.shapeEventEmitter.on(eventName, ...args);
  }

  public show(): void {
    this.shapeSet.show();
    this.isHide = false;
  }

  public hide(): void {
    this.shapeSet.hide();
    this.isHide = true;
  }

  public getIsHide(): boolean {
    return this.isHide;
  }

  public toFront(): void {
    this.borderShape.toFront();
    this.rectShape.toFront();
    this.labelShape.toFront();
  }

  private shapeTranslateTo(shape: RaphaelElement | RaphaelSet, x: number, y: number): void {
    const { x: oldX, y: oldY } = shape.getBBox();
    const dx = x - oldX;
    const dy = y - oldY;

    if (dx === 0 && dy === 0) return;

    shape.translate(dx, dy);
  }

  private setPosition(x: number, y: number): void {
    const { labelShape, borderShape, rectShape, paddingWidth, rectHeight } = this;
    const labelBBox = labelShape.getBBox();
    const rectWidth = labelBBox.width + paddingWidth;

    rectShape.attr({
      width: rectWidth,
      height: rectHeight,
    });

    borderShape.attr({
      width: rectWidth + borderPadding,
      height: rectHeight + borderPadding,
    });

    const rectBBox = rectShape.getBBox();

    this.shapeTranslateTo(labelShape, x + (rectBBox.width - labelBBox.width) / 2, y + (rectBBox.height - labelBBox.height) / 2);
    this.shapeTranslateTo(rectShape, x, y);
    this.shapeTranslateTo(borderShape, x - borderPadding / 2, y - borderPadding / 2);
  }

  private initHover(): void {
    this.shapeEventEmitter.on('hover', () => {
      const curStyleType = this.nodeShapeStyle.getStyle();
      if (curStyleType !== 'select' && curStyleType !== 'disable') {
        this.nodeShapeStyle.setStyle('hover');
        this.isHoverInCalled = true;
      }

    }, () => {
      const curStyleType = this.nodeShapeStyle.getStyle();
      if (this.isHoverInCalled && curStyleType !== 'select' && curStyleType !== 'disable') {
        this.nodeShapeStyle.setStyle('base');
        this.isHoverInCalled = false;
      }
    });
  }
}

export default NodeShape;
