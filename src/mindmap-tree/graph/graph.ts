import Raphael, { RaphaelPaper } from 'raphael';
// import { h } from '../common/template-element';
import Model from '../model/model';
import RootTopic from './root-toic';

interface GraphOptions {
  containerDom: Element;
  model: Model;
}

class Graph {
  private readonly paper: RaphaelPaper;
  private readonly model: Model;
  private readonly rootTopic: RootTopic;
  public constructor(options: GraphOptions) {
    const {
      containerDom,
      model,
    } = options;

    const graphDom = this.initGraphElement(containerDom);
    const containerWidth = containerDom.clientWidth || 0;
    const containerHeight = containerDom.clientHeight || 0;

    this.paper = new Raphael(graphDom, containerWidth, containerHeight);
    this.model = model;

    this.rootTopic = new RootTopic({
      paper: this.paper,
      model: this.model,
      containerWidth,
      containerHeight,
    });
  }

  public render() {
    this.rootTopic.render();
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
