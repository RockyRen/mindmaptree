import Graph from './graph';
import { NodeData } from './types';

interface MindmapTreeOptions {
  container: string | Element;
  data?: NodeData[],
  onLabelChange: (label: string) => void; // todo 文本编辑将会内化到核心代码内部
}

// 核心思维导图类
// todo 将来整合工具栏、键盘事件和里面的graph
class MindmapTree {
  private graph: Graph;
  public constructor({
    container,
    data,
    onLabelChange,
  }: MindmapTreeOptions) {
    const containerDom = typeof container === 'string' ? document.querySelector(container) : container;

    if (!containerDom) {
      throw new Error('container is not exist');
    }

    this.graph = new Graph({
      containerDom: containerDom,
      data,
      onLabelChange,
    });
  }

  public addNode(): void {
    this.graph.addNode();
  }

  public removeNode(): void {
    this.graph.removeNode();
  }

  public setLabel(label: string): void {
    this.graph.setLabel(label);
  }
}

export default MindmapTree;
