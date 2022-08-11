import TreeNode from './tree-node';
import Model, { NodeData } from '../model/model';
import { RaphaelPaper } from 'raphael';
// import { createRootNodeShape } from './shape/root-node-shape';
// import { createFirstNodeShape } from './shape/first-node-shape';
// import { createGrandchildNodeShape } from './shape/grandchild-node-shape';
// import { createFirstEdgeShape } from './shape/first-edge-shape';
// import { createGrandchildEdgeShape } from './shape/grandchild-edge-shape';


// 可以做tree的递归操作
// todo 承载树的特殊功能：根节点、树叶节点；增加节点、删除节点
class Tree {
  private readonly paper: RaphaelPaper;
  private readonly model: Model
  private rootTreeNode: TreeNode | undefined;;
  // 是否用map比较好？
  private readonly treeNodes: TreeNode[] = [];
  public constructor(model: Model, paper: RaphaelPaper) {
    this.model = model;
    this.paper = paper;

    // 初始化treeNodes
    this.init(this.model.rootNode, 1);
  }
  public render() {
    this.renderInner(this.rootTreeNode);
  }

  // todo NodeData不行
  public renderInner(treeNode?: TreeNode) {
    treeNode?.render();

    treeNode?.getModelChildren()?.forEach((childId) => {
      const childTreeNode = this.treeNodes.find((item) => item.getId() === childId)
      this.renderInner(childTreeNode);
    });
  }

  private init(node: NodeData, depth: number) {
    const treeNode = new TreeNode(
      this.model,
      this.paper,
      node.id,
      depth,
      this.getTreeNodes.bind(this),
    );
    this.treeNodes.push(treeNode);

    // @ts-ignore
    if (node.isRoot) {
      this.rootTreeNode = treeNode;
    }

    node.children.length > 0 && node.children.forEach((childId) => {
      const child = this.model.getNode(childId);
      !!child && this.init(child, depth + 1);
    })
  }


  public addNode(father: any, data: any) { }

  public removeNode(node: any) { }

  // todo 为啥会放在tree，明明是treeNode用到的。。。
  private getTreeNodes(): TreeNode[] {
    return this.treeNodes;
  }
}

export default Tree;