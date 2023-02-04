import { RaphaelPaper, RaphaelAxisAlignedBoundingBox, RaphaelElement } from 'raphael';
import { Direction } from '../types';
import { drawGrandChildEdge } from './common/draw-edge';

interface GrandchildEdgeShapeOptions {
  paper: RaphaelPaper;
  sourceBBox: RaphaelAxisAlignedBoundingBox;
  targetBBox: RaphaelAxisAlignedBoundingBox;
  direction: Direction;
  targetDepth: number;
}

export class GrandchildEdgeShape {
  private readonly shape: RaphaelElement;
  public constructor({
    paper,
    sourceBBox,
    targetBBox,
    direction,
    targetDepth,
  }: GrandchildEdgeShapeOptions) {
    this.shape = drawGrandChildEdge({
      paper,
      sourceBBox,
      targetBBox,
      direction,
      targetDepth,
      hasUnder: true,
    });

    this.shape.attr({
      'stroke': '#000',
      'stroke-width': 1.5,
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

export function createGrandchildEdgeShape(options: GrandchildEdgeShapeOptions) {
  return new GrandchildEdgeShape(options);
}
