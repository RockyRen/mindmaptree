import Model from './model/model';
import Graph from './graph/graph';

interface MindmapTreeOptions {
  container: string | Element;
}

class MindmapTree {
  private graph: Graph;
  private model: Model;
  public constructor(private options: MindmapTreeOptions) {
    const {
      container,
    } = options;
    
    let containerDom = typeof container === 'string' ? document.querySelector(container) : container;

    if (!containerDom) {
      throw new Error('container is not exist');
    }


    this.model = new Model();

    this.graph = new Graph({
      containerDom: containerDom,
      model: this.model,
    });

    this.graph.render();
  }
}

export default MindmapTree;
