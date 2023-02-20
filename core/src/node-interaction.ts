import NodeCreator from "./node/node-creator";
import Node from './node/node';
import Selection from './selection/selection';
import TextEditor from "./text-editor";
import { HitArea } from "./drag/drag-area";
import DataProxy from "./data/data-proxy";
import TreeOperation from "./tree/tree-operation";
import { isMobile } from './helper';

class NodeInteraction {
  public constructor({
    nodeCreator,
    selection,
    textEditor,
    dataProxy,
    treeOperation,
  }: {
    nodeCreator: NodeCreator;
    selection: Selection;
    textEditor: TextEditor;
    dataProxy: DataProxy;
    treeOperation: TreeOperation;
  }) {
    const mousedownName = isMobile ? 'touchstart' : 'mousedown';

    nodeCreator.on(mousedownName, (node: Node, event: MouseEvent) => {
      event.stopPropagation();
      selection.selectSingle(node);
    });

    nodeCreator.on('dblclick', () => {
      textEditor.showBySelectionLabel();
    });

    nodeCreator.on('dragEnd', (node: Node, hitArea: HitArea) => {
      if (hitArea !== null && !hitArea.isOwnArea) {
        treeOperation.changeFather?.({
          newFather: hitArea.father,
          direction: hitArea.direction,
          nodes: [node],
          childIndex: hitArea.childIndex,
        });
      }
    });

    nodeCreator.on('mousedownExpander', (node: Node, isExpand) => {
      dataProxy.setData(node.id, {
        isExpand,
      });
      selection.select([node]);
    });
  }
}

export default NodeInteraction;