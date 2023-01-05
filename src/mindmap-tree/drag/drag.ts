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

  public constructor(
    private readonly node: Node,
    private readonly createSingleNode: CreateSingleNodeFunc,
  ) {
    node.shapeExports.drag(this.move, this.start, this.end);
  }

  public unbind(): void {
    this.node.shapeExports.undrag();
  }

  // todo 判断是点击还是拖拽。现在点击会出现闪烁问题
  private start = (): void => {
    this.node.shapeExports.opacityAll();

    this.clonedNodeShapeSet = this.node.shapeExports.cloneShape();
    this.clonedNodeShapeSet?.attr({
      opacity: 0.4,
    });

    this.addableNodeList = this.getAddableNodeList();
  }

  // todo 是否要做节流？
  private move = (dx: number, dy: number): void => {
    console.log(dx, dy);
    const offsetX = (dx - this.lastDx);
    const offsetY = (dy - this.lastDy);

    this.clonedNodeShapeSet?.translate(offsetX, offsetY);

    this.lastDx = dx;
    this.lastDy = dy;

    // todo 和可以变成父关系的节点重叠时，样式改变
    // todo 可能有性能问题
    const overlayNode = this.getOverlayNode();

    // todo 暂时不能改变同一father的变向
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

  // todo 有没有更优雅的办法？
  private getAddableNodeList(): AddableNode[] {
    // 获取root的node节点
    let root: Node | null = this.node.father;

    while (root && root.getDepthType() !== DepthType.root) {
      root = root.father;
    }

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
    this.node.shapeExports.unOpacityAll();

    // todo 暂时不能改变同一father的变向
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
