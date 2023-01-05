import { RaphaelSet } from 'raphael';
import Node from './node';
import { NodeShape, DragCallbackList } from '../shape/node-shape';

// 用于给外部暴露方法的节点shape方法类
class ShapeExports {
  public constructor(
    private readonly node: Node,
    private readonly nodeShape: NodeShape) {
  }

  public cloneShape = (): RaphaelSet => this.nodeShape.clone();
  public drag = (...params: DragCallbackList): void => this.nodeShape.drag(...params);
  public undrag = (): void => this.nodeShape.undrag();
  public select = (): void => this.nodeShape.select();
  public unSelect = (): void => this.nodeShape.unSelect();
  public overlay = (): void => this.nodeShape.overlay();
  public unOverlay = (): void => this.nodeShape.unOverlay();
  public opacity = (): void => this.nodeShape.opacity();
  public unOpacity = (): void => this.nodeShape.unOpacity();

  public opacityAll(): void {
    const opacityInner = (node: Node): void => {
      node.shapeExports.opacity();
      node.children?.forEach((child) => opacityInner(child));
    }

    opacityInner(this.node);
  }

  public unOpacityAll(): void {
    const unOpacityInner = (node: Node): void => {
      node.shapeExports.unOpacity();
      node.children?.forEach((child) => unOpacityInner(child));
    }

    unOpacityInner(this.node);
  }
}

export default ShapeExports;
