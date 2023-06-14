import * as Y from 'yjs';
import { updateNodeDataMap, getFatherDatas } from './data-helper';
import { Direction } from '../types';
import type { NodeData } from '../types';

class ChangeFatherHandler {
  public constructor(
    private readonly ydoc: Y.Doc,
    private readonly nodeDataMap: Y.Map<NodeData>,
  ) { }

  public changeFather({
    selectionId, newFatherId, direction, childIndex,
  }: {
    selectionId: string;
    newFatherId: string;
    direction: Direction;
    childIndex?: number;
  }): void {
    this.ydoc.transact(() => {
      // 删除与原父节点的关系
      const [selectionFatherId, selectionFather] = getFatherDatas(this.nodeDataMap, selectionId);
      const selectionBrothers = selectionFather.children;
      let selectionIndex = selectionBrothers.findIndex((brotherId) => brotherId === selectionId);
      selectionIndex = selectionIndex === undefined ? -1 : selectionIndex;
      if (selectionIndex > -1) {
        selectionBrothers.splice(selectionIndex, 1);
        updateNodeDataMap(this.nodeDataMap, selectionFatherId, {
          children: selectionBrothers,
        });
      }

      // 建立与新父节点的关系
      const newFatherData = this.nodeDataMap.get(newFatherId)!;
      const newBrothers = newFatherData.children;

      const newChildIndex = childIndex === undefined ? newBrothers.length : childIndex;
      if (newFatherData.isRoot) {
        this.spliceChildInRoot({
          children: newBrothers,
          start: newChildIndex,
          childId: selectionId,
          direction,
        });
      } else {
        newBrothers.splice(newChildIndex, 0, selectionId);
      }

      updateNodeDataMap(this.nodeDataMap, newFatherId, {
        children: newBrothers,
        isExpand: true,
      });

      // 改变方向
      this.changeDirection(selectionId, direction);
    });
  }

  private spliceChildInRoot({
    children, start, childId, direction,
  }: {
    children: string[];
    start: number;
    childId: string;
    direction: Direction;
  }): void {
    let directionStart = -1;
    let directionIndex = 0;
    let i = 0;

    for (i = 0; i < children.length; i++) {
      const childData = this.nodeDataMap.get(children[i]);
      if (childData?.direction !== direction) {
        continue;
      }
      if (start === directionIndex) {
        directionStart = i;
        break;
      }
      directionIndex++;
    }

    if (directionStart === -1) {
      directionStart = i;
    }

    children.splice(directionStart, 0, childId);
  }

  private changeDirection(id: string, direction: Direction): void {
    const nodeData = this.nodeDataMap.get(id);
    if (!nodeData) return;

    updateNodeDataMap(this.nodeDataMap, id, {
      direction,
    });

    nodeData.children.forEach((childId) => this.changeDirection(childId, direction));
  }
}

export default ChangeFatherHandler;
