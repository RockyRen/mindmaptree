import Raphael, { RaphaelPaper } from 'raphael';
import Model, { Direction } from '../model/model';
import RootNodeShape from './shape/root-node-shape';
import FirstNodeShape from './shape/first-node-shape';
import GrandchildNodeShape from './shape/grandchild-node-shape';
import FirstEdgeShape from './shape/first-edge-shape';
import GrandchildEdgeShape from './shape/grandchild-edge-shape';

interface GraphOptions {
  containerDom: Element;
  model: Model;
}

class Graph {
  private readonly paper: RaphaelPaper;
  private readonly model: Model;
  private readonly containerWidth: number;
  private readonly containerHeight: number;
  public constructor(options: GraphOptions) {
    const {
      containerDom,
      model,
    } = options;

    const graphDom = this.initGraphElement(containerDom);
    this.containerWidth = containerDom.clientWidth || 0;
    this.containerHeight = containerDom.clientHeight || 0;

    this.paper = new Raphael(graphDom, this.containerWidth, this.containerHeight);
    this.model = model;
  }

  // todo 暂时强制算出来
  public render() {
    const rootNodeShape = new RootNodeShape({
      paper: this.paper,
      x: this.containerWidth / 2 - 50,
      y: 200,
      label: this.model.rootNode.label,
    });

    rootNodeShape.translate(-100, 0);

    const node1 = new FirstNodeShape({
      paper: this.paper,
      x: this.containerWidth / 2 + 150,
      y: 100,
      label: '任务1',
    });

    const grandchild = new GrandchildNodeShape({
      paper: this.paper,
      x: this.containerWidth / 2 + 250,
      y: 100,
      label: '任务2',
    });

    const grandchild2 = new GrandchildNodeShape({
      paper: this.paper,
      x: this.containerWidth / 2 + 250 + 75,
      y: 100 - 30,
      label: '任务3',
    });

    const edge1 = new FirstEdgeShape({
      paper: this.paper,
      sourceBBox: rootNodeShape.getBBox(),
      targetBBox: node1.getBBox(),
      direction: Direction.RIGHT,
    });

    const edge2 = new GrandchildEdgeShape({
      paper: this.paper,
      sourceBBox: node1.getBBox(),
      targetBBox: grandchild.getBBox(),
      direction: Direction.RIGHT,
      depth: 2,
    });

    const edge3 = new GrandchildEdgeShape({
      paper: this.paper,
      sourceBBox: grandchild.getBBox(),
      targetBBox: grandchild2.getBBox(),
      direction: Direction.RIGHT,
      depth: 3,
    });
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
