
// todo children 为什么是对象而不是数组？
class Node {
  private x: number | null;
  private y: number | null;
  private renderer: any;
  private isRootNode: boolean;
  private children: any;
  private father: any;
  private connectFather: any;
  private connectChildren: any;
  private shape: any;
  private direction: any;
  private data: any;

  public id: number;
  public label: any;

  public constructor(attr: any = {}, renderer: any, nodeCount: number = 0) {
    this.renderer = renderer;

    if (attr.hasOwnProperty('id')) {
      this.id = attr.id;
    } else {
      this.id = nodeCount;
    }

    if (attr.hasOwnProperty('x') && attr.hasOwnProperty('y')) {
      this.x = attr.x;
      this.y = attr.y;
    } else {
      this.x = null;
      this.y = null;
    }

    // 是否根节点
    this.isRootNode = !!attr.isRootNode;

    //节点的直接子节点引用集合
    this.children = {};
    //节点的父节点引用
    this.father = null;

    //与父节点的边的引用
    this.connectFather = null;
    //与子节点的边的引用集合
    this.connectChildren = {};

    //节点的文本
    this.label = attr.label || "任务" + this.id;

    //节点的图形,其类型为Raphael的element或set对象
    this.shape = null;

    //判断在根结点左边还是右边的属性
    this.direction = attr.direction || null;

    this.data = attr.data || null;
  }

  public checkIsRootNode(): boolean {
    return this.isRootNode;
  }

  public childrenCount(): number {
    return Object.keys(this.children).length;
  }

  public childrenWithShapeCount(): number {
    return Object.keys(this.children).reduce((total, key) => {
      return this.children[key].shape ? total + 1 : total;
    }, 0);
  }

  public isFirstLevelNode(): boolean {
    return this.father && this.father.isRootNode;
  }

  public isSecondMoreNode(): boolean {
    return !this.isRootNode && !this.isFirstLevelNode();
  }

  public translate(dx: number, dy: number): void {
    // @ts-ignore
    this.x += dx;
    // @ts-ignore
    this.y += dy;

    //节点移动渲染
    this.renderer.translateSingleNodeRender(this, dx, dy);

    Object.keys(this.children).forEach((key) => {
      const child = this.children[key];
      child.translate(dx, dy);
    });
  }
}

export default Node;
