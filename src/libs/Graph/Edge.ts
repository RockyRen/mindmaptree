class Edge {
  // todo any
  private source: any; // 起点节点的引用
  // todo any
  private target: any; // 终点节点的引用
  // todo any
  private shape: any; // 边的图形,其类型为Raphael的element或set对象

  public id: number;

  // todo 变成对象
  public constructor(source: any, target: any, edgeAccumulativeCount: number) {
    this.id = edgeAccumulativeCount + 1;
    this.source = source;
    this.target = target;
    this.shape = null;
  }
}

export default Edge;
