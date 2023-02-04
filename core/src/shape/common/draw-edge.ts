import { RaphaelPaper, RaphaelAxisAlignedBoundingBox, RaphaelElement } from 'raphael';
import { Direction } from '../../types';
import { expanderBoxWidth } from '../expander-shape';

export const drawFirstEdge = ({
  paper,
  sourceBBox,
  targetBBox,
  direction,
}: {
  paper: RaphaelPaper;
  sourceBBox: RaphaelAxisAlignedBoundingBox;
  targetBBox: RaphaelAxisAlignedBoundingBox;
  direction: Direction;
}): RaphaelElement => {
  // 起点
  const x1 = sourceBBox.cx;
  const y1 = sourceBBox.cy;
  // 终点
  const x2 = direction === Direction.LEFT ? targetBBox.x2 : targetBBox.x;
  const y2 = targetBBox.cy;

  const k1 = 0.8;
  const k2 = 0.2;
  // 贝塞尔曲线控制点
  const x3 = x2 - k1 * (x2 - x1);
  const y3 = y2 - k2 * (y2 - y1);

  return paper.path(`M${x1} ${y1}Q${x3} ${y3} ${x2} ${y2}`);
};

export const drawGrandChildEdge = ({
  paper,
  sourceBBox,
  targetBBox,
  direction,
  targetDepth,
  hasUnder = false,
}: {
  paper: RaphaelPaper;
  sourceBBox: RaphaelAxisAlignedBoundingBox;
  targetBBox: RaphaelAxisAlignedBoundingBox;
  direction: Direction;
  targetDepth: number;
  hasUnder?: boolean;
}): RaphaelElement => {
  let shortX = 0;
  let shortY = 0;
  let connectX = 0;
  let connectY = 0;
  let targetX = 0;
  let targetY = 0;
  let targetUnderEndX = 0;
  let targetUnderEndY = 0;

  if (direction === Direction.RIGHT) {
    shortX = sourceBBox.x2;
    connectX = shortX + expanderBoxWidth;
    targetX = targetBBox.x;
    targetUnderEndX = targetBBox.x2;
  } else {
    shortX = sourceBBox.x;
    connectX = shortX - expanderBoxWidth;
    targetX = targetBBox.x2;
    targetUnderEndX = targetBBox.x;
  }

  if (targetDepth === 2) {
    shortY = sourceBBox.cy;
  } else {
    shortY = sourceBBox.y2;
  }

  connectY = shortY;
  targetY = hasUnder ? targetBBox.y2 : targetBBox.cy;
  targetUnderEndY = targetY;

  const connectPathStr = createConnectPathStr(connectX, connectY, targetX, targetY);
  let pathStr = `M${shortX} ${shortY} L${connectX} ${connectY} ${connectPathStr}`;

  if (hasUnder) {
    pathStr += ` M ${targetX} ${targetY} L${targetUnderEndX} ${targetUnderEndY}`;
  }

  return paper.path(pathStr);
};

const createConnectPathStr = (x1: number, y1: number, x2: number, y2: number): string => {
  const control1XFactor = 0.3;
  const control1YFactor = 0.76;
  const control1X = x1 + control1XFactor * (x2 - x1);
  const control1Y = y1 + control1YFactor * (y2 - y1);

  const control2XFactor = 0.5;
  const control2YFactor = 0;
  const control2X = x2 - control2XFactor * (x2 - x1);
  const control2Y = y2 - control2YFactor * (y2 - y1);

  return `M${x1} ${y1}C${control1X} ${control1Y} ${control2X} ${control2Y} ${x2} ${y2}`;
};

