import Graph from './graph';

interface MindmapTreeOptions {
  container: string | Element;
  onLabelChange: (label: string) => void;
}

class MindmapTree {
  private graph: Graph;
  public constructor(private options: MindmapTreeOptions) {
    const {
      container,
      onLabelChange,
    } = options;
    
    let containerDom = typeof container === 'string' ? document.querySelector(container) : container;

    if (!containerDom) {
      throw new Error('container is not exist');
    }

    this.graph = new Graph({
      containerDom: containerDom,
      onLabelChange,
    });
  }

  // 透传得有点远。。
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
