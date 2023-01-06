import Raphael, { RaphaelSet, RaphaelAxisAlignedBoundingBox } from 'raphael';
import { DepthType } from '../helper';
import Node from '../node/node';
import ChangeFather from './change-father';
import type { CreateSingleNodeFunc } from '../tree';

interface AddableNode {
  bbox: RaphaelAxisAlignedBoundingBox;
  node: Node;
}

// 节点拖拽类
class Drag {
  private clonedNodeShapeSet: RaphaelSet | null = null;
  private lastOverlayNode?: Node;
  private lastDx: number = 0;
  private lastDy: number = 0;
  private addableNodeList: AddableNode[] = [];
  private delayTimer: ReturnType<typeof setTimeout> | null;

  public constructor(
    private readonly node: Node,
    private readonly createSingleNode: CreateSingleNodeFunc,
  ) {
    this.delayTimer = null;
    // 初始化时监听拖拽事件
    node.shapeExports.drag(this.move, this.start, this.end);
  }

  // 取消拖拽事件
  public unbind(): void {
    this.node.shapeExports.undrag();
  }

  private start = (): void => {
    this.clonedNodeShapeSet = this.node.shapeExports.cloneShape();
    this.clonedNodeShapeSet?.attr({
      opacity: 0,
    });

    // 在150毫秒后才改变节点原有样式，防止点击的时候的闪烁问题
    this.delayTimer = setTimeout(() => {
      this.node.shapeExports.opacityAll();
      this.clonedNodeShapeSet?.attr({
        opacity: 0.4,
      });
    }, 150);

    this.addableNodeList = this.getAddableNodeList();
  }

  // todo 是否要做？
  // todo 待做的性能优化：节流、遍历所有节点是否与拖拽节点重叠
  private move = (dx: number, dy: number): void => {
    const offsetX = (dx - this.lastDx);
    const offsetY = (dy - this.lastDy);

    this.clonedNodeShapeSet?.translate(offsetX, offsetY);

    this.lastDx = dx;
    this.lastDy = dy;

    const overlayNode = this.getOverlayNode();

    const isFather = this.node.father?.id === overlayNode?.id;

    if (
      overlayNode?.id !== this.lastOverlayNode?.id
      && !isFather
    ) {
      overlayNode?.shapeExports.overlay();
      this.lastOverlayNode?.shapeExports.unOverlay();
    }

    this.lastOverlayNode = overlayNode;
  }

  private getOverlayNode(): Node | undefined {
    const clonedNodeBBox = this.clonedNodeShapeSet?.getBBox();

    if (!clonedNodeBBox) {
      return;
    }

    const overlayNode = this.addableNodeList.find((addableNode) => {
      return Raphael.isBBoxIntersect(clonedNodeBBox, addableNode.bbox);
    });

    return overlayNode?.node;
  }

  private getAddableNodeList(): AddableNode[] {
    const root = this.node.getRoot();
    if (!root) {
      return [];
    }

    const addableNodeList: AddableNode[] = [];

    this.setaddableNodeList(root, this.node, addableNodeList);

    return addableNodeList;
  }

  private setaddableNodeList(currentNode: Node, targetNode: Node, addableNodeList: AddableNode[]): void {
    if (currentNode.id === targetNode.id) {
      return;
    }

    addableNodeList.push({
      bbox: currentNode.getBBox(),
      node: currentNode,
    });

    currentNode.children?.forEach((child) => this.setaddableNodeList(child, targetNode, addableNodeList));
  }

  private end = (): void => {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }

    this.node.shapeExports.unOpacityAll();

    const isFather = this.node.father?.id === this.lastOverlayNode?.id;

    if (this.lastOverlayNode && !isFather) {
      this.lastOverlayNode.shapeExports.unOverlay();
      new ChangeFather(this.node, this.lastOverlayNode, this.createSingleNode);
    }

    this.clonedNodeShapeSet?.remove();
    this.clonedNodeShapeSet = null;

    this.lastOverlayNode = undefined;

    this.lastDx = 0;
    this.lastDy = 0;

    this.addableNodeList = [];
  }
}

export default Drag;
