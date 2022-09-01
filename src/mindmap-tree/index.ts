import Graph from './graph';

interface MindmapTreeOptions {
  container: string | Element;
}

class MindmapTree {
  private graph: Graph;
  public constructor(private options: MindmapTreeOptions) {
    const {
      container,
    } = options;
    
    let containerDom = typeof container === 'string' ? document.querySelector(container) : container;

    if (!containerDom) {
      throw new Error('container is not exist');
    }

    this.graph = new Graph({
      containerDom: containerDom,
    });
  }
  public addNode(): void {
    this.graph.addNode();
  }

  public removeNode(): void {
    this.graph.removeNode();
  }
}

export default MindmapTree;
