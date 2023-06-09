import { RaphaelSet, RaphaelElement, RaphaelAttributes } from 'raphael';

const labelDefaultAttr: Partial<RaphaelAttributes> = {
  'font-size': 16,
  'fill': '#000',
  'opacity': 1,
};

const rectDefaultAttr: Partial<RaphaelAttributes> = {
  'fill-opacity': 0,
  'stroke': '#808080',
  'stroke-opacity': 1,
  'opacity': 1,
};

const borderDefaultAttr: Partial<RaphaelAttributes> = {
  'stroke': '#fff',
  'stroke-width': 2,
  'fill': '#fff',
  'fill-opacity': 0,
  'opacity': 0,
};

export type StyleType = 'select' | 'overlay' | 'disable' | 'base' | 'hover';

class NodeShapeStyle {
  private readonly shapeSet: RaphaelSet;
  private readonly borderShape: RaphaelElement;
  private readonly labelShape: RaphaelElement;
  private readonly rectShape: RaphaelElement;
  private readonly labelBaseAttr: Partial<RaphaelAttributes>;
  private readonly rectBaseAttr: Partial<RaphaelAttributes>;
  private readonly borderBaseAttr: Partial<RaphaelAttributes>;
  private styleType: StyleType = 'base';
  public constructor({
    shapeSet,
    labelShape,
    borderShape,
    rectShape,
    labelBaseAttr,
    rectBaseAttr,
    borderBaseAttr,
  }: {
    shapeSet: RaphaelSet;
    borderShape: RaphaelElement;
    labelShape: RaphaelElement;
    rectShape: RaphaelElement;
    labelBaseAttr?: Partial<RaphaelAttributes>;
    borderBaseAttr?: Partial<RaphaelAttributes>;
    rectBaseAttr?: Partial<RaphaelAttributes>;
  }) {
    this.shapeSet = shapeSet;
    this.labelShape = labelShape;
    this.borderShape = borderShape;
    this.rectShape = rectShape;
    this.labelBaseAttr = { ...labelDefaultAttr, ...labelBaseAttr, };
    this.rectBaseAttr = { ...rectDefaultAttr, ...rectBaseAttr, };
    this.borderBaseAttr = { ...borderDefaultAttr, ...borderBaseAttr, };
  }

  public setBaseStyle(): void {
    this.labelShape.attr(this.labelBaseAttr);
    this.borderShape.attr(this.borderBaseAttr);
    this.rectShape.attr(this.rectBaseAttr);
  }
  public setStyle(styleType: StyleType): void {
    switch (styleType) {
      case 'select': {
        this.setBaseStyle();
        this.borderShape.attr({
          'stroke': '#3498DB',
          'opacity': 1,
        });
        break;
      }
      case 'overlay': {
        this.setBaseStyle();
        this.borderShape.attr({
          'stroke': '#E74C3C',
          'opacity': 0.8,
        });
        break;
      }
      case 'disable': {
        this.shapeSet.attr({
          opacity: 0.4,
        });
        break;
      }
      case 'hover': {
        this.setBaseStyle();
        this.borderShape.attr({
          'stroke': '#3498DB',
          'opacity': 0.5,
        });
        break;
      }
      case 'base':
      default: {
        this.setBaseStyle();
        break;
      }
    }

    this.styleType = styleType;
  }

  public getStyle(): StyleType {
    return this.styleType;
  }

  public getBaseAttr(): {
    labelBaseAttr: Partial<RaphaelAttributes>;
    borderBaseAttr: Partial<RaphaelAttributes>;
    rectBaseAttr: Partial<RaphaelAttributes>;
  } {
    return {
      labelBaseAttr: this.labelBaseAttr,
      borderBaseAttr: this.borderBaseAttr,
      rectBaseAttr: this.rectBaseAttr,
    };
  }
}

export default NodeShapeStyle;
