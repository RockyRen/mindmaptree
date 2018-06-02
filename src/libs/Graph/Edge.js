export default class Edge {
    constructor(source, target, edgeAccumulativeCount) {
        this.id = ++edgeAccumulativeCount;

        //起点节点的引用
        this.source = source;
        //终点节点的引用
        this.target = target;

        //边的图形,其类型为Raphael的element或set对象
        this.shape = null;
    }
}