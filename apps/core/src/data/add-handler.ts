import * as Y from 'yjs';
import { Direction } from '../types';
import { DepthType } from '../helper';
import { updateNodeDataMap, getFatherDatas } from './data-helper';
import type { NodeData } from '../types';

const firstLevetNodeName = 'Main Topic';
const grandchildNodeName = 'Subtopic';

class AddHandler {
  public constructor(
    private readonly ydoc: Y.Doc,
    private readonly nodeDataMap: Y.Map<NodeData>,
  ) { }

  public addChildNode(selectionId: string, depth: number, newId: string): void {
    const selectionData = this.nodeDataMap.get(selectionId);
    if (!selectionData) return;

    // If node is root, then add node equally to each direction
    let direction = selectionData.direction;
    if (selectionData.isRoot) {
      const directionCounts = selectionData.children?.reduce((counts: number[], childId) => {
        const childData = this.nodeDataMap.get(childId);
        if (childData?.direction === Direction.LEFT) {
          counts[0] += 1;
        } else {
          counts[1] += 1;
        }
        return counts;
      }, [0, 0]);
      direction = directionCounts[1] > directionCounts[0] ? Direction.LEFT : Direction.RIGHT;
    }

    this.ydoc.transact(() => {
      this.nodeDataMap.set(newId, {
        label: depth === DepthType.firstLevel ? firstLevetNodeName : grandchildNodeName,
        direction,
        children: [],
      });

      const selectionChildren = this.nodeDataMap.get(selectionId)!.children;
      selectionChildren.push(newId);
      updateNodeDataMap(this.nodeDataMap, selectionId, {
        children: selectionChildren,
        isExpand: true,
      });
    });

  }

  public addBrotherNode(selectionId: string, depth: number, newId: string): void {
    const selectionData = this.nodeDataMap.get(selectionId);
    if (!selectionData) return;

    if (selectionData.isRoot) {
      return this.addChildNode(selectionId, depth, newId);
    }

    this.ydoc.transact(() => {
      this.nodeDataMap.set(newId, {
        label: depth === DepthType.firstLevel ? firstLevetNodeName : grandchildNodeName,
        direction: selectionData.direction,
        children: [],
      });

      const [fatherId, fatherData] = getFatherDatas(this.nodeDataMap, selectionId);
      const brothers = fatherData.children;
      brothers.push(newId);
      updateNodeDataMap(this.nodeDataMap, fatherId, {
        children: brothers,
        isExpand: true,
      });
    });
  }
}

export default AddHandler;
