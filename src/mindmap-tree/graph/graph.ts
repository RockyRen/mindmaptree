// todo 是不是搞引用别名比较好？？？
import Raphael, { RaphaelPaper } from 'raphael';
import Model, { Direction } from '../model/model';
import Tree from './tree';

interface GraphOptions {
  containerDom: Element;
  model: Model;
}

class Graph {
  private readonly paper: RaphaelPaper;
  private readonly model: Model;
  private readonly containerWidth: number;
  private readonly containerHeight: number;
  private tree: Tree;
  public constructor(options: GraphOptions) {
    const { containerDom, model, } = options;

    const graphDom = this.initGraphElement(containerDom);
    this.containerWidth = containerDom.clientWidth || 0;
    this.containerHeight = containerDom.clientHeight || 0;

    this.paper = new Raphael(graphDom, this.containerWidth, this.containerHeight);
    this.model = model;
    this.tree = new Tree(this.model, this.paper);
  }

  // todo 暂时强制算出来
  public render(): void {
    this.tree.render();
  }

  // public addNode(father: any, data: any): void {
  //   this.tree.addNode(father, data);
  // }

  // public removeNode(node: any) {
  //   this.tree.removeNode(node);
  // }

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
