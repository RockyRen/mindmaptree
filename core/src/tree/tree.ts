import Node from '../node/node';
import Position from '../position';
import Selection from '../selection/selection';
import Viewport from '../viewport';
import TreeRenderer from './tree-renderer';
import NodeCreator from '../node/node-creator';
import type { NodeDataMap } from '../data/data-proxy';

// Tree class, for rendering tree
class Tree {
  private readonly root: Node;
  private readonly position: Position;
  private readonly selection: Selection;
  private readonly treeRenderer: TreeRenderer;
  private readonly nodeCreator: NodeCreator;
  public constructor({
    data,
    viewport,
    selection,
    nodeCreator,
  }: {
    data: NodeDataMap;
    viewport: Viewport;
    selection: Selection,
    nodeCreator: NodeCreator;
  }) {
    this.selection = selection;
    this.nodeCreator = nodeCreator;

    this.root = this.createRoot(data, viewport);
    this.position = new Position(this.root);

    this.treeRenderer = new TreeRenderer({
      root: this.root,
      position: this.position,
      createNode: nodeCreator.createNode,
    });

    this.render(data);
  }

  public getRoot(): Node {
    return this.root;
  }

  public clear(): void {
    this.root.remove();
  }

  public render(nodeDataMap?: NodeDataMap | null): void {
    this.treeRenderer.render(nodeDataMap);
  }

  private createRoot(
    nodeDataMap: NodeDataMap = {},
    viewport: Viewport,
  ): Node {
    let rootId = Object.keys(nodeDataMap).find((id) => {
      return nodeDataMap[id].isRoot === true;
    })!;

    const rootData = nodeDataMap[rootId];

    const root = this.nodeCreator.createNode({
      id: rootId,
      depth: 0,
      label: rootData.label,
      direction: rootData.direction,
    });

    const { width: viewportWidth, height: viewportHeight } = viewport.getViewbox();

    const rootBBox = root.getBBox();
    const rootX = (viewportWidth - rootBBox.width) / 2;
    const rootY = (viewportHeight - rootBBox.height) / 2;
    root.translateTo(rootX, rootY);

    return root;
  }
}

export default Tree;