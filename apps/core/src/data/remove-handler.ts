import * as Y from 'yjs';
import { getRootData } from './data-helper';
import type { NodeData } from '../types';

class RemoveHandler {
  public constructor(
    private readonly ydoc: Y.Doc,
    private readonly nodeDataMap: Y.Map<NodeData>,
  ) { }

  public removeNode(selecNodeIds: string[]): void {
    const rootData = getRootData(this.nodeDataMap);
    const topNodeIds = this.getTopNodeIdsInner(['', rootData], selecNodeIds);

    if (topNodeIds.length === 0) return;

    this.ydoc.transact(() => {
      topNodeIds.forEach((id) => this.removeNodeDataInner(id));
    });
  }

  private getTopNodeIdsInner([currentId, currentData]: [string, NodeData], selecNodeIds: string[]): string[] {
    if (!currentData) return [];

    if (!currentData.isRoot && selecNodeIds.includes(currentId)) {
      return [currentId];
    }

    let topNodeIds: string[] = [];

    currentData.children?.forEach((childId) => {
      const childTopIds = this.getTopNodeIdsInner([childId, this.nodeDataMap.get(childId)!], selecNodeIds);
      if (childTopIds.length > 0) {
        topNodeIds = topNodeIds.concat(childTopIds);
      }
    });

    return topNodeIds;
  }

  private removeNodeDataInner(removeId: string): void {
    const removeData = this.nodeDataMap.get(removeId);

    if (!removeData) return;
    removeData?.children.forEach((childId) => {
      this.removeNodeDataInner(childId);
    });

    this.nodeDataMap.delete(removeId);
  }
}

export default RemoveHandler;
