import Node from './Node';
import Edge from './Edge';
import { forEach } from '../utils';
import {
    LEFT,
    RIGHT
} from '../constants';

export default class Graph {
    constructor() {
        // 累计数量，即使删除了node也不会减少，用于生成id
        this.nodeAccumulativeCount = 0;
        this.edgeAccumulativeCount = 0;

        // 节点集合
        this.nodes = {};
        // 边集合
        this.edges = {};

        this.selected = null;

        this.root = null;

        this.gRenderer = {};
    }

    init(renderer) {
        this.gRenderer = renderer;
        this.root = this._initRoot();
        
    }
  
    
    addNode() {
        if(this.selected) {
            return this._addNodeData(this.selected, {});
        }
    }

    removeNode() {
        if(this.selected) {
            if(this.selected.checkIsRootNode()) {
                console.log('cannot remove root node');
            } else {
                this._removeNodeData(this.selected);
                this.setSelected(null);
            }
        }
    }

     /**
     * 设置节点的文本
     * @param node
     * @param label
     */
    setLabel(label) {
        if(this.selected) {
            this.selected.label = label;

            //label改变渲染
            this.gRenderer.setLabelRender(this.selected);
        }
        
    }

    setSelected(node) {
        if(this.selected === node) {
            return;
        }
        
        let oldSelected = this.selected;
        this.selected = node;
        
        this.gRenderer.setSelectedRender(this.selected, oldSelected);
    }

    getSelected() {
        return this.selected;
    }

    getNodes() {
        return this.nodes;
    }

    /**
     * 获得当前节点可成为父节点候选的节点集
     * @param node 
     */
    getParentAddableNodeSet(node) { 
        let addableNodeSet = {};
        
        forEach(this.nodes, (curNode) => {
            addableNodeSet[curNode.id] = curNode;
        })

        let notAddableNodeSet = this._getChildrenNodeSet(node, {});
        notAddableNodeSet[node.id] = node;
        if(node.father){
            notAddableNodeSet[node.father.id] = node.father;
        }

        // 在this.nodes副本中除去当前节点及该节点的所有子节点的引用
        forEach(notAddableNodeSet, function(curNode){
            delete addableNodeSet[curNode.id];
        });

        return addableNodeSet;
    }

    setParent(parentId, childId) {
        
        let parent = this.nodes[parentId];
        let child = this.nodes[childId];

        if(child === parent || parent === null) { return null; }
        
        if(child.father === parent) { return; }
        else{
            //需要设置新父节点的children，才能正确删除重绘子节点时
            delete child.father.children[child.id];
            //在child.connectFather改变之前，递归删除子节点
            this.gRenderer.removeNodeRender(child);
        }

        

        this._setParentData(parent, child);
        

        this._resetChildrenProperty(child.children);

        //在新的father上递归添加原节点（递归添加）的渲染
        this.gRenderer.setParentRender(child);

    }
    
    _getChildrenNodeSet(node, childrenNodeSet={}) {
        if(childrenNodeSet && node.children) {
            forEach(node.children, (child) => {
                childrenNodeSet[child.id] = child;
                this._getChildrenNodeSet(child.children, childrenNodeSet);
            })
        }
        
        return childrenNodeSet;
    }


    _addNodeData(parent, attr={}) {
        // 数据变更部分
        let node = new Node(attr, this.gRenderer, this.nodeAccumulativeCount);
        this.nodeAccumulativeCount++;
        let nodeId = node.id;
        this.nodes[nodeId] = node;
        this._setParentData(parent, node);

        // 新增节点渲染
        this.gRenderer.addNodeRender(node);

        return node;
    }

    /**
     * 初始化根结点
     * @returns {*}
     * @private
     */
    _initRoot() {
        let root = this._addNodeData(null, {
            x: this.gRenderer.getCanvasWidth() / 2 -50,
            y: 200,
            id: 0,
            isRootNode: true});
        root.label = '中心主题';

        this.gRenderer.rootNodeRender(root);

        return root;

    }

    /**
     * 删除节点
     * @param node
     */
    _removeNodeData(node) {
        // 先先断开父节点的children和connectChildren连接，再渲染删除，然后删除递归数据
        this._removeParentConnect(node);
        
        this.gRenderer.removeNodeRender(node);
        
        this._removeNodeDataRecursively(node);
    }

    _addEdge(source, target, attr) {
        let edge = new Edge(source, target, this.edgeAccumulativeCount);
        this.edgeAccumulativeCount++;
        let edgeId = edge.id;
        this.edges[edgeId] = edge;
        return edge;
    }

    _setParentData(parent, child) {
        //如果设置父节点为自己或parent为null时,则返回null
        if(child === parent || parent === null) { return null };

        //如果parent与child的父节点相等,则退出
        if(child.father === parent) { return child.connectFather };

        this._removeParentConnect(child, false);

        //设置child的father
        child.father = parent;
        //设置新父节点的children;
        child.father.children[child.id] = child;

        //设置child的connectFather,并创建新边
        child.connectFather = this._addEdge(parent, child);
        //设置新父节点的connectChildren
        child.father.connectChildren[child.connectFather.id] = child.connectFather;

        this._setNodeDirection(child);

    }

    

    _removeParentConnect(node, isRemoveInNodes=true) {
        //若child存在旧父节点,则删除旧父节点child上该节点的引用
        let nodeFather = node.father,
            nodeConnectFather = node.connectFather;
        if(nodeFather) {
            let nodeId = node.id;
            delete nodeFather.children[nodeId];
            if(isRemoveInNodes) {
                // 删除nodes集合中的该对象的引用
                delete this.nodes[nodeId];
            }
            

        }
        //若child存在旧父节点,则删除旧父节点connectChildren上与child的边的引用
        if(nodeConnectFather) {
            let nodeConnectFatherId = nodeConnectFather.id;
            delete nodeFather.connectChildren[nodeConnectFatherId];
            delete this.edges[nodeConnectFatherId];
        }
    }

    /**
     * 设置节点的direction属性
     * @param node
     * @private
     */
    _setNodeDirection(node) {
        let direction = null;
        let father = node.father;

        let isFirstLevelNode = father.checkIsRootNode(),    
            isRootNode = !father;
        // 如果是第一层节点，则根据左右节点数获得位置值
        if(isFirstLevelNode) {
            if(this._isFirstNodeRightMoreThanLeft()) {
                node.direction = LEFT;
            } else {
                node.direction = RIGHT;
            }
        } 
        //如果为第n层(n>=2)节点,则按照父节点的direction设置
        else if(!isFirstLevelNode && !isRootNode) {
            node.direction = father.direction;
        }
    }

    /**
     * 判断第一层节点中右边节点大于(不等于)左边节点
     * @returns boolean
     * @private
     */
    _isFirstNodeRightMoreThanLeft() {
        let root = this.root;
        let leftCount = 0,
            rightCount = 0;
        
        forEach(root.children, (rootChild) => {
            if(rootChild.direction === -1) {
                leftCount++;
            } else if(rootChild.direction === 1) {
                rightCount++;
            }
        });

        return rightCount > leftCount;
    }

    /**
     * 递归删除节点的数据
     * @param node
     * @private
     */
    _removeNodeDataRecursively(node) {
        // 删除父节点相关:删除父节点与该节点的边界,从父节点的children上删除该节点,最后删除父节点引用
        // 数组中的属性设为undefined,其他引用设为null
        this._removeParentConnect(node);
        node.father = null;
        node.connectFather = null;
        
        forEach(node.children, (child) => {
            this._removeNodeDataRecursively(child);
        });

    }
    _resetChildrenProperty(children) {
        forEach(children, (child) => {
            child.connectFather = this._addEdge(child.father, child);

            this._setNodeDirection(child);

            this._resetChildrenProperty(child.children);
        });
    }
}