import { RaphaelPaper, RaphaelAxisAlignedBoundingBox, RaphaelElement } from 'raphael';
import { Direction } from '../types';
import { drawFirstEdge } from './common/draw-edge';

interface FirstEdgeShapeOptions {
  paper: RaphaelPaper;
  sourceBBox: RaphaelAxisAlignedBoundingBox;
  targetBBox: RaphaelAxisAlignedBoundingBox;
  direction: Direction;
}

export class FirstEdgeShape {
  private readonly shape: RaphaelElement;
  public constructor({
    paper,
    sourceBBox,
    targetBBox,
    direction
  }: FirstEdgeShapeOptions) {
    this.shape = drawFirstEdge({
      paper,
      sourceBBox,
      targetBBox,
      direction
    });
    this.shape.attr({
      'stroke': '#000',
      'stroke-width': 2,
    });
    this.shape.toBack();
  }

  public setStyle(styleType: 'disable' | 'base'): void {
    switch(styleType) {
      case 'disable': {
        this.shape.attr({
          'opacity': 0.4,
        });
        break;
      }
      case 'base':
      default: {
        this.shape.attr({
          'opacity': 1,
        });
        break;
      }
    }
  }

  public remove(): void {
    this.shape.remove();
  }
}

export function createFirstEdgeShape(options: FirstEdgeShapeOptions): FirstEdgeShape {
  return new FirstEdgeShape(options);
}