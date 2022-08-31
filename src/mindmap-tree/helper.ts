export enum DepthType {
  root = 0,
  firstLevel,
  grandchild,
}

export function getDepthType(depth: number): DepthType {
  if (depth === 0) {
    return DepthType.root;
  } else if (depth === 1) {
    return DepthType.firstLevel;
  }
  return DepthType.grandchild;
}