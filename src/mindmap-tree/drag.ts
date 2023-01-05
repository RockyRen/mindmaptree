import Raphael, { RaphaelSet, RaphaelAxisAlignedBoundingBox } from 'raphael';
import { DepthType } from './helper';
import Node from './node';
import DragPosition from './drag-position';

interface AddableNode {
  bbox: RaphaelAxisAlignedBoundingBox;
  node: Node;
}

// todo 这里是不是有weekmap比较好？
class Drag {
  private clonedNodeShapeSet: RaphaelSet | null = null;
  private lastOverlayNode?: Node;
  private lastDx: number = 0;
  private lastDy: number = 0;
  private addableNodeList: AddableNode[] = [];
  public constructor(
    private readonly node: Node,
    private readonly createNewNode: Function,
  ) {
    node.drag(this.move, this.start, this.end);
  }

  public unbind(): void {
    this.node.undrag();
  }

  // todo 判断是点击还是拖拽
  private start = (): void => {
    this.node.opacityAll();
    this.clonedNodeShapeSet = this.node.cloneShape();
    this.clonedNodeShapeSet.attr({
      opacity: 0.4,
    });

    this.addableNodeList = this.getAddableNodeList();
  }

  // todo 是否要做节流？
  private move = (dx: number, dy: number): void => {
    const offsetX = (dx - this.lastDx);
    const offsetY = (dy - this.lastDy);

    this.clonedNodeShapeSet?.translate(offsetX, offsetY);

    this.lastDx = dx;
    this.lastDy = dy;

    // todo 和可以变成父关系的节点重叠时，样式改变
    // todo 可能有性能问题
    const overlayNode = this.getOverlayNode();

    if (overlayNode?.id !== this.lastOverlayNode?.id) {
      overlayNode?.overlay();
      this.lastOverlayNode?.unOverlay();
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
    this.node.unOpacityAll();

    if (this.lastOverlayNode) {
      this.lastOverlayNode.unOverlay();
      new DragPosition(this.node, this.lastOverlayNode, this.createNewNode);
    }

    this.clonedNodeShapeSet?.remove();
    this.clonedNodeShapeSet = null;

    // todo
    this.lastOverlayNode = undefined;

    this.lastDx = 0;
    this.lastDy = 0;

    this.addableNodeList = [];
  }
}

export default Drag;
