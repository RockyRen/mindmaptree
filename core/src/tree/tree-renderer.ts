import Node from '../node/node';
import Position from '../position';
import type { NodeDataMap } from '../data/data-proxy';
import { CreateNodeFunc } from '../node/node-creator';

interface RenderNewParams {
  nodeDataMap: NodeDataMap;
  sourceId: string;
  depth: number;
  father: Node | null;
}

interface RenderParams {
  nodeDataMap: NodeDataMap;
  sourceId: string;
  depth: number;
  relativeNode: Node;
}

class TreeRenderer {
  private readonly root: Node;
  private readonly position: Position;
  private readonly createNode: CreateNodeFunc;
  public constructor({
    root,
    position,
    createNode,
  }: {
    root: Node;
    position: Position;
    createNode: CreateNodeFunc;
  }) {
    this.root = root;
    this.position = position;
    this.createNode = createNode;
  }

  public render(nodeDataMap?: NodeDataMap | null): void {
    if (!nodeDataMap) return;
    this.renderWithRelativeNode({
      nodeDataMap,
      sourceId: this.root.id,
      relativeNode: this.root,
      depth: 0,
    });
    this.position.reset();
  }

  renderWithRelativeNode({
    nodeDataMap,
    sourceId,
    relativeNode,
    depth,
  }: RenderParams): Node {
    const currentNode = relativeNode;
    const nodeData = nodeDataMap[sourceId];

    if (nodeData.label !== currentNode.label) {
      currentNode.setLabel(nodeData.label, false);
    }

    if (nodeData.isExpand !== currentNode.isExpand) {
      currentNode.changeExpand(nodeData.isExpand!, false);
    }

    const oldChildren = currentNode.children;
    currentNode.clearChild();

    nodeData.children.forEach((childId) => {
      const childNodeData = nodeDataMap[childId];
      if (!childNodeData) return;

      const childRelativeNodeIndex = oldChildren.findIndex((node) => {
        return node.id === childId;
      });

      let childRelativeNode: Node | null = null;

      if (childRelativeNodeIndex > -1) {
        const targetNodeList = oldChildren.splice(childRelativeNodeIndex, 1);
        childRelativeNode = targetNodeList[0];
      }

      const childNode = childRelativeNode !== null
        ? this.renderWithRelativeNode({
          nodeDataMap,
          sourceId: childId,
          relativeNode: childRelativeNode,
          depth: depth + 1,
        })
        : this.renderNew({
          nodeDataMap,
          sourceId: childId,
          depth: depth + 1,
          father: currentNode,
        });

      currentNode.pushChild(childNode);
    });

    oldChildren.forEach((oldChild) => {
      oldChild.remove();
    });

    return currentNode;
  }

  renderNew({
    nodeDataMap,
    sourceId,
    depth,
    father,
  }: RenderNewParams): Node {
    const nodeData = nodeDataMap[sourceId];

    const currentNode = this.createNode({
      id: sourceId,
      depth,
      label: nodeData.label,
      direction: nodeData.direction,
      father,
      isExpand: nodeData.isExpand,
    });

    nodeData.children.forEach((childId) => {
      const childNodeData = nodeDataMap[childId];
      if (!childNodeData) return;
      const childNode = this.renderNew({
        nodeDataMap,
        sourceId: childId,
        depth: depth + 1,
        father: currentNode,
      });
      currentNode.pushChild(childNode);
    });

    return currentNode;
  }
}

export default TreeRenderer;
