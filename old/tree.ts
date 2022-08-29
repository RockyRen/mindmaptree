import TreeNode from './tree-node';
import { RaphaelPaper } from 'raphael';
import { getChildrenPosition } from './position';

// 可以做tree的递归操作
// todo 承载树的特殊功能：根节点、树叶节点；增加节点、删除节点
// 属性是否有值的前后顺序问题：有些属性在前置处理后一定会存在的。
// todo 如何方便地从TreeNode中获取fatherTreeNode和brotherTreeNode
class Tree {
  private readonly paper: RaphaelPaper;
  private rootTreeNode: TreeNode | undefined;;
  // 是否用map比较好？
  private readonly treeNodes: TreeNode[] = [];
  public constructor(paper: RaphaelPaper) {
    this.paper = paper;

    // // 初始化treeNodes
    // this.init(this.model.rootNode, 1);
  }
  // public render() {
  //   // todo 根节点在中间
  //   this.renderInner(this.rootTreeNode!, 400, 200);
  // }

  // // todo NodeData不行
  // public renderInner(treeNode: TreeNode, x: number, y: number) {
  //   treeNode?.render(x, y);

  //   // 应该在这里一开始全部算出来？
  //   const childPositionMap = getChildrenPosition(treeNode, this.treeNodes);
  //   console.log(childPositionMap);

  //   // todo 能不能更方便地获得fatherNode和childrenNode？
  //   treeNode?.getModelChildren()?.forEach((childId) => {
  //     const childTreeNode = this.treeNodes.find((item) => item.getId() === childId);

  //     if (!childTreeNode) {
  //       return;
  //     }

  //     const { x: childX, y: childY, } = childPositionMap[childId];

  //     // todo 获取子节点的x和y
  //     childTreeNode && this.renderInner(childTreeNode, childX, childY);
  //   });
  // }

  // // 递归初始化TreeNode
  // private init(node: NodeData, depth: number) {
  //   const treeNode = new TreeNode(
  //     this.model,
  //     this.paper,
  //     node.id,
  //     depth,
  //     this.getTreeNodes.bind(this),
  //   );
  //   this.treeNodes.push(treeNode);

  //   // @ts-ignore
  //   if (node.isRoot) {
  //     this.rootTreeNode = treeNode;
  //   }

  //   node.children.length > 0 && node.children.forEach((childId) => {
  //     const child = this.model.getNode(childId);
  //     !!child && this.init(child, depth + 1);
  //   })
  // }

  // public addNode(father: any, data: any) { }

  // public removeNode(node: any) { }

  // // todo 为啥会放在tree，明明是treeNode用到的。。。
  // private getTreeNodes(): TreeNode[] {
  //   return this.treeNodes;
  // }
}

export default Tree;