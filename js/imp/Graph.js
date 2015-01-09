/**
 * Created by rockyren on 14/12/22.
 */
/**
 * 图的数据结构层，暴露一个Graph的构造函数
 */
define(['imp/renderModule/nodeShapeRelative'], function(nodeShapeRelative){
    /**
     * Graph类
     * @param gRenderer 渲染对象引用
     * @constructor
     */
    var Graph = function(gRenderer) {
        //渲染对象的引用
        this.gRenderer = gRenderer;

        this.nodeCount = 0;
        this.edgeCount = 0;

        //图的结点集合
        this.nodes = {};
        //边的结点结合
        this.edges = {};

        //被选择的节点
        this.selected = null;
        //根结点
        this.root = null;

        //@workaround: svg点击事件:如果点击的是canvas,取消selected
        this.gRenderer.setCanvasClick(this);
    };

    Graph.prototype = {
        constructor: Graph,
        setRootNode: function(node){
            this.root = node;
        },
        addNode: function(attr) {
            var node = new Node(this, attr);
            this.nodes[node.id] = node;
            return node;
        },
        addEdge: function(source, target, attr) {
            var edge = new Edge(this, source, target, attr);
            this.edges[edge.id] = edge;
            return edge;
        },
        setSelected: function(node) {
            //如果设置点为选择点本身,则返回
            if(this.selected == node) { return; }

            //将原来的被选择点设为normal样式
            if(this.selected && this.selected.shape) {

                this.gRenderer.setShape(this.selected, {
                    shapeType: 'unSelected'
                });
            }

            this.selected = node;

            //将新被选择点设为selected样式
            if(this.selected && this.selected.shape) {

                this.gRenderer.setShape(this.selected, {
                    shapeType: 'selected'
                });
            }

            //将toolbar设为不可见
            this.gRenderer.toolbar.setToolbarPosition(null);


        },

        /**
         *
         * @param nodeObjList: [{id:2, parent_id:null, name:'node2'}, {id:3, parent_id:2, name:'node3'}]
         */
        fromJsonObj: function(nodeObjList){

            var parentInfoGroup = getParentIdInfoGroup(nodeObjList);
            var rootGroup = parentInfoGroup['root'];
            batchSetParent(this.root, rootGroup, this, parentInfoGroup);

            /**
             * 根据nodeInfo的parent_id分组
             * @return: {'root': [nodeInfo1,nodeInfo2], 'parentId2': [nodeInfo3, nodeInfo4]}
             *
             */
            function getParentIdInfoGroup(nodeInfoList){
                var parentInfoGroup = {
                    'root': []
                };
                for(var i=0; i<nodeInfoList.length; i++){
                    var nodeInfo = nodeInfoList[i];
                    //如果parent_id是null,则分到root组
                    if(nodeInfo.parent_id == null){
                        parentInfoGroup['root'].push(nodeInfo);
                    }
                    //如果parent_id不是null,则按parent_id分组
                    else{
                        if(!parentInfoGroup[nodeInfo.parent_id]) { parentInfoGroup[nodeInfo.parent_id] = [] }
                        parentInfoGroup[nodeInfo.parent_id].push(nodeInfo);
                    }
                }
                return parentInfoGroup;
            }

            function batchSetParent(parentNode, childrenInfoList, selfGraph, parentInfoGroup){
                for(var i=0; i<childrenInfoList.length; i++){
                    var node = selfGraph.addNode();
                    node.label = childrenInfoList[i].name;
                    //@workaround给结点设置外部id
                    node.outerId = childrenInfoList[i].id;
                    node.setParent(parentNode);
                    node.render();

                    //获取当前结点的childrenInfoList
                    var newChildrenInfoList = parentInfoGroup[childrenInfoList[i].id];
                    if(newChildrenInfoList) {
                        batchSetParent(node, newChildrenInfoList, selfGraph, parentInfoGroup);
                    }

                }
            }


        },
        toJsonObj: function(){}
    };

    /**
     * 结点类
     * @param g 所属Graph的引用
     * @param attr 节点的属性
     * @constructor
     */
    var Node = function(g, attr) {
        if(!attr) attr = {};
        this.graph = g;

        //使用所属Graph的渲染对象
        this.gRenderer = this.graph.gRenderer;

        //结点的id
        this.id = ++(this.graph.nodeCount) || attr.id;
        //结点的直接子结点引用集合
        this.children = {};
        //结点的父结点引用
        this.father = null;

        if(attr.hasOwnProperty('x') && attr.hasOwnProperty('y')) {
            this.x = attr.x;
            this.y = attr.y;
        }else{
            this.x = null;
            this.y = null;
        }


        //与父结点的边的引用
        this.connectFather = null;
        //与子结点的边的引用集合
        this.connectChildren = {};



        //结点的文本
        this.label = "主题" + this.id;

        //结点的图形,其类型为Raphael的element或set对象
        this.shape = null;

    };

    Node.prototype = {
        constructor: Node,
        setParent: function(parent, attr) {
            //如果parent与自身的父结点相等,则退出
            if(this.father == parent) { return; }

            //如果已经存在父结点,则删除该父结点children上该结点的引用
            if(this.father) {
                delete this.father.children[this.id];
            }
            //如果已经存在父结点,则删除该父结点connectChildren上与该结点的边的引用
            if(this.connectFather) {
                delete this.father.connectChildren[this.connectFather.id];
            }

            //将该结点的父结点设置为parent
            this.father = parent;
            //设置新父结点的children引用
            this.father.children[this.id] = this;

            //创建与父结点的边
            this.connectFather = this.graph.addEdge(this.father,this,attr);
            //设置与新父节点的connectChildren引用
            this.father.connectChildren[this.connectFather.id] = this.connectFather;

            return this.connectFather;

        },
        translate: function(dx, dy) {
            this.x += dx;
            this.y += dy;

            this.gRenderer.translateSingleNode(this, dx, dy);

            //重画与父结点的边
            if(this.connectFather) {
                this.connectFather.render();
            }

            //拖动结点的子结点
            for(var i in this.children) {
                this.children[i].translate(dx,dy);
            }

        },
        renderImp: function() {
            this.gRenderer.drawNode(this);

            //添加拖动事件
            this.gRenderer.setDrag(this);
        },
        render: function() {

            //如果shape还没渲染,则渲染之
            if(!this.shape) {

                //设置方向
                if(!this.direction){
                    this.gRenderer.setNodeDirection(this);
                }

                //如果已经设置x,y,则直接渲染
                if(this.x && this.y){
                    this.renderImp();
                }
                else if(!this.x && !this.y){

                    this.gRenderer.reRenderChildrenNode(this.father);
                    //向上递归移动父结点的同级结点,只有一个点时不用移动
                    if(this.father && this.father.childrenCount() > 1){
                        this.gRenderer.resetFrontPosition(this.father, nodeShapeRelative.getNodeAreaHeight(this));
                    }
                }
            }
            //shape已经渲染的情况
            else{
                //重新设置label
                this.gRenderer.resetLabel(this);
            }


            //如果有父边,且其父边还未画出来时,将边画出来
            if(this.connectFather && !this.connectFather.shape) {
                this.connectFather.render();
            }

            //子结点重绘
            for(var i in this.children) {
                var child = this.children[i];
                console.log(child.shape);
                if(!child.shape) {
                    child.render();
                }
            }


        },
        //删除视图和数据结构相关
        removeNode: function(){
            //删除视图
            if(this.shape) {
                this.shape.remove();
                this.shape = null;

                /*删除父节点相关:删除父节点与该节点的边界,从父节点的children上删除该节点,最后删除父节点引用*/
                if(this.father) {
                    if(this.connectFather) {
                        this.connectFather.remove();
                    }
                    for(var i in this.father.children) {
                        if(i == this.id) {
                            delete this.father.children[i];
                            break;
                        }
                    }

                    this.father = null;
                    this.connectFather = null;
                }

                //递归删除子结点
                for(var i in this.children) {
                    this.children[i].removeNode();
                }

                if(this.graph.nodes[this.id]) {
                    delete this.graph.nodes[this.id];
                }
            }
        },
        remove: function() {
            var nodeFather = null;
            var nodeAreaHeight = nodeShapeRelative.getNodeAreaHeight(this);
            if(this.father){
                nodeFather = this.father;
            }

            this.removeNode();
            //重新调整位置
            if(nodeFather){

                this.gRenderer.reRenderChildrenNode(nodeFather);
                if(nodeFather.childrenCount() > 0){
                    this.gRenderer.resetFrontPosition(nodeFather, -nodeAreaHeight);
                }
            }
        },
        /**
         * 获取根结点
         */
        getRootNode: function(){
            if(!this.father) {
                return this;
            }else{
                var fatherNode = this.father;
                while(fatherNode.father) {
                    fatherNode = fatherNode.father;
                }
                return fatherNode;

            }
        },
        /**
         * 获取结点所在分支的第一层结点
         * @returns {*}
         */
        getFirstLevelNode: function(){
            //如果是根节点,则返回null
            var root = this.getRootNode();
            if(this == root) {
                return null;
            }
            var curNode = this;
            while(curNode.father != root) {
                curNode = curNode.father;
            }
            return curNode;
        },
        childrenCount: function(){
            var count = 0;
            for(var i in this.children){
                count++;
            }
            return count;
        },
        isFirstLevelNode: function(){
            return this.father && this.father == this.getRootNode();
        },
        isRootNode: function(){
            return this == this.getRootNode();
        }
    };

    /**
     * 边类
     * @param g 所属Graph的引用
     * @param source 起点结点的引用
     * @param target 终点结点的引用
     * @param attr   边的属性对象
     * @constructor
     */
    var Edge = function(g, source, target, attr) {
        this.graph = g;
        //使用所属Graph的渲染对象
        this.gRenderer = g.gRenderer;

        this.id = ++(this.graph.edgeCount);

        //起点结点的引用
        this.source = source;
        //终点结点的引用
        this.target = target;

        //边的的图形,其类型为Raphael的element或set对象
        this.shape = null;
    };

    Edge.prototype = {
        constructor: Edge,
        render: function() {
            if(this.source.shape && this.target.shape){
                this.shape = this.gRenderer.drawEdge(this.source,this.target);
            }
        },
        remove: function() {
            if(this.shape) {
                this.shape.remove();
                this.shape = null;
            }

            if(this.source.connectChildren[this.id]) {
                delete this.source.connectChildren[this.id];
            }

            if(this.target.connectFather) {
                this.target.connectFather = null;
            }

            if(this.graph.edges[this.id]) {
                delete this.graph.edges[this.id];
            }
        }
    };

    return Graph;

});