/**
 *
 * Created by rockyren on 14/11/23.
 */


define(['jquery','module/shapeStrategyFactory','module/DragHandle','module/ToolBar','Raphael'],function($, shapeStrategyFactory, DragHandle, ToolBar){

    function Renderer(toolBar) {
        this.paper = new Raphael(document.getElementById('mindmap-canvas'));
        this._nodePadding = 40;

        //var $toolbar = $('.toolbar');
        //this.toolBar = ToolBar($toolBar);

        this._nHeight = 90;
        this._nWidth = 120;

        this.toolBar = toolBar;
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
        renderNode: function(node){
            //重新计算同级节点的坐标
            var nx = node.father.shape[1].attr('x');
            var ny = node.father.shape[1].attr('y');
            var childrenCount = this.childrenCount(node.father);
            var startY = ny - (childrenCount * this._nHeight)/2;
            var extraHeight, moduleHeight;

            for(var i in node.father.children) {
                var child = node.father.children[i];
                moduleHeight = node.father.shape[1].attr('height');

                //计算离startY距离
                //extraHeight = (this._nHeight - moduleHeight) * 1.5;
                //@workaround
                extraHeight = (this._nHeight - moduleHeight) * this.getNodeHeight(child) * 1.5;


                var position = {
                    x: nx + this._nWidth,
                    y: startY + extraHeight
                };

                //累加
                console.log(this.getNodeHeight(child));
                startY += this._nHeight * this.getNodeHeight(child);


                if(!child.shape){
                    child.renderImp(position)

                }else{
                    var dy = position.y - child.shape[1].attr('y');
                    child.translate(0, dy);
                }

                //index++;
            }

        },
        resetFrontPosition: function(node){
            //上级的同级结点位置向上向下移动
            if(node.father){
                var curNode = node.father;
                var curY = curNode.shape[1].attr('y');

                //遍历同级结点
                if(curNode.father){
                    for(var i in curNode.father.children){

                        var child = curNode.father.children[i];
                        if(child != curNode){

                            var childY = child.shape[1].attr('y');
                            //如果在curNode上面则向上移动
                            if(childY < curY) {
                                child.translate(0, -this._nHeight/2);
                            }
                            else{
                                child.translate(0, this._nHeight/2);
                            }
                            //如果在curNode下面则向下移动
                        }
                    }

                    this.resetFrontPosition(curNode);
                }

            }
        },
        //取得节点的高度
        getNodeHeight: function(node){
            if(this.childrenCount(node) > 0){
                var count = 0;
                for(var i in node.children){
                    count += this.getNodeHeight(node.children[i]);
                }
                return count;
            }else{
                return 1;
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