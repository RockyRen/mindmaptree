import { Direction } from '../types';
import ShapeEventEmitter from './common/shape-event-emitter';
import { isMobile } from '../helper';
import type { RaphaelPaper, RaphaelAxisAlignedBoundingBox, RaphaelSet, RaphaelElement } from 'raphael';
import type { EventNames, EventArgs } from './common/shape-event-emitter';

const circleRadius = isMobile ? 7 : 5;
const operationWidth = circleRadius * 0.6;
const circlePositionOffset = isMobile ? 3 : 2;

export const expanderBoxWidth = circleRadius * 2 + circlePositionOffset + 3;

class ExpanderShape {
  private readonly paper: RaphaelPaper;
  private readonly circleShape: RaphaelElement;
  private readonly horizontalShape: RaphaelElement;
  private readonly verticalShape: RaphaelElement;
  private readonly shapeSet: RaphaelSet;
  private readonly shapeEventEmitter: ShapeEventEmitter;
  private isExpand: boolean;
  public constructor({
    paper,
    nodeBBox,
    isExpand,
    direction,
  }: {
    paper: RaphaelPaper;
    nodeBBox: RaphaelAxisAlignedBoundingBox;
    isExpand: boolean;
    direction: Direction;
  }) {
    this.paper = paper;
    this.isExpand = isExpand;
    this.shapeSet = paper.set();

    const { x, y } = this.getPosition(nodeBBox, direction);

    this.circleShape = paper.circle(x, y, circleRadius);
    this.circleShape.attr({
      'fill': '#fff',
      'fill-opacity': 1,
    });

    // @ts-ignore
    this.circleShape.node.style['cursor'] = 'pointer';

    const {
      cx: circleCx,
      cy: circleCy,
    } = this.circleShape.getBBox();

    this.horizontalShape = paper.path([
      `M${circleCx - operationWidth} ${circleCy}`,
      `L${circleCx + operationWidth} ${circleCy}`,
    ].join(' '));

    this.verticalShape = this.paper.path([
      `M${circleCx} ${circleCy - operationWidth}`,
      `L${circleCx} ${circleCy + operationWidth}`,
    ].join(' '));
    

    this.shapeSet.push(this.circleShape).push(this.horizontalShape).push(this.verticalShape);

    if (isExpand) {
      this.verticalShape.hide();
    }

    this.shapeSet.attr({
      'stroke': '#000',
      'stroke-opacity': 0.7,
    });
    this.shapeSet.toFront();

    this.shapeEventEmitter = new ShapeEventEmitter(this.shapeSet);

    this.initHover();
  }

  public on<T extends EventNames>(eventName: EventNames, ...args: EventArgs<T>): void {
    this.shapeEventEmitter.on(eventName, ...args);
  }

  public changeExpand(newIsExpand: boolean): void {
    if (this.isExpand === newIsExpand) return;

    if (newIsExpand) {
      this.verticalShape.hide();
    } else {
      this.verticalShape.show();
    }

    this.isExpand = newIsExpand;
  }

  public translateTo(nodeBBox: RaphaelAxisAlignedBoundingBox, direction: Direction) {
    const { x, y } = this.getPosition(nodeBBox, direction);

    const {
      cx: oldX,
      cy: oldY,
    } = this.getBBox();

    const dx = x - oldX;
    const dy = y - oldY;

    if (dx === 0 && dy === 0) {
      return;
    }

    this.shapeSet.translate(dx, dy);
  }

  public getBBox(): RaphaelAxisAlignedBoundingBox {
    return this.circleShape.getBBox();
  }

  public remove(): void {
    this.shapeSet.remove();
    this.shapeEventEmitter.removeAllListeners();
  }

  public setStyle(styleType: 'disable' | 'base' | 'hover'): void {
    switch(styleType) {
      case 'disable': {
        this.setStyle('base');
        this.shapeSet.attr({
          'opacity': 0.4,
        });
        break;
      }
      case 'hover': {
        this.setStyle('base');
        this.circleShape.attr({
          'fill': '#E7E7E7',
          'fill-opacity': 1,
        });
        break;
      }
      case 'base':
      default: {
        this.shapeSet.attr({
          'opacity': 1,
        });
        this.circleShape.attr({
          'fill': '#fff',
          'fill-opacity': 1,
        });
        break;
      }
    }
  }

  private getPosition(nodeBBox: RaphaelAxisAlignedBoundingBox, direction: Direction): {
    x: number;
    y: number;
  } {
    let x = 0;
    const y = nodeBBox.cy;
    if (direction === Direction.RIGHT) {
      x = nodeBBox.x2 + circleRadius + circlePositionOffset;
    } else {
      x = nodeBBox.x - circleRadius - circlePositionOffset;
    }

    return {
      x,
      y,
    };
  }

  private initHover(): void {
    this.shapeEventEmitter.on('hover', () => {
      this.setStyle('hover');
    }, () => {
      this.setStyle('base');
    });
  }
}

export default ExpanderShape;
