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

        this.toolBar = toolBar;
    }


    Renderer.prototype = {
        constructor: Renderer,
        drawGraph: function(graph) {
            for(var i in graph.nodes) {
                graph.nodes[i].render();
            }

        },
        drawNode: function(node) {
            var paper = this.paper;
            var label = paper.text(node.x,node.y,node.label)
                .attr({'font-size': 16});
            var textBox = label.getBBox();
            //得到举行的长度
            var rectWidth = textBox.width + this._nodePadding;
            var rectHeight = textBox.height + this._nodePadding;

            label.attr({
                x: node.x + rectWidth * 0.5,
                y: node.y + rectHeight * 0.5
            });

            var nodeRect = paper.rect(node.x,node.y,rectWidth,rectHeight,7);
            nodeRect.attr({fill: 'white', stroke: 'black', 'stroke-width': 2.5});
            label.toFront();

            var shape = paper.set().push(label).push(nodeRect);
            return shape;


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