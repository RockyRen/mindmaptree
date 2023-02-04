import Node from '../node/node';
import { Direction } from '../types';
import { getNodeYGap } from '../shape/gap';
import DragTemp from './drag-temp';
import DrawDragArea from './draw-drag-area';
import type { RaphaelPaper } from 'raphael';

interface AreaBox {
  x: number;
  y: number;
  x2: number;
  y2: number;
}

export interface Area {
  node: Node;
  areaBox: AreaBox;
  direction: Direction;
  childrenYList: number[];
}

interface HitAreaData {
  father: Node;
  childIndex: number;
  isOwnArea: boolean;
  direction: Direction;
}

export type HitArea = HitAreaData | null;

const rootYPatchGap = 80;
const leafAreaWidth = 100;

class DragArea {
  private readonly root: Node;
  private readonly drawDragArea: DrawDragArea | null = null;
  private readonly dragTemp: DragTemp;
  private areaList: Area[] = [];
  private hitArea: HitArea = null;
  public constructor(
    paper: RaphaelPaper,
    private readonly node: Node,
  ) {
    this.dragTemp = new DragTemp(paper, node);
    this.drawDragArea = new DrawDragArea(paper);
    this.root = node.getRoot()!;
  }

  public drawTemp(x: number, y: number): void {
    const newHitArea = this.getHitArea(x, y);
    if (!this.isSameHitArea(this.hitArea, newHitArea)) {
      this.dragTemp.draw(newHitArea);
      this.hitArea = newHitArea;
    }
  }

  public init(): void {
    this.areaList = this.getAreaList(this.root);
    this.drawDragArea?.draw(this.areaList);
  }

  public clear(): void {
    this.areaList = [];
    this.drawDragArea?.clear();
    this.dragTemp.clear();
  }

  public getCurrentHitArea(): HitArea {
    return this.hitArea;
  }

  private getHitArea(x: number, y: number): HitArea {
    for (let i = 0; i < this.areaList.length; i++) {
      const { node, areaBox, childrenYList, direction } = this.areaList[i];

      if (x >= areaBox.x && x <= areaBox.x2 && y >= areaBox.y && y <= areaBox.y2) {
        if (!childrenYList || childrenYList.length === 0 || node.isExpand === false) {
          return {
            father: node,
            childIndex: 0,
            isOwnArea: this.isOwnArea(node, 0, direction),
            direction,
          }
        }
        for (let i = 0; i < childrenYList.length - 1; i++) {
          if (y >= childrenYList[i] && y < childrenYList[i + 1]) {
            return {
              father: node,
              childIndex: i,
              isOwnArea: this.isOwnArea(node, i, direction),
              direction,
            }
          }
        }
      }
    }

    return null;
  }

  // Check if hit the dragging node or not
  private isOwnArea(father: Node, childIndex: number, direction: Direction): boolean {
    const brothers = this.node.father?.getDirectionChildren(direction);
    const currentNodeIndex = brothers?.findIndex((child) => child.id === this.node.id);

    return father?.id === this.node.father?.id
      && currentNodeIndex !== undefined && currentNodeIndex > -1
      && (childIndex === currentNodeIndex || childIndex === currentNodeIndex + 1)
  }

  private isSameHitArea(hitArea1: HitArea, hitArea2: HitArea) {
    return (
      hitArea1?.father.id === hitArea2?.father.id
      && hitArea1?.childIndex === hitArea2?.childIndex
      && hitArea1?.direction === hitArea2?.direction
    );
  }

  // Sequence traversal
  private getAreaList(root: Node): Area[] {
    const areaList: Area[] = [];

    const queue: {
      node: Node;
      direction: Direction
    }[] = [{
      node: root,
      direction: Direction.RIGHT
    }, {
      node: root,
      direction: Direction.LEFT
    }
      ];

    while (queue.length > 0) {
      const queueLength = queue.length;

      for (let i = 0; i < queueLength; i++) {
        const {
          node: current,
          direction,
        } = queue.shift()!;

        if (this.node.id === current.id || current.father?.isExpand === false) {
          continue;
        }

        const area = this.getArea(current, direction);
        areaList.unshift(area);

        current.getDirectionChildren(direction).forEach((child) => queue.push({
          node: child,
          direction: direction,
        }));
      }
    }

    return areaList;
  }

  private getArea(node: Node, direction: Direction): Area {
    const areaBox = { x: 0, y: 0, x2: 0, y2: 0 };
    const nodeBBox = node.getBBox();
    const children = node.getDirectionChildren(direction);

    let startY = 0;
    let endY = 0;

    if (children.length === 0 || !node.isExpand) {
      startY = nodeBBox.y;
      endY = nodeBBox.y2;
    } else {
      const firstChild = children[0];
      const lastChild = children[children.length - 1];

      startY = firstChild.getBBox().y;
      endY = lastChild.getBBox().y2;
    }

    const yGap = this.getNodeYGap(node);
    startY -= yGap;
    endY += yGap;

    const childBoundaryX = this.getChildBoundaryX(node, direction);

    areaBox.y = startY;
    areaBox.y2 = endY;

    if (node.isRoot()) {
      areaBox.x = direction === Direction.RIGHT ? nodeBBox.cx : childBoundaryX;
      areaBox.x2 = direction === Direction.RIGHT ? childBoundaryX : nodeBBox.cx;
    } else {
      areaBox.x = direction === Direction.RIGHT ? nodeBBox.x2 : childBoundaryX;
      areaBox.x2 = direction === Direction.RIGHT ? childBoundaryX : nodeBBox.x;
    }

    const childrenYList = this.getChildrenYList(children, areaBox);

    return {
      node,
      areaBox: areaBox,
      direction,
      childrenYList,
    }
  }

  private getChildrenYList(children: Node[], areaBox: AreaBox): number[] {
    const childrenYList = [areaBox.y];

    children.forEach((child) => {
      const childBBox = child.getBBox();
      childrenYList.push(childBBox.cy);
    });

    childrenYList.push(areaBox.y2);

    return childrenYList;
  }

  private getNodeYGap(node: Node): number {
    const patchY = node.isRoot() ? rootYPatchGap : 0;
    return (getNodeYGap(node.depth) + patchY) / 2;
  }

  private getChildBoundaryX(node: Node, direction: Direction): number {
    const children = node.getDirectionChildren(direction);

    if (children.length === 0 || node.isExpand === false) {
      const nodeBBox = node.getBBox();
      return direction === Direction.RIGHT ? nodeBBox.x2 + leafAreaWidth : nodeBBox.x - leafAreaWidth;
    }

    let maxWidthChild = children[0];
    let max = maxWidthChild.getBBox().width;
    for (let i = 1; i < children.length; i++) {
      const child = children[i];
      const childBBox = child.getBBox();
      if (childBBox.width > max) {
        max = childBBox.width;
        maxWidthChild = child;
      }
    }

    const maxWidthChildBBox = maxWidthChild.getBBox();

    return direction === Direction.RIGHT ? maxWidthChildBBox.x2 : maxWidthChildBBox.x;
  }
}

export default DragArea;
