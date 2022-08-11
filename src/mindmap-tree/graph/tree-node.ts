import { RaphaelPaper } from 'raphael';
import Model, { NodeData } from '../model/model';
import { createFirstNodeShape } from './shape/first-node-shape';
import { createGrandchildNodeShape } from './shape/grandchild-node-shape';
import { createRootNodeShape } from './shape/root-node-shape';
import { createFirstEdgeShape, FirstEdgeShape } from './shape/first-edge-shape';
import { createGrandchildEdgeShape, GrandchildEdgeShape } from './shape/grandchild-edge-shape';
import { NodeShape } from './shape/node-shape';

// todo 如何解决多态对象的类型问题？有些属性只有那个对象有
type EdgeShape = FirstEdgeShape | GrandchildEdgeShape;

let firstCount = 1;

// 可以做tree的递归操作
// todo 把这个当做是渲染数据的承载体
// TreeNode只承载数据，不进行递归
class TreeNode {
  private readonly paper: RaphaelPaper;
  private readonly model: Model;
  private readonly id: string;
  private readonly getTreeNodes: () => TreeNode[];
  // 渲染级别的数据
  private depth: number;
  private nodeShape?: NodeShape;
  private edgeShape?: EdgeShape;
  public constructor(
    model: Model,
    paper: RaphaelPaper,
    id: string,
    depth: number,
    getTreeNodes: () => TreeNode[],
  ) {
    this.model = model;
    this.paper = paper;
    this.id = id;
    this.depth = depth;
    this.getTreeNodes = getTreeNodes;
  }
  public render() {
    const nodeData = this.getModelNodeData();

    if (this.depth === 1) {
      this.nodeShape = createRootNodeShape({
        paper: this.paper,
        x: 100,
        y: 100,
        label: nodeData.label,
      });
    } else if (this.depth === 2) {
      this.nodeShape = createFirstNodeShape({
        paper: this.paper,
        x: 300,
        y: firstCount * 100,
        label: nodeData.label,
      });
      const treeNodeFather = this.getTreeNodeFather();
      const fatherNodeShape = treeNodeFather?.getNodeShape();
      console.log('fatherNodeShape', treeNodeFather);

      this.edgeShape = createFirstEdgeShape({
        paper: this.paper,
        sourceBBox: fatherNodeShape!.getBBox(),
        targetBBox: this.nodeShape.getBBox(),
        // @ts-ignore
        direction: nodeData.direction,
      })
      firstCount += 1;
    } else {
      this.nodeShape = createGrandchildNodeShape({
        paper: this.paper,
        x: 500,
        y: 100,
        label: nodeData.label,
      });

      const treeNodeFather = this.getTreeNodeFather();
      const fatherNodeShape = treeNodeFather?.getNodeShape();

      this.edgeShape = createGrandchildEdgeShape({
        paper: this.paper,
        sourceBBox: fatherNodeShape!.getBBox(),
        targetBBox: this.nodeShape.getBBox(),
        // @ts-ignore
        direction: nodeData.direction,
        depth: this.depth,
      })
    }
  }

  private getModelNodeData(): NodeData {
    const nodeData = this.model.getNode(this.id);
    return nodeData!;
  }
  public getModelFather(): string {
    // @ts-ignore
    return this.getModelNodeData().father;
  }
  public getModelChildren(): string[] {
    return this.getModelNodeData()?.children;
  }
  public getId() {
    return this.id;
  }

  public getTreeNodeFather(): TreeNode | undefined {
    const fatherId = this.getModelFather();
    const treeNodes = this.getTreeNodes();
    return treeNodes.find((treeNode) => {
      console.log('treeNode22', treeNode.id, fatherId);
      return treeNode.id === fatherId;
    });
  }
  public getTreeNodeChildren(): TreeNode[] {
    const childrenIds = this.getModelChildren();
    const treeNodes = this.getTreeNodes();
    return treeNodes.filter((treeNode) => childrenIds.includes(treeNode.id)); 
  }
  public getNodeShape() {
    return this.nodeShape;
  }
}

export default TreeNode;