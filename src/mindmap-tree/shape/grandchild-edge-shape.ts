import Raphael, { RaphaelPaper, RaphaelSet, RaphaelAxisAlignedBoundingBox } from 'raphael';
import { Direction } from '../types';

interface GrandchildEdgeShapeOptions {
  paper: RaphaelPaper;
  sourceBBox: RaphaelAxisAlignedBoundingBox;
  targetBBox: RaphaelAxisAlignedBoundingBox;
  direction: Direction;
  depth: number;
}

export class GrandchildEdgeShape {
  private readonly shapeSet: RaphaelSet;
  public constructor(options: GrandchildEdgeShapeOptions) {
    this.shapeSet = this.draw(options);
  }

  // todo 重构
  private draw({
    paper,
    sourceBBox,
    targetBBox,
    direction,
    depth,
  }: GrandchildEdgeShapeOptions): RaphaelSet {
    let shortX = 0;
    let shortY = 0;
    let connectX = 0;
    let connectY = 0;
    let targetUnderStartX = 0;
    let targetUnderStartY = 0;
    let targetUnderEndX = 0;
    let targetUnderEndY = 0;

    if (direction === Direction.RIGHT) {
      shortX = sourceBBox.x2;
      connectX = (sourceBBox.x2 + targetBBox.x) / 2;
      targetUnderStartX = targetBBox.x;
      targetUnderEndX = targetBBox.x2;
    } else {
      shortX = sourceBBox.x;
      connectX = (sourceBBox.x + targetBBox.x2) / 2;
      targetUnderStartX = targetBBox.x2;
      targetUnderEndX = targetBBox.x;
    }

    if (depth === 2) {
      shortY = sourceBBox.cy;
    } else {
      shortY = sourceBBox.y2;
    }

    connectY = shortY;

    targetUnderStartY = targetBBox.y2;
    targetUnderEndY = targetUnderStartY;


    const shortPath = paper.path(Raphael.fullfill("M{x1},{y1}L{x2},{y2}", {
      x1: shortX, y1: shortY, x2: connectX, y2: connectY,
    }));

    const connectPath = paper.path(Raphael.fullfill("M{x1},{y1}L{x2},{y2}", {
      x1: connectX, y1: connectY, x2: targetUnderStartX, y2: targetUnderStartY,
    })).attr({
      'stroke': '#999',
      'stroke-width': 2,
    });

    const targetUnderPath = paper.path(Raphael.fullfill("M{x1},{y1}L{x2},{y2}", {
      x1: targetUnderStartX, y1: targetUnderStartY, x2: targetUnderEndX, y2: targetUnderEndY,
    }));

    return paper.set().push(shortPath).push(connectPath).push(targetUnderPath);
  }

  public remove(): void {
    this.shapeSet.remove();
  }
}

export function createGrandchildEdgeShape(options: GrandchildEdgeShapeOptions) {
  return new GrandchildEdgeShape(options);
}
