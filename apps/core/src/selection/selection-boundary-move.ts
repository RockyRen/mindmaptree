import Viewport from '../viewport';
import Selection from './selection';
import Node from '../node/node';

class SelectionBoundaryMove {
  private selectNodes: Node[];
  public constructor(selection: Selection, viewport: Viewport) {
    this.selectNodes = selection.getSelectNodes();

    selection.on('select', (selectNodes) => {
      const oldSelectNodes = this.selectNodes;
      this.selectNodes = selectNodes;
      const selectNode = selectNodes[0];

      if (selectNodes.length !== 1 || selectNode.isInvisible()) return;
      if (this.selectNodes[0].id && this.selectNodes[0].id === oldSelectNodes[0]?.id) return;

      const nodeBBox = selectNode.getBBox();
      const viewBox = viewport.getViewbox();
      let targetX = viewBox.x;
      let targetY = viewBox.y;

      if (nodeBBox.x < viewBox.x) {
        targetX = nodeBBox.x - 15;
      } else if (nodeBBox.x2 > viewBox.x + viewBox.width) {
        targetX = nodeBBox.x2 - viewBox.width + 15;
      }

      if (nodeBBox.y < viewBox.y) {
        targetY = nodeBBox.y - 15;
      } else if (nodeBBox.y2 > viewBox.y + viewBox.height) {
        targetY = nodeBBox.y2 - viewBox.height + 15;
      }

      if (targetX === viewBox.x && targetY === viewBox.y) return;

      viewport.translateTo(targetX, targetY);
    });
  }
}

export default SelectionBoundaryMove;
