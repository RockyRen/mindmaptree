import { DepthType, getDepthType } from '../helper';

const firstLevelXGap = 40;
const firstLevelYGap = 25;

const grandchildXGap = 24;
const grandchildYGap = 15;

export function getNodeYGap(depth: number): number {
  return getDepthType(depth) === DepthType.firstLevel ? firstLevelYGap : grandchildYGap;
}

export function getNodeXGap(depth: number): number {
  return getDepthType(depth) === DepthType.firstLevel ? firstLevelXGap : grandchildXGap;
}
