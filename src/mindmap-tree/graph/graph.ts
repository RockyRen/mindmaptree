import Raphael, { RaphaelPaper } from 'raphael';
import Model from '../model/model';
import RootTopicShape from './shape/root-topic-shape';

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
    const rootTopicShape = new RootTopicShape({
      paper: this.paper,
      x: this.containerWidth / 2 - 50,
      y: 200,
      label: this.model.rootTopic.label,
    });

    rootTopicShape.translate(200, 200);
    rootTopicShape.select();
    rootTopicShape.unSelect();

    console.log(rootTopicShape.getPosition());
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
