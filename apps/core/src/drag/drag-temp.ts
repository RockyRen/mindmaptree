
import Node from '../node/node';
import DragTempNodeShape from "../shape/drag-temp-node-shape";
import type { RaphaelPaper, RaphaelAxisAlignedBoundingBox } from "raphael";
import type { HitArea } from "./drag-area";

class DragTemp {
  private shape: DragTempNodeShape | null = null;
  public constructor(
    private readonly paper: RaphaelPaper,
    private readonly node: Node,
  ) { }

  public draw(hitArea: HitArea): void {
    this.shape?.remove();

    if (hitArea === null) {
      this.shape = null;
    } else {
      const { father, childIndex, isOwnArea, direction } = hitArea;

      const dragNodeBBox = this.node.getBBox();
      const fatherBBox = father.getBBox();
      if (isOwnArea) {
        this.shape = new DragTempNodeShape({
          paper: this.paper,
          sourceBBox: fatherBBox,
          targetBBox1: dragNodeBBox,
          targetBBox2: dragNodeBBox,
          targetDepth: father.depth + 1,
          direction,
        })
      } else {
        const children = father.getDirectionChildren(direction);
        let targetBBox1: RaphaelAxisAlignedBoundingBox | null = children[childIndex - 1]?.getBBox() || null;
        let targetBBox2: RaphaelAxisAlignedBoundingBox | null = children[childIndex]?.getBBox() || null;

        if (!father.isExpand) {
          targetBBox1 = null;
          targetBBox2 = null;
        }

        this.shape = new DragTempNodeShape({
          paper: this.paper,
          sourceBBox: fatherBBox,
          targetBBox1,
          targetBBox2,
          targetDepth: father.depth + 1,
          direction,
        });
      }
      if (father.isRoot()) {
        father.nodeShapeToFront();
      }
    }
  }

  public clear(): void {
    this.shape?.remove();
    this.shape = null;
  }
}

export default DragTemp;
