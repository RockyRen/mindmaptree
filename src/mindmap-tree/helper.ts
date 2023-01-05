// todo 按照深度判断是否是根节点可能并不准确，因为可能有孤岛节点
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

export function generateId(): string {
  function S4(): string {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
 };
 return `${S4()}${S4()}-${S4()}${S4()}${S4()}`;
}
