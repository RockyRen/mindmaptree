import NodeShape from '../shape/node-shape';

class DragClonedNode {
  private clonedNodeShape: NodeShape | null = null;
  public constructor(private readonly originNodeShape: NodeShape) { }

  public init(): void {
    this.clonedNodeShape = this.originNodeShape.clone();
    this.clonedNodeShape.setStyle('disable');
  }

  public translate(dx: number, dy: number): void {
    this.clonedNodeShape?.translate(dx, dy);
  }

  public clear(): void {
    this.clonedNodeShape?.remove();
  }
}

export default DragClonedNode;
