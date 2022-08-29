// import TreeNode from './node';

// interface ChildrenPositionMap {
//   [id: string]: {
//     x: number;
//     y: number;
//   }
// }

// function getAreaHeight(
//   treeNode: TreeNode,
//   treeNodes: TreeNode[]
// ): number {
//   const childrenCount = treeNode.getModelChildren()?.length || 0;

//   if (childrenCount === 0) {
//     if (treeNode.depth === 1) {
//       return 52 + 40;
//     } else if (treeNode.depth === 2) {
//       return 37 + 40;
//     } else {
//       return 26.5 + 16;
//     }
//   }

//   return treeNode.getModelChildren()?.reduce((total, childId) => {
//     const childTreeNode = treeNodes.find((item) => item.getId() === childId);

//     if (!childTreeNode) {
//       return total;
//     }

//     return total + getAreaHeight(childTreeNode, treeNodes);
//   }, 0);
// }

// export function getChildrenPosition(
//   treeNode: TreeNode,
//   treeNodes: TreeNode[],
// ): ChildrenPositionMap {
//   const { x, y, x2, y2, cx, cy, width, height, } = treeNode.getBBox();
//   const depth = treeNode.depth;
//   const direction = treeNode.getDirection();
//   const childrenPositionMap: ChildrenPositionMap = {};
//   const childAreaHeightMap: Record<string, number> = {};
//   let areaHeight = 0;

//   // todo 根节点：leftChildren和rightChildren
//   // todo 获取areaHeight，通过虚拟获取
//   treeNode.getModelChildren()?.forEach((childId) => {
//     const childTreeNode = treeNodes.find((item) => item.getId() === childId);

//     if (!childTreeNode) {
//       return;
//     }

//     if (!childAreaHeightMap[childId]) {
//       childAreaHeightMap[childId] = getAreaHeight(childTreeNode!, treeNodes);
//       areaHeight += childAreaHeightMap[childId];
//     }
//   });

//   let startY = cy - (areaHeight / 2);

//   treeNode?.getModelChildren()?.forEach((childId) => {
//     const childTreeNode = treeNodes.find((item) => item.getId() === childId);
//     const childDirection = childTreeNode?.getDirection();
//     const childAreaHeight = childAreaHeightMap[childId];

//     if (depth === 1) {
//       // 根节点
//       const nodeXInterval = 40;

//       // todo 这里是不是有点不对？
//       const childX = cx + childDirection * (nodeXInterval + (width / 2));
//       // todo 52是魔数
//       const childY = startY + childAreaHeight / 2 - (52 / 2);

//       childrenPositionMap[childId] = {
//         x: childX,
//         y: childY,
//       }
//     } else if (depth === 2) {
//       // 第一层节点
//       const nodeXInterval = 40;

//       // todo 这里是不是有点不对？
//       const childX = cx + childDirection * (nodeXInterval + (width / 2));
//       // todo 37是魔数
//       const childY = startY + childAreaHeight / 2 - (37 / 2);

//       childrenPositionMap[childId] = {
//         x: childX,
//         y: childY,
//       }

//     } else {
//       const nodeXInterval = 40;

//       // todo 这里是不是有点不对？
//       const childX = cx + childDirection * (nodeXInterval + (width / 2));
//       // todo 37是魔数
//       const childY = startY + childAreaHeight / 2 - (26.5 / 2);

//       childrenPositionMap[childId] = {
//         x: childX,
//         y: childY,
//       }
//     }

//     startY += childAreaHeight;
//   })

//   return childrenPositionMap;
// }

import { RaphaelAxisAlignedBoundingBox } from 'raphael';
import type { NodeData } from './tree';

function getAreaHeight(currentData: NodeData, nodeDataList: NodeData[], depth: number): number {
  if (!currentData) { return 0; }

  const { children, } = currentData;

  if (children.length === 0) {
    if (depth === 1) {
      return 52 + 40;
    } else if (depth === 2) {
      return 37 + 40;
    } else {
      return 26.5 + 16;
    }
  }

  const childDataList = nodeDataList.filter((nodeData) => children.includes(nodeData.id)) || [];

  return childDataList.reduce((total: number, childNodeData) => {
    return total + getAreaHeight(childNodeData, nodeDataList, depth + 1);
  }, 0);
}

type ChildrenPositionMap = Record<string, {
  x: number;
  y: number;
}>

// todo 缓存位置
export function getChildrenPosition(currentData: NodeData, nodeDataList: NodeData[], nodeBBox: RaphaelAxisAlignedBoundingBox, depth: number): ChildrenPositionMap {
  const { x, y, x2, y2, cx, cy, width, height, } = nodeBBox;
  const { children, } = currentData;

  const childDataList = nodeDataList.filter((nodeData) => children.includes(nodeData.id)) || [];

  // 先算出子节点的areaHeight高度
  const childAreaHeightMap = childDataList.reduce((childAreaHeightMap: Record<string, number>, childData) => {
    childAreaHeightMap[childData.id] = getAreaHeight(childData, nodeDataList, depth + 1);
    return childAreaHeightMap;
  }, {});

  const areaHeight = childDataList.reduce((total, childData) => {
    return total + childAreaHeightMap[childData.id];
  }, 0);

  let startY = cy - (areaHeight / 2);

  const childrenPositionMap = childDataList.reduce((childrenPositionMap: ChildrenPositionMap, childData) => {
    const { id: childId, direction: childDirection, } = childData;
    const childAreaHeight = childAreaHeightMap[childId] || 0;

    if (!childDirection || childrenPositionMap[childId]) {
      return childrenPositionMap;
    }

    if (depth === 1) {
      // 根节点
      const nodeXInterval = 40;

      // todo 这里是不是有点不对？
      const childX = cx + childDirection * (nodeXInterval + (width / 2));
      // todo 52是魔数
      const childY = startY + childAreaHeight / 2 - (52 / 2);

      childrenPositionMap[childId] = {
        x: childX,
        y: childY,
      }
    } else if (depth === 2) {
      // 第一层节点
      const nodeXInterval = 40;

      // todo 这里是不是有点不对？
      const childX = cx + childDirection * (nodeXInterval + (width / 2));
      // todo 37是魔数
      const childY = startY + childAreaHeight / 2 - (37 / 2);

      childrenPositionMap[childId] = {
        x: childX,
        y: childY,
      }

    } else {
      const nodeXInterval = 40;

      // todo 这里是不是有点不对？
      const childX = cx + childDirection * (nodeXInterval + (width / 2));
      // todo 37是魔数
      const childY = startY + childAreaHeight / 2 - (26.5 / 2);

      childrenPositionMap[childId] = {
        x: childX,
        y: childY,
      }
    }

    startY += childAreaHeight;

    return childrenPositionMap;
  }, {});

  return childrenPositionMap;
}
