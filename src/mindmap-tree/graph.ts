import Raphael, { RaphaelPaper } from 'raphael';
import Tree from './tree';
import { NodeData } from './types';
import { GraphViewport } from './viewport';

interface GraphOptions {
  containerDom: Element;
  data?: NodeData[];
  onLabelChange: (label: string) => void;
}

// 包含背景的图像操作类
class Graph {
  private readonly paper: RaphaelPaper;
  private tree: Tree;
  public constructor({
    containerDom,
    data,
    onLabelChange
  }: GraphOptions) {
    const graphDom = this.initGraphElement(containerDom);
    const containerWidth = containerDom.clientWidth;
    const containerHeight = containerDom.clientHeight;

    if (containerWidth === 0 || containerHeight === 0) {
      throw new Error('The width or height of Container is not more than 0')
    }

    // 初始化
    this.paper = new Raphael(graphDom, containerWidth, containerHeight);

    // 初始化Tree后立即画图
    this.tree = new Tree({
      paper: this.paper, 
      data,
      containerWidth,
      onLabelChange,
    });

    new GraphViewport(this.paper, graphDom);
  }

  public addNode(): void {
    this.tree.addNode();
  }

  public removeNode(): void {
    this.tree.removeNode();
  }

  public setLabel(label: string): void {
    this.tree.setLabel(label);
  }

  private initGraphElement(containerDom: Element): HTMLDivElement {
    const graphDom = document.createElement('div');
    graphDom.className = 'mindmap-graph';
    graphDom.style.width = '100%';
    graphDom.style.width = '100%';
    containerDom.appendChild(graphDom);
    return graphDom;
  }
}

export default Graph;
