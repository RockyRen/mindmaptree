import type { RaphaelPaper, RaphaelElement, RaphaelSet, RaphaelAxisAlignedBoundingBox } from 'raphael';

const paddingWidth = 20;
const paddingHeight = 12;
const borderPadding = 6;
const borderWidth = 2;

class CollaborateShape {
  private readonly labelShape: RaphaelElement;
  private readonly rectShape: RaphaelElement;
  private readonly borderShape: RaphaelElement;
  private readonly shapeSet: RaphaelSet;
  public constructor({
    paper,
    nodeBBox,
    name,
    color,
  }: {
    paper: RaphaelPaper;
    nodeBBox: RaphaelAxisAlignedBoundingBox;
    name: string;
    color: string;
  }) {
    this.rectShape = paper.rect(nodeBBox.x, nodeBBox.y, 0, 0);
    this.labelShape = paper.text(nodeBBox.x, nodeBBox.y, name);
    this.borderShape = paper.rect(nodeBBox.x, nodeBBox.y, 0, 0, 4);
    this.shapeSet = paper.set().push(this.labelShape, this.rectShape, this.borderShape);
    this.shapeSet.toBack();

    this.labelShape.attr({
      'stroke': '#fff',
    });

    this.rectShape.attr({
      'fill': color,
      'stroke-opacity': 0,
    });

    this.borderShape.attr({
      'stroke': color,
      'stroke-width': borderWidth,
      'fill-opacity': 0,
    });

    this.setPosition(nodeBBox);
  }

  public remove(): void {
    this.shapeSet.remove();
  }

  public setPosition(nodeBBox: RaphaelAxisAlignedBoundingBox): void {
    const labelBBox = this.labelShape.getBBox();

    const rectWidth = labelBBox.width + paddingWidth;
    const rectHeight = labelBBox.height + paddingHeight;

    this.rectShape.attr({
      width: rectWidth,
      height: rectHeight,
    });

    this.borderShape.attr({
      width: nodeBBox.width + borderPadding,
      height: nodeBBox.height + borderPadding,
    });

    const rectBBox = this.rectShape.getBBox();
    const rectX = nodeBBox.x - borderPadding / 2;
    const rectY = nodeBBox.y - rectBBox.height - borderPadding / 2;

    const labelX = rectX + (rectBBox.width - labelBBox.width) / 2;
    const labelY = rectY + (rectBBox.height - labelBBox.height) / 2;

    const borderX = nodeBBox.x - borderPadding / 2;
    const borderY = nodeBBox.y - borderPadding / 2;

    this.shapeTranslateTo(this.labelShape, labelX, labelY);
    this.shapeTranslateTo(this.rectShape, rectX, rectY);
    this.shapeTranslateTo(this.borderShape, borderX, borderY);
  }

  private shapeTranslateTo(shape: RaphaelElement | RaphaelSet, x: number, y: number): void {
    const { x: oldX, y: oldY } = shape.getBBox();
    const dx = x - oldX;
    const dy = y - oldY;

    if (dx === 0 && dy === 0) return;

    shape.translate(dx, dy);
  }
}

export default CollaborateShape;
