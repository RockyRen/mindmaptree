import NodeCreator from "./node/node-creator";
import Node from './node/node';
import Selection from './selection/selection';
import TextEditor from "./text-editor";
import { HitArea } from "./drag/drag-area";
import DataHandler from './data/data-handler';
import { isMobile } from './helper';

class NodeInteraction {
  public constructor({
    nodeCreator,
    selection,
    textEditor,
    dataHandler,
  }: {
    nodeCreator: NodeCreator;
    selection: Selection;
    textEditor: TextEditor;
    dataHandler: DataHandler;
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
        dataHandler.changeFather({
          selectionId: node.id,
          newFatherId: hitArea.father.id,
          direction: hitArea.direction,
          childIndex: hitArea.childIndex,
        });
      }
    });

    nodeCreator.on('mousedownExpander', (node: Node, isExpand) => {
      dataHandler.update(node.id, {
        isExpand,
      })
      selection.select([node]);
    });
  }
}

export default NodeInteraction;