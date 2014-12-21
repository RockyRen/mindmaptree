/**
 * Created by rockyren on 14/12/21.
 */
define([],function(){
    var DragHandle = function(aNode, aToolBar){
        var lastdx = 0;
        var lastdy = 0;
        var node = aNode;
        var toolBar = aToolBar;

        function moveFnc(dx, dy){
            node.translate(dx - lastdx, dy - lastdy);
            lastdx = dx;
            lastdy = dy;

            //toolBar移动
            var rect = node.shape[1];
            var rectX = rect.attr('x');
            var rectY = rect.attr('y');
            toolBar.setToolBarPosition({
                x: rectX,
                y: rectY
            });
        }

        function startFnc(){
            node.graph.setSelected(node);
            lastdx = 0;
            lastdy = 0;
        }

        function endFnc(){
        }



        return {
            setDrag: function(){
                node.shape.drag(moveFnc, startFnc, endFnc);
            }
        }
    };

    return DragHandle;



});