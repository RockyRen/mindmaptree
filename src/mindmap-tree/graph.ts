// todo 是不是搞引用别名比较好？？？
import Raphael, { RaphaelPaper } from 'raphael';
import Tree from './tree';
import { Direction } from './types';

interface GraphOptions {
  containerDom: Element;
}

// const testNodes = [
//   {
//     id: '111',
//     children: ['222'],
//     label: '中心主题',
//     direction: null,
//     isRoot: true,
//   },
//   {
//     id: '222',
//     children: [],
//     label: '任务2',
//     direction: Direction.RIGHT,
//     isRoot: false,
//   },
// ];

const testNodes = [
  {
    id: '111',
    children: ['222', '333', '444', '777'],
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

// const testNodes = [
//   {
//     id: '111',
//     // children: ['222', '999', '1010'],
//     // children: ['222', '999', '333'],
//     // children: ['222'],
//     children: ['222', '333'],
//     label: '中心主题',
//     direction: null,
//     isRoot: true,
//   },
//   {
//     id: '222',
//     children: [],
//     // children: ['333'],
//     label: '任务2',
//     direction: Direction.RIGHT,
//     isRoot: false,
//   },
//   {
//     id: '333',
//     children: [],
//     label: '任务3',
//     direction: Direction.LEFT,
//     isRoot: false,
//   },
//   {
//     id: '999',
//     children: [],
//     label: '任务9',
//     direction: Direction.RIGHT,
//     isRoot: false, 
//   },
//   {
//     id: '1010',
//     children: [],
//     label: '任务10',
//     direction: Direction.RIGHT,
//     isRoot: false, 
//   }
//   // {
//   //   id: '444',
//   //   children: ['555', '666'],
//   //   label: '任务4',
//   //   direction: Direction.LEFT,
//   //   isRoot: false,
//   // },
//   // {
//   //   id: '555',
//   //   children: [],
//   //   label: '任务5',
//   //   direction: Direction.LEFT,
//   //   isRoot: false,
//   // },
//   // {
//   //   id: '666',
//   //   children: [],
//   //   label: '任务6',
//   //   direction: Direction.LEFT,
//   //   isRoot: false,
//   // },
// ]


class Graph {
  private readonly paper: RaphaelPaper;
  private readonly containerWidth: number;
  private readonly containerHeight: number;
  private tree: Tree;
  public constructor(options: GraphOptions) {
    const { containerDom, } = options;

    const graphDom = this.initGraphElement(containerDom);
    this.containerWidth = containerDom.clientWidth || 0;
    this.containerHeight = containerDom.clientHeight || 0;

    this.paper = new Raphael(graphDom, this.containerWidth, this.containerHeight);

    // 初始化Tree后立即画图
    this.tree = new Tree(this.paper, testNodes);
  }

  public addNode(): void {
    this.tree.addNode();
  }

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
