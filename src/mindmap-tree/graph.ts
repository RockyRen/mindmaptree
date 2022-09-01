// todo 是不是搞引用别名比较好？？？
import Raphael, { RaphaelPaper } from 'raphael';
import Tree from './tree';
import { Direction } from './types';

interface GraphOptions {
  containerDom: Element;
}


const testNodes = [
  {
    id: '111',
    children: ['222', '444', '777'],
    label: '中心主题',
    direction: null,
    isRoot: true,
  },
  {
    id: '222',
    children: [],
    label: '任务2',
    direction: Direction.RIGHT,
    isRoot: false,
  },
  {
    id: '333',
    children: [],
    label: '任务3',
    direction: Direction.LEFT,
    isRoot: false,
  },
  {
    id: '444',
    children: ['555'],
    label: '任务4',
    direction: Direction.RIGHT,
    isRoot: false,
  },
  {
    id: '555',
    children: [],
    label: '任务5',
    direction: Direction.RIGHT,
    isRoot: false,
  },
  {
    id: '666',
    children: [],
    label: '任务6',
    direction: Direction.RIGHT,
    isRoot: false,
  },
  {
    id: '777',
    children: [],
    label: '任务7',
    direction: Direction.RIGHT,
    isRoot: false,
  },
];


class Graph {
  private readonly paper: RaphaelPaper;
  private tree: Tree;
  public constructor(options: GraphOptions) {
    const { containerDom, } = options;

    const graphDom = this.initGraphElement(containerDom);
    const containerWidth = containerDom.clientWidth;
    const containerHeight = containerDom.clientHeight;

    if (containerWidth === 0 || containerHeight === 0) {
      throw new Error('The width or height of Container is not more than 0')
    }

    this.paper = new Raphael(graphDom, containerWidth, containerHeight);

    // 初始化Tree后立即画图
    this.tree = new Tree(this.paper, testNodes, containerWidth);
  }

  public addNode(): void {
    this.tree.addNode();
  }

  public removeNode(): void {
    this.tree.removeNode();
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
