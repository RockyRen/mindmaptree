import Node from './node/node';
import Tree from "./tree/tree";
import Selection from './selection/selection';
import DataHandler from './data/data-handler';

// public operation of Toolbar, Sub Toolbar and keyboard
class ToolOperation {
  private readonly root: Node;
  private readonly tree: Tree;
  private readonly selection: Selection;
  private readonly dataHandler: DataHandler;
  public constructor({
    root,
    tree,
    selection,
    dataHandler,
  }: {
    root: Node;
    tree: Tree;
    selection: Selection;
    dataHandler: DataHandler;
  }) {
    this.root = root;
    this.tree = tree;
    this.selection = selection;
    this.dataHandler = dataHandler;
  }

  public undo(): void {
    this.dataHandler.undo();
  }

  public redo(): void {
    this.dataHandler.redo();
  }

  public addChildNode(): void {
    const selectNode = this.selection.getSingleSelectNode();
    if (!selectNode) return;
    this.dataHandler.addChildNode(selectNode.id, selectNode.depth + 1);
  }

  public addBrotherNode(): void {
    const selectNode = this.selection.getSingleSelectNode();
    if (!selectNode) return;
    this.dataHandler.addBrotherNode(selectNode.id, selectNode.depth);
  }

  public removeNode(): void {
    const selectNodes = this.selection.getSelectNodes();
    if (!selectNodes || selectNodes.length === 0) return;

    const selecNodeIds = selectNodes.map((selectNode) => selectNode.id);
    this.dataHandler.removeNode(selecNodeIds);
  }

  public getNodeMap(): Record<string, Node> {
    const nodeMap = {};
    this.setNodeMapInner(this.root, nodeMap);
    return nodeMap;
  }

  // private selectByIds(sourceIds?: string[]) {
  //   if (!sourceIds) return;

  //   const nodeMap = this.getNodeMap();

  //   const selectNodes = sourceIds.reduce((nodes, sourceId) => {
  //     if (nodeMap[sourceId]) nodes.push(nodeMap[sourceId]);
  //     return nodes;
  //   }, [] as Node[]);

  //   this.selection.select(selectNodes);
  // }

  private setNodeMapInner(node: Node, nodeMap: Record<string, Node>): void {
    nodeMap[node.id] = node;
    node.children.forEach((child) => this.setNodeMapInner(child, nodeMap));
  }
}

export default ToolOperation;
