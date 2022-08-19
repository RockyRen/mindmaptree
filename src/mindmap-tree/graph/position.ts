import TreeNode from './tree-node';

interface ChildrenPositionMap {
  [id: string]: {
    x: number;
    y: number;
  }
}

function getAreaHeight(
  treeNode: TreeNode,
  treeNodes: TreeNode[]
): number {
  const childrenCount = treeNode.getModelChildren()?.length || 0;

  if (childrenCount === 0) {
    if (treeNode.depth === 1) {
      return 52 + 40;
    } else if (treeNode.depth === 2) {
      return 37 + 40;
    } else {
      return 26.5 + 16;
    }
  }

  return treeNode.getModelChildren()?.reduce((total, childId) => {
    const childTreeNode = treeNodes.find((item) => item.getId() === childId);

    if (!childTreeNode) {
      return total;
    }

    return total + getAreaHeight(childTreeNode, treeNodes);
  }, 0);
}

export function getChildrenPosition(
  treeNode: TreeNode,
  treeNodes: TreeNode[],
): ChildrenPositionMap {
  const { x, y, x2, y2, cx, cy, width, height, } = treeNode.getBBox();
  const depth = treeNode.depth;
  const direction = treeNode.getDirection();
  const childrenPositionMap: ChildrenPositionMap = {};
  const childAreaHeightMap: Record<string, number> = {};
  let areaHeight = 0;

  // todo 获取areaHeight，通过虚拟获取
  treeNode.getModelChildren()?.forEach((childId) => {
    const childTreeNode = treeNodes.find((item) => item.getId() === childId);

    if (!childTreeNode) {
      return;
    }

    if (!childAreaHeightMap[childId]) {
      childAreaHeightMap[childId] = getAreaHeight(childTreeNode!, treeNodes);
      areaHeight += childAreaHeightMap[childId];
    }
  });

  let startY = cy - (areaHeight / 2);

  treeNode?.getModelChildren()?.forEach((childId) => {
    const childTreeNode = treeNodes.find((item) => item.getId() === childId);
    const childDirection = childTreeNode?.getDirection();
    const childAreaHeight = childAreaHeightMap[childId];

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
  })

  return childrenPositionMap;
}