/**
 *
 * Created by rockyren on 14/11/23.
 */


define(['jquery','module/shapeStrategyFactory','module/DragHandle','module/ToolBar','module/ChildrenRenderer','Raphael'],function($, shapeStrategyFactory, DragHandle, ToolBar, ChildrenRendererFactory){

    function Renderer(toolBar) {
        this.paper = new Raphael(document.getElementById('mindmap-canvas'));
        this._nodePadding = 40;

        //var $toolbar = $('.toolbar');
        //this.toolBar = ToolBar($toolBar);

        //this._nHeight = 90;
        //this._nWidth = 120;
        this._nodeYInterval = 20;
        this._nodeXInterval = 120;

        this.toolBar = toolBar;

        this.LEFT = -1;
        this.RIGHT = 1;
    }


    Renderer.prototype = {
        constructor: Renderer,
        drawGraph: function(graph) {
            for(var i in graph.nodes) {
                graph.nodes[i].render();
            }

        },
        drawNode: function(node, position) {
            var paper = this.paper;
            if(position && position.hasOwnProperty('x') && position.hasOwnProperty('y')) {
                var px = position.x;
                var py = position.y;
            }else{
                var px = node.x;
                var py = node.y;
            }

            var label = paper.text(px,py,node.label)
                .attr({'font-size': 16});
            var textBox = label.getBBox();
            //得到举行的长度
            var rectWidth = textBox.width + this._nodePadding;
            var rectHeight = textBox.height + this._nodePadding;

            label.attr({
                x: px + rectWidth * 0.5,
                y: py + rectHeight * 0.5
            });

            var nodeRect = paper.rect(px,py,rectWidth,rectHeight,7);
            nodeRect.attr({fill: 'white', stroke: 'black', 'stroke-width': 2.5});
            label.toFront();

            var shape = paper.set().push(label).push(nodeRect);
            return shape;
        },
        //重新设置node的位置,其子节点的位置也改变
        /*
        setNodePosition: function(node,position){
            var shape = node.shape;
            var label = shape[0];

            var textBox = label.getBBox();
            //得到举行的长度
            var rectWidth = textBox.width + this._nodePadding;
            var rectHeight = textBox.height + this._nodePadding;


            shape.attr({
                x: position.x,
                y: position.y
            });
            label.attr({
                x: position.x + rectWidth * 0.5,
                y: position.y + rectHeight * 0.5
            });

            if(node.connectFather) {
                node.connectFather.render();
            }

            for(var i in node.children) {
                var child = node.children[i];

                this.setNodePosition(child, position);
            }


        },*/
        setChildrenPosition: function(node) {
            console.log(node);
            var shape = node.shape;
            var nx = shape[1].attr('x');
            var ny = shape[1].attr('y');
            var childrenCount = this.childrenCount(node);
            var startY = ny - (childrenCount * this._nHeight)/2;

            console.log(nx,ny);
            var index = 0;
            for(var i in node.children){
                var child = node.children[i];

                //var extraHeight = (this._nHeight - child.shape[1].attr('height'))/2;
                var extraHeight = 45;

                var x = nx + this._nWidth;
                var y = startY + this._nHeight * index + extraHeight;
                child.x = x;
                child.y = y;
                index++;

            }

        },
        //设置node的位置属性
        setNodeDirectionFlag: function(node) {
            //如果节点为第一层节点,则根据左右节点数赋位置值
            if(node.father && node.father == node.getRootNode()) {
                var childCount = this.getRootDirectionNodeCount(node);
                //如果左边数量大于或等于右边数量,,则设为右
                if(childCount.leftCount >= childCount.rightCount) {
                    node.direction = this.RIGHT;
                }else{
                    node.direction = this.LEFT;
                }

            }else if(node.father &&  node.father != node.getRootNode()) {
                //获取该节点第一层节点的direction
                var firstLevelNode = node.getFirstLevelNode();
                node.direction = firstLevelNode.direction;

            }
        },
        getRootDirectionNodeCount: function(node) {
            var root = node.getRootNode();
            var leftCount = 0,
                rightCount = 0;
            for(var i in root.children) {
                var rootChild = root.children[i];
                if(rootChild.direction == this.LEFT){
                    leftCount++;
                }else if(rootChild.direction == this.RIGHT){
                    rightCount++;
                }
            }
            return {
                leftCount: leftCount,
                rightCount: rightCount
            }
        },


        reRenderChildrenNode: function(node){


            var childrenRenderStrategy = ChildrenRendererFactory.createRendererStrategy(node);
            childrenRenderStrategy.renderChildren(node);

            /*
            //如果是根节点
            if(!node.father) {

            }else {

            }
            //获取节点高度一半的坐标
            var hnx = node.shape[1].attr('x'),
                hny = node.shape[1].attr('y') + this.getSingleNodeHeight(node)/2;

            var childrenAreaHeight = 0,     //节点的子节点所占区域的高度
                startY,                     //子节点区域的起始高度
                childX = hnx + this._nodeXInterval,     //子节点x坐标
                childY;                     //子节点的y坐标

            for(var i in node.children){
                var child = node.children[i];
                //节点保存区域高度
                child.areaHeight = this.getNodeAreaHeight(child);
                childrenAreaHeight += child.areaHeight;
            }
            startY = hny - childrenAreaHeight/2;

            //设置子节点的位置
            for(var i in node.children) {
                var child = node.children[i];
                console.log(child);
                //计算子节点y坐标
                childY = startY + child.areaHeight/2 - this.getSingleNodeHeight(child)/2;
                //累加
                startY += child.areaHeight;

                if(!child.shape){
                    child.renderImp({x: childX, y:childY});

                }else{
                    var dy = childY - child.shape[1].attr('y');
                    child.translate(0, dy);
                }

            }*/





        },
        resetFrontPosition: function(node, nodeAreaHeight){
            var brother, childY,
                moveY = nodeAreaHeight/ 2,
                curY = node.shape[1].attr('y');



            //遍历同级结点
            if(node.father) {
                for (var i in node.father.children) {

                    brother = node.father.children[i];
                    //当同级节点与当前节点同向时才上下移动
                    if(brother.direction == node.direction) {
                        if (brother != node) {

                            childY = brother.shape[1].attr('y');
                            //moveY = (this.getSingleNodeHeight(node) + this._nodeYInterval * 2) /2;
                            //如果在curNode上面则向上移动
                            if (childY < curY) {
                                brother.translate(0, -moveY);
                            }
                            //如果在curNode下面则向下移动
                            else {
                                brother.translate(0, moveY);
                            }
                        }
                    }

                }
                if(node.father){
                    this.resetFrontPosition(node.father, nodeAreaHeight);
                }
            }




            /*
            //上级的同级结点位置向上向下移动
            if(node.father){
                var curNode = node.father;
                var curY = curNode.shape[1].attr('y');
                var child, childY, moveY;

                //遍历同级结点
                if(curNode.father){
                    for(var i in curNode.father.children){

                        child = curNode.father.children[i];
                        if(child != curNode){

                            childY = child.shape[1].attr('y');
                            moveY = (this.getSingleNodeHeight(node) + this._nodeYInterval*2)/2
                            //如果在curNode上面则向上移动
                            if(childY < curY) {
                                child.translate(0, -moveY);
                            }
                            //如果在curNode下面则向下移动
                            else{
                                child.translate(0, moveY);
                            }
                        }
                    }

                    this.resetFrontPosition(curNode);
                }

            }*/
        },
        //取得单个节点的高度
        getSingleNodeHeight: function(node){
            if(node.shape){
                return node.shape[1].attr('height');

            }
            //如果为新节点则返回默认高度
            else{
                //@workaround:暂用绝对
                return 56;
            }
        },
        //取得节点所占区域的高度
        getNodeAreaHeight: function(node){
            if(this.childrenCount(node) > 0) {
                var height = 0;
                for(var i in node.children) {
                   height += this.getNodeAreaHeight(node.children[i]);
                }

                return height;
            }else{
                return this.getSingleNodeHeight(node) + this._nodeYInterval * 2;
            }

        },
        childrenCount: function(obj) {
            var count = 0;
            for(var i in obj.children) {
                count++;
            }

            return count;
        },

        //画边,把target原来的边删除重画
        drawEdge: function(source,target) {

            var sourceBox = source.shape.getBBox();
            var targetBox = target.shape.getBBox();

            var pathPoints = {
                x1: (sourceBox.x + sourceBox.x2)/2,
                y1: (sourceBox.y + sourceBox.y2)/2,
                x2: (targetBox.x + targetBox.x2)/2,
                y2: (targetBox.y + targetBox.y2)/2
            };


            var edgePath = this.paper.path(Raphael.fullfill("M{x1},{y1}L{x2},{y2}",pathPoints));
            edgePath.toBack();

            var shape = this.paper.set().push(edgePath);

            //如果target存在connectFather,重画这条边
            if(target.connectFather && target.connectFather.shape) {
                //console.log(target.connectFather.shape[0]);

                target.connectFather.shape[0].remove();
                //target.connectFather.clear();
                target.connectFather.shape = shape;

            }
            return shape;
        },
        setShape: function(shape,options){
            var shapeStrategy = shapeStrategyFactory.createStrategy(shape,options);
            shapeStrategy.setShape();
        },

        setDrag: function(node) {
            var dragHandle = DragHandle(node, this.toolBar);
            dragHandle.setDrag(node);
        },
        setCanvasClick: function(graph) {
            $(this.paper.canvas).mousedown(function(event){
                if(event.target.nodeName == 'svg') {
                    //如果点击的不是背景图片,取消seleted
                    graph.setSelected(null);

                }
            });
        }

    };




    return Renderer;
});