import { NodeData } from "./tree";
import { RaphaelAxisAlignedBoundingBox } from 'raphael';
import { Direction } from "./types";
import { DepthType, getDepthType } from "./helper";

// todo 放到同一个地方
const rootNodeHeight = 52;
const firstLevelNodeHeight = 37;
const grandchildNodeHeight = 27;

// todo
function getNodeHeight(depth: number): number {
  const depthType = getDepthType(depth);
  if (depthType === DepthType.root) {
    return rootNodeHeight;
  } else if (depthType === DepthType.firstLevel) {
    return firstLevelNodeHeight;
  }
  return grandchildNodeHeight;
}

interface PositionData {
  x: number;
  y: number;
}

class Position {
  private readonly nodeDataList: NodeData[];
  private readonly rootBBox: RaphaelAxisAlignedBoundingBox;
  private readonly positionDatas: Record<string, PositionData> = {};
  private readonly areaHeightMap: Record<string, number> = {};
  public constructor({
    nodeDataList,
    rootBBox,
  }: {
    nodeDataList: NodeData[];
    rootBBox: RaphaelAxisAlignedBoundingBox;
  }) {
    this.nodeDataList = nodeDataList;
    this.rootBBox = rootBBox;

    // todo rootData可能未被初始化
    const rootData = nodeDataList.find((item) => item.isRoot);
    if (!rootData) {
      return;
    }

    this.initPosition({
      currentData: rootData,
      depth: 0,
      direction: Direction.LEFT,
    });

    this.initPosition({
      currentData: rootData,
      depth: 0,
      direction: Direction.RIGHT,
    });

    // console.log('areaHeight----', this.areaHeightMap);
  }

  private initPosition({
    currentData,
    depth,
    direction,
  }: {
    currentData: NodeData;
    depth: number;
    direction: Direction;
  }): void {
    const currentAreaHeight = this.getAreaHeight(currentData, direction, depth);

    const childDataList = this.nodeDataList.filter((nodeData) => {
      return currentData.children.includes(nodeData.id) && nodeData.direction === direction;
    });

    // const 


    let startY = this.rootBBox.cy - (currentAreaHeight / 2);

    childDataList.forEach((childData) => {
      const childDepth = depth + 1;
      const childAreaHeight = this.getAreaHeight(childData, direction, childDepth);

      const nodeXInterval = 40;
      const childX = this.rootBBox.cx + direction * (nodeXInterval + this.rootBBox.width / 2);

      const childNodeHeight = getNodeHeight(childDepth);
      const childY = startY + (childAreaHeight / 2) - (childNodeHeight / 2);

      this.positionDatas[childData.id] = {
        x: childX,
        y: childY,
      };

      this.initPosition({
        currentData: childData,
        direction,
        depth: childDepth,
      });
    });
  }

  private getAreaHeight(currentData: NodeData, direction: Direction, depth: number): number {
    const areaKey = `${currentData.id}_${direction}`;
    if (this.areaHeightMap[areaKey]) {
      return this.areaHeightMap[areaKey];
    }
    let areaHeight = 0;

    const childDataList = this.nodeDataList.filter((nodeData) => {
      return currentData.children.includes(nodeData.id) && nodeData.direction === direction;
    });


    const depthType = getDepthType(depth);
    if (childDataList.length === 0 || childDataList.length === 1) {
      areaHeight = getNodeHeight(depth);
    } else {
      const childrenAreaHeight = childDataList.reduce((total, childData) => {
        const childAreaHeight = this.getAreaHeight(childData, direction, depth + 1);
        return total + childAreaHeight;
      }, 0);

      let gap = 0;
      if (depthType === DepthType.root) {
        gap = 60;
      } else if (depthType === DepthType.firstLevel) {
        gap = 40;
      } else {
        gap = 16;
      }

      areaHeight = childrenAreaHeight + (childDataList.length - 1) * gap;
    }

    this.areaHeightMap[currentData.id] = areaHeight;

    return areaHeight;
  }

  public getPosition(id: string): {
    x: number;
    y: number;
  } {
    const position = this.positionDatas[id];
    if (!position) {
      throw new Error(`The position of id:${id} is not existed`);
    }
    return position;
  }
}

export default Position;
