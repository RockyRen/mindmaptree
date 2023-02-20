import Raphael from 'raphael';
import MultiSelectShape from '../shape/multi-select-shape';
import Viewport from '../viewport';
import Node from '../node/node';
import Selection from './selection';
import PaperWrapper from '../paper-wrapper';
import ToolOperation from '../tool-operation';
import { isMobile } from '../helper';

const validDiff = 2;

class MultiSelect {
  private readonly multiSelectShape: MultiSelectShape;
  private readonly viewport: Viewport;
  private readonly selection: Selection;
  private readonly svgDom: SVGSVGElement | null;
  private readonly toolOperation: ToolOperation;
  private allNodes: Node[] = [];
  private preSelectNodes: Node[] = [];
  private able: boolean = true;
  private isStart: boolean = false;
  private isMoveInited: boolean = false;
  private lastClientX: number = 0;
  private lastClientY: number = 0;
  public constructor({
    paperWrapper,
    viewport,
    toolOperation,
    selection,
  }: {
    paperWrapper: PaperWrapper;
    viewport: Viewport;
    toolOperation: ToolOperation;
    selection: Selection;
  }) {
    const paper = paperWrapper.getPaper();
    this.svgDom = paperWrapper.getSvgDom();
    this.multiSelectShape = new MultiSelectShape(paper);
    this.viewport = viewport;
    this.selection = selection;
    this.toolOperation = toolOperation;

    if (isMobile) {
      this.svgDom?.addEventListener('touchstart', this.handleTouchstart, false);
    } else {
      this.svgDom?.addEventListener('mousedown', this.handleMousedown);
      this.svgDom?.addEventListener('mousemove', this.handleMousemove);
      this.svgDom?.addEventListener('mouseup', this.handleMouseup);
    }
  }

  public disable(): void {
    this.able = false;
  }

  public enable(): void {
    this.able = true;
  }

  public clear(): void {
    if (isMobile) {
      this.svgDom?.removeEventListener('touchstart', this.handleTouchstart, false);
    } else {
      this.svgDom?.removeEventListener('mousedown', this.handleMousedown);
      this.svgDom?.removeEventListener('mousemove', this.handleMousemove);
      this.svgDom?.removeEventListener('mouseup', this.handleMouseup);
    }
  }

  private handleTouchstart = (): void => {
    this.selection.empty();
  }

  private handleMousedown = (event: MouseEvent): void => {
    if (!this.able) {
      return;
    }

    this.isStart = true;
    this.lastClientX = event.clientX;
    this.lastClientY = event.clientY;

    this.selection.empty();
  }

  private handleMousemove = (event: MouseEvent): void => {
    if (!this.isStart) return;

    const { clientX, clientY } = event;
    const dx = this.lastClientX - clientX;
    const dy = this.lastClientY - clientY;

    if (!this.isMoveInited && (Math.abs(dx) > validDiff || Math.abs(dy) > validDiff)) {
      const viewportPosition = this.viewport.getViewportPosition(event.clientX, event.clientY);
      this.multiSelectShape.init(viewportPosition.x, viewportPosition.y);

      const nodeMap = this.toolOperation.getNodeMap();
      this.allNodes = Object.keys(nodeMap).map((nodeId) => {
        return nodeMap[nodeId];
      });

      this.isMoveInited = true;
    }

    if (this.isMoveInited) {
      const viewportPosition = this.viewport.getViewportPosition(event.clientX, event.clientY);
      this.multiSelectShape.resize(viewportPosition.x, viewportPosition.y);


      const intersectNodes = this.allNodes.filter((item) => {
        return Raphael.isBBoxIntersect(this.multiSelectShape.getBBox(), item.getBBox());
      }) || [];

      const selectedNodes = [];

      // multi select in order
      for (let i = 0; i < this.preSelectNodes.length; i++) {
        if (intersectNodes.includes(this.preSelectNodes[i])) {
          selectedNodes.push(this.preSelectNodes[i]);
        }
      }

      for (let i = 0; i < intersectNodes.length; i++) {
        if (!selectedNodes.includes(intersectNodes[i])) {
            selectedNodes.push(intersectNodes[i]);
        }
      }

      this.selection.select(selectedNodes);
      this.preSelectNodes = selectedNodes;
    }

    this.lastClientX = clientX;
    this.lastClientY = clientY;
  }

  private handleMouseup = (): void => {
    if (!this.isStart) return;

    this.multiSelectShape.hide();
    this.allNodes = [];
    this.preSelectNodes = [];
    this.isStart = false;
    this.isMoveInited = false;
    this.lastClientX = 0;
    this.lastClientY = 0;
  }
}

export default MultiSelect;
