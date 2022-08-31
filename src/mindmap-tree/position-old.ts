import { RaphaelAxisAlignedBoundingBox } from 'raphael';
import type { NodeData } from './tree';
import { Direction } from './types';

function getAreaHeight(currentData: NodeData, nodeDataList: NodeData[], depth: number, brotherCount: number): number {
  if (!currentData) { return 0; }

  const { children, direction } = currentData;

  if (children.length === 0) {
    if (depth === 1) {
      return 37;
      // return 37 + 40;
    } else if (depth > 1) {
      return 26.5
      // return 26.5 + 16;
    }
  }

  const childDataList = nodeDataList.filter((nodeData) => {
    return children.includes(nodeData.id) && nodeData.direction === direction;
  }) || [];

  return childDataList.reduce((total: number, childNodeData) => {
    const areaHeight = getAreaHeight(childNodeData, nodeDataList, depth + 1, childDataList.length);
    return total + areaHeight;
    // return total + getAreaHeight(childNodeData, nodeDataList, depth + 1, childDataList.length);
  }, 0);

  // console.log('depth', depth);
  // let singleGap = 0;

  // if (depth === 1) {
  //   singleGap = 40;
  // } else if (depth > 1) {
  //   singleGap = 16;
  // }

  // const gapTotalHeight = (childDataList.length - 1) * singleGap;

  // return nodeTotalHeight + gapTotalHeight;
}

type ChildrenPositionMap = Record<string, {
  x: number;
  y: number;
}>

// todo 缓存位置
export function getChildrenPosition(currentData: NodeData, nodeDataList: NodeData[], nodeBBox: RaphaelAxisAlignedBoundingBox, depth: number): ChildrenPositionMap {
  const { cx, cy, width, } = nodeBBox;
  const { children, } = currentData;

  const childDataList = nodeDataList.filter((nodeData) => children.includes(nodeData.id)) || [];

  // 先算出各子节点的areaHeight高度
  const childAreaHeightMap = childDataList.reduce((childAreaHeightMap: Record<string, number>, childData) => {
    childAreaHeightMap[childData.id] = getAreaHeight(childData, nodeDataList, depth + 1, childDataList.length);
    return childAreaHeightMap;
  }, {});

  // 子节点总高度
  const totalAreaHeight = childDataList.reduce((total, childData) => {
    return total + childAreaHeightMap[childData.id];
  }, 0);
  console.log('totalAreaHeight', totalAreaHeight);

  let startY = cy - (totalAreaHeight / 2);

  // const leftChildrenCount = childDataList.reduce((count, childData) => {
  //   if (childData.direction === Direction.LEFT) {
  //     return count + 1;
  //   }
  //   return count;
  // }, 0);

  // const rightChildrenCount = childDataList.reduce((count, childData) => {
  //   if (childData.direction === Direction.RIGHT) {
  //     return count + 1;
  //   }
  //   return count;
  // }, 0);

  const childrenPositionMap = childDataList.reduce((childrenPositionMap: ChildrenPositionMap, childData) => {
    const { id: childId, direction: childDirection, } = childData;
    const childAreaHeight = childAreaHeightMap[childId] || 0;

    if (!childDirection || childrenPositionMap[childId]) {
      return childrenPositionMap;
    }


    // 根节点
    if (depth === 0) {
      // const nodeXInterval = 40;

      // if (childData.direction === Direction.LEFT && leftChildrenCount <= 2) {

      // } else if (childData.direction === Direction.RIGHT && rightChildrenCount <= 2) {
      //   const childX = cx + childDirection * (nodeXInterval + (width / 2));
      //   const childY = cy
      // } else {

      //   // todo 这里是不是有点不对？
      //   const childX = cx + childDirection * (nodeXInterval + (width / 2));
      //   // todo 52是魔数
      //   const childY = startY + childAreaHeight / 2 - (52 / 2);

      //   childrenPositionMap[childId] = {
      //     x: childX,
      //     y: childY,
      //   }
      // }


      const nodeXInterval = 40;

      const childX = cx + childDirection * (nodeXInterval + (width / 2));
      const childNodeHeight = 37;
      const childY = startY + childAreaHeight / 2 - (childNodeHeight / 2);

      childrenPositionMap[childId] = {
        x: childX,
        y: childY,
      }


    } else if (depth >= 1) {
      // 第一层节点
      const nodeXInterval = 40;

      // todo 这里是不是有点不对？
      const childX = cx + childDirection * (nodeXInterval + (width / 2));
      // todo 37是魔数
      const childNodeHeight = 26.5;
      const childY = startY + childAreaHeight / 2 - (childNodeHeight / 2);

      childrenPositionMap[childId] = {
        x: childX,
        y: childY,
      }

    } 
    // else {
    //   const nodeXInterval = 40;

    //   // todo 这里是不是有点不对？
    //   const childX = cx + childDirection * (nodeXInterval + (width / 2));
    //   // todo 37是魔数
    //   const childY = startY + childAreaHeight / 2 - (26.5 / 2);

    //   childrenPositionMap[childId] = {
    //     x: childX,
    //     y: childY,
    //   }
    // }

    startY += childAreaHeight;

    return childrenPositionMap;
  }, {});

  return childrenPositionMap;
}
