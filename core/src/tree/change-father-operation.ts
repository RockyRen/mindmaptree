import Position from "../position";
import DataProxy from "../data/data-proxy";
import Node from '../node/node';
import Selection from '../selection/selection';
import { Direction } from '../types';
import { generateId } from '../helper';
import type { CreateNodeFunc } from '../node/node-creator';

export interface ChangeFatherParams {
  newFather: Node,
  direction: Direction,
  nodes: Node[];
  childIndex?: number;
}

export type ChangeFatherFunc = (params: ChangeFatherParams) => void;

class ChangeFatherOperation {
  private readonly position: Position;
  private readonly selection: Selection;
  private readonly dataProxy: DataProxy;
  private readonly createNode: CreateNodeFunc;
  public constructor({
    position,
    selection,
    dataProxy,
    createNode,
  }: {
    position: Position;
    selection: Selection;
    dataProxy: DataProxy;
    createNode: CreateNodeFunc;
  }) {
    this.position = position;
    this.selection = selection;
    this.dataProxy = dataProxy;
    this.createNode = createNode;
  }

  public changeFather = ({
    newFather,
    direction,
    nodes,
    childIndex,
  }: ChangeFatherParams): void => {
    this.dataProxy.addSnapshot();
    const clonedNodes = nodes.map((node) => {
      return this.cloneNode(node, newFather, direction);
    });

    // If childIndex is undefineed, then insert node to the end of father
    const newChildIndex = childIndex === undefined ? newFather.getDirectionChildren(direction).length : childIndex;
    newFather.spliceChild(newChildIndex, 0, direction, clonedNodes);
    newFather.changeExpand(true);

    nodes.forEach((node) => node.remove());

    this.selection.select(clonedNodes);
    this.position.reset();
    this.dataProxy.resetData();
  }

  private cloneNode(node: Node, father: Node, direction: Direction): Node {
    const clonedNode = this.createNode({
      id: generateId(),
      depth: father.depth + 1,
      label: node.label,
      direction,
      father,
      isExpand: node.isExpand,
      imageData: node.imageData || undefined,
    });

    node.children.forEach((child) => {
      const clonedChild = this.cloneNode(child, clonedNode, direction);
      clonedNode.pushChild(clonedChild);
    });

    return clonedNode;
  }
}

export default ChangeFatherOperation;
