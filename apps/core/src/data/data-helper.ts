import * as Y from 'yjs';
import type { NodeData } from '../types';

export const updateNodeDataMap = (nodeDataMap: Y.Map<NodeData>, id: string, data: Partial<NodeData>): void => {
  const originData = nodeDataMap.get(id);
  if (!originData) return;

  const newData = {
    ...originData,
    ...data,
  };
  nodeDataMap.set(id, newData);
}

// todo 获取root，能不能不通过遍历？
export const getRootData = (nodeDataMap: Y.Map<NodeData>): NodeData => {
  let rootData: NodeData | undefined;
  const values = nodeDataMap.values() as Iterable<NodeData>;
  for (let value of values) {
    if (value.isRoot) {
      rootData = value;
    }
  }
  return rootData!;
}

// todo 获取father，能不能不通过遍历？
export const getFatherDatas = (nodeDataMap: Y.Map<NodeData>, id: string): [string, NodeData] => {
  const entries = nodeDataMap.entries() as Iterable<[string, NodeData]>;
  let fatherDatas: [string, NodeData] | undefined;
  for (let entry of entries) {
    if (entry[1].children.includes(id)) {
      fatherDatas = entry;
    }
  }
  return fatherDatas!;
}

