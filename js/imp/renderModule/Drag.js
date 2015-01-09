/**
 * Created by rockyren on 14/12/25.
 */
define([], function(){
    /**
     * 拖动模块
     * @param aNode
     * @returns {{setDrag: Function}}
     * @constructor
     */
    var Drag = function(aNode, aToolbar){
        var lastdx = 0;
        var lastdy = 0;
        var node = aNode;
        var toolbar = aToolbar;

        function moveFnc(dx, dy){
            node.translate(dx - lastdx, dy - lastdy);
            lastdx = dx;
            lastdy = dy;

            //toolbar移动
            toolbar.setToolbarPosition({
                x: node.x,
                y: node.y
            }, node.isRootNode());
        }

        function startFnc(){
            node.graph.setSelected(node);

            //设置toolbar位置
            toolbar.setToolbarPosition({
                x: node.x,
                y: node.y
            }, node.isRootNode());

            lastdx = 0;
            lastdy = 0;
        }
        function endFnc(){}

        return {
            setDrag: function(){
                node.shape.drag(moveFnc, startFnc, endFnc);
            }
        }
    };

    return Drag;
});