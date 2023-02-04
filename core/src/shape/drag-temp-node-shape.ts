import { RaphaelAxisAlignedBoundingBox, RaphaelElement, RaphaelPaper, RaphaelSet } from "raphael";
import { Direction } from "../types";
import { getNodeXGap } from './gap';
import { drawFirstEdge, drawGrandChildEdge } from './common/draw-edge';

interface DragTempNodeShapeOptions {
  paper: RaphaelPaper;
  sourceBBox: RaphaelAxisAlignedBoundingBox;
  targetBBox1: RaphaelAxisAlignedBoundingBox | null;
  targetBBox2: RaphaelAxisAlignedBoundingBox | null;
  targetDepth: number;
  direction: Direction;
}

const firstBoundaryOffset = 55;
const boundaryYOffset = 14;

const rectWidth = 50;
const rectHeight = 13;

const grandchildYOffset = 3;


class DragTempNodeShape {
  private readonly paper: RaphaelPaper;
  private readonly shapeSet: RaphaelSet;

  public constructor({
    paper,
    sourceBBox,
    targetBBox1,
    targetBBox2,
    targetDepth,
    direction,
  }: DragTempNodeShapeOptions) {
    this.paper = paper;

    const validTargetBBox = targetBBox1 || targetBBox2;

    const yOffset = targetDepth === 1 ? firstBoundaryOffset : boundaryYOffset;

    let x = 0;

    if (validTargetBBox !== null) {
      x = direction === Direction.RIGHT ? validTargetBBox.x : (validTargetBBox.x2 - rectWidth);
    } else {
      const xGap = getNodeXGap(targetDepth);
      x = direction === Direction.RIGHT ? (sourceBBox.x2 + xGap) : (sourceBBox.x - xGap - rectWidth);
    }

    let cy = 0;
    if (targetBBox1 !== null && targetBBox2 !== null) {
      cy = (targetBBox2.y + targetBBox1.y2) / 2;
    } else if (targetBBox1 !== null && targetBBox2 === null) {
      cy = targetBBox1.y2 + yOffset;

      // 由于grandchild节点的下线问题，所以向下偏移一点好看点。下同
      if (targetDepth > 1) cy += grandchildYOffset;
    } else if (targetBBox1 === null && targetBBox2 !== null) {
      cy = targetBBox2.y - yOffset;

      if (targetDepth > 1) cy += grandchildYOffset;
    } else {
      cy = sourceBBox.cy;
    }

    const y = cy - rectHeight / 2;

    const rectShape = this.drawRect({ x, y });
    const edgeShape = this.drawPath({
      sourceBBox,
      targetBBox: rectShape.getBBox(),
      targetDepth,
      direction,
    });

    this.shapeSet = paper.set().push(rectShape).push(edgeShape);
  }

  public remove(): void {
    this.shapeSet.remove();
  }

  private drawRect({ x, y }: { x: number; y: number; }) {
    const rectShape = this.paper.rect(x, y, rectWidth, rectHeight, 6);
    rectShape.attr({
      'fill': '#E74C3C',
      'stroke-opacity': 0,
      'opacity': 0.8,
    });
    return rectShape;
  }

  private drawPath({
    sourceBBox,
    targetBBox,
    targetDepth,
    direction,
  }: {
    sourceBBox: RaphaelAxisAlignedBoundingBox;
    targetBBox: RaphaelAxisAlignedBoundingBox;
    targetDepth: number;
    direction: Direction;
  }): RaphaelElement {
    const edgeShape = targetDepth === 1 ?
      drawFirstEdge({
        paper: this.paper,
        sourceBBox,
        targetBBox,
        direction,
      }) :
      drawGrandChildEdge({
        paper: this.paper,
        sourceBBox,
        targetBBox,
        direction,
        targetDepth,
      });

    edgeShape.attr({
      stroke: '#E74C3C',
      'stroke-width': 2,
      opacity: 0.6,
    });

    return edgeShape;
  }
}

export default DragTempNodeShape;
