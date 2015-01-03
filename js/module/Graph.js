/**
 * Created by rockyren on 14/11/23.
 */
define(['jquery'],function($){

    var Graph = function(gRenderer) {
        this.gRenderer = gRenderer;
        this.nodeCount = 0;
        this.edgeCount = 0;
        this.nodes = {};
        this.edges = {};



        this.selected = null;
        //this.fakeSelected = null;


        //@workaround: 将svg点击事件放在这里
        this.gRenderer.setCanvasClick(this);


    };

    Graph.prototype = {
        constructor: Graph,
        addNode: function(attr) {
            var node = new Node(this,attr);
            this.nodes[node.id] = node;
            return node;
        },
        addEdge: function(source,target,attr) {
            var edge = new Edge(this,source,target,attr);
            this.edges[edge.id] = edge;
            return edge;
        },
        setSelected: function(node) {
            //如果设置点为选择点本身,则返回
            if(this.selected == node) {
                return;
            }

            //将原来的被选择点重置为原来的attr
            if(this.selected && this.selected.shape) {
                this.gRenderer.setShape(this.selected.shape, {
                    shapeType: 'normal'
                });
            }

            this.selected = node;

            //设置选择点的attr
            if(this.selected && this.selected.shape) {
                this.gRenderer.setShape(this.selected.shape, {
                   shapeType: 'selected'
                });

            }



            if(this.selected) {
/*
                this.gRenderer.toolBar.setToolBarPosition({
                    x: this.selected.x,
                    y: this.selected.y
                });*/
            }else {
                this.gRenderer.toolBar.setToolBarPosition(null);
            }


        },

        fromJsonObj: function(nodeObjs) {
            /**
             * { id:{parent:node,children:[node]} }
             * @type {{}}
             */
            var nodesList = {};
            for(var i=0;i<nodeObjs.length;i++) {
                var nodeObj = nodeObjs[i];
                var node = this.addNode({
                    x: nodeObj.x,
                    y: nodeObj.y,
                    id: nodeObj.id
                });


                nodesList[nodeObj.id] = {
                    node: node,
                    parentId: nodeObj.parentId
                };

            }
            console.log(nodesList);


            for(var i in nodesList) {
                var curParentId = nodesList[i].parentId;
                if(curParentId) {
                    nodesList[i].node.setParent(nodesList[curParentId].node);
                }
            }






        },
        toJsonObj: function() {

        }
    };

    var Node = function(g,attr) {
        if(!attr) attr = {};
        this.graph = g;
        this.gRenderer = g.gRenderer;
        //var nodeSelf = this;

        this.id = ++(g.nodeCount) || attr.id;
        this.children = {};
        this.father = null;

        //Edge类
        this.connectFather = null;
        this.connectChildren = {};

        //属性值
        if(attr.hasOwnProperty('x') && attr.hasOwnProperty('y')) {
            this.x = attr.x || 0;
            this.y = attr.y || 0;

        }

        //节点的文本,默认为text
        this.label = "text23";

        this.shape = null;

    };

    Node.prototype = {
        constructor: Node,

        //attr为边的attr
        setParent: function(parent,attr) {
            if(this.father == parent) {
                return this.connectFather;
            }



            //如果已经存在父节点,则删除在父节点children,connectChildren上的该节点
            if(this.father) {
                delete this.father.children[this.id];
            }
            if(this.connectFather) {

                delete this.father.connectChildren[this.connectFather.id];
            }

            //将该节点的父节点设置为parent
            this.father = parent;






            //设置父节点的children和connectChildren
            this.father.children[this.id] = this;


            //@v2: 重新设置父结点中子节点的位置
            //this.gRenderer.resetChildrenPosition(this.father);

            //创建与父节点的边
            this.connectFather = this.graph.addEdge(this.father,this,attr);

            this.father.connectChildren[this.connectFather.id] = this.connectFather;

            //返回连接边
            return this.connectFather;


        },
        //移动节点
        translate: function(dx ,dy) {
            //this.x += dx;
            //this.y += dy;

            //shape调用transfrom函数
            if(this.shape) {

                //矩形移动
                var rect = this.shape[1];
                var posX = rect.attr('x');
                var posY = rect.attr('y');
                //console.log('pos',posX,posY);


                rect.attr({
                    x: posX + dx,
                    y: posY + dy
                });

                //文本移动
                var label = this.shape[0];
                var labelX = label.attr('x');
                var labelY = label.attr('y');

                label.attr({
                    x: labelX + dx,
                    y: labelY + dy
                });




            }

            //重画与父节点的边
            if(this.connectFather) {
                this.connectFather.render();
            }

            //拖动节点的子节点
            //由于this.children是一个对象,所以使用枚举对象的方法
            for(var i in this.children) {
                this.children[i].translate(dx,dy);
            }




        },
        /*创建的具体实现*/
        renderImp: function(position) {
            //画节点
            this.shape = this.gRenderer.drawNode(this, position);

            //添加拖动事件
            this.gRenderer.setDrag(this);
        },
        render: function() {

            if(this.father){
                if(!this.direction){
                    this.gRenderer.setNodeDirectionFlag(this);

                }
                this.gRenderer.reRenderChildrenNode(this.father);
            }else{
                this.renderImp();
            }

            //@workaround:重新设置label?需判断是否有变化?
            this.gRenderer.resetLabel(this);



            //只有一个点时不用移
            if(this.father && this.gRenderer.childrenCount(this.father) > 1)
                this.gRenderer.resetFrontPosition(this.father, this.gRenderer.getNodeAreaHeight(this));


            //如果有父边,且其父边还未画出来时,将边画出来
            if(this.connectFather && !this.connectFather.shape) {
                this.connectFather.render();
            }

            /*
            for(var i in this.connectChildren) {
                if(!this.connectChildren.shape) {
                    this.connectChildren[i].render();
                }
            }*/




            if(this.father) {
                console.log(this.father.children);
                for(var i in this.father.children) {
                    var child = this.father.children[i];
                    if(!child.shape) {

                        child.render();
                    }
                }
            }

        },
        //删除视图和数据结构相关
        removeNode: function(){
            //删除视图
            if(this.shape) {
                this.shape.remove();
                this.shape = null;
            }

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

            //递归删除子节点
            for(var i in this.children) {
                this.children[i].removeNode();
            }

            if(this.graph.nodes[this.id]) {
                delete this.graph.nodes[this.id];
            }
        },
        remove: function() {
            var nodeFather = null;
            var nodeAreaHeight = this.gRenderer.getNodeAreaHeight(this);
            if(this.father) {
                nodeFather = this.father;
            }

            this.removeNode();
            //重新调整位置
            if(nodeFather){
                this.gRenderer.reRenderChildrenNode(nodeFather);
                if(this.gRenderer.childrenCount(nodeFather) > 0)
                this.gRenderer.resetFrontPosition(nodeFather, -nodeAreaHeight);
            }


        },
        getRootNode: function() {
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
        }
    };

    var Edge = function(g,source,target,attr) {
        this.graph = g;
        this.gRenderer = g.gRenderer;

        this.id = ++(this.graph.edgeCount);

        this.source = source;
        this.target = target;



        this.shape = null;
    };

    Edge.prototype = {
        constructor: Edge,
        render: function() {
            if(this.source.shape && this.target.shape) {

                this.shape = this.gRenderer.drawEdge(this.source,this.target);
            }
        },
        remove: function() {
            if(this.shape) {
                this.shape.remove();
                this.shape = null;
            }
            /*delete是什么意思?*/
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