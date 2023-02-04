import Node from './node/node';
import Tree from "./tree/tree";
import Selection from './selection/selection';
import DataProxy from './data/data-proxy';
import TreeOperation from './tree/tree-operation';

// Toolbar、子Toolbar和keyboard的公共操作
class ToolOperation {
  private readonly root: Node;
  private readonly tree: Tree;
  // private readonly textEditor: TextEditor;
  private readonly selection: Selection;
  private readonly dataProxy: DataProxy;
  private readonly treeOperation: TreeOperation;
  public constructor({
    root,
    tree,
    selection,
    dataProxy,
    treeOperation,
  }: {
    root: Node;
    tree: Tree;
    selection: Selection;
    dataProxy: DataProxy;
    treeOperation: TreeOperation;
  }) {
    this.root = root;
    this.tree = tree;
    this.selection = selection;
    this.dataProxy = dataProxy;
    this.treeOperation = treeOperation;
  }

  public undo(): void {
    const { data, selectIds } = this.dataProxy.undo() || {};
    this.tree.render(data);
    this.selectByIds(selectIds);
  }

  public redo(): void {
    const { data, selectIds } = this.dataProxy.redo() || {};
    this.tree.render(data);
    this.selectByIds(selectIds);
  }

  public addChildNode(): void {
    this.treeOperation.addChildNode();
  }

  public addBrotherNode(): void {
    this.treeOperation.addBrotherNode();
  }

  public removeNode(): void {
    this.treeOperation.removeNode();
  }

  public getNodeMap(): Record<string, Node> {
    const nodeMap = {};
    this.setNodeMapInner(this.root, nodeMap);
    return nodeMap;
  }

  private selectByIds(sourceIds?: string[]) {
    if (!sourceIds) return;

    const nodeMap = this.getNodeMap();

    const selectNodes = sourceIds.reduce((nodes, sourceId) => {
      if (nodeMap[sourceId]) nodes.push(nodeMap[sourceId]);
      return nodes;
    }, [] as Node[]);

    this.selection.select(selectNodes);
  }

  private setNodeMapInner(node: Node, nodeMap: Record<string, Node>): void {
    nodeMap[node.id] = node;
    node.children.forEach((child) => this.setNodeMapInner(child, nodeMap));
  }
}

export default ToolOperation;
