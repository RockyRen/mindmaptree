/**
 * Created by rockyren on 14/12/25.
 */
define([], function(){
    /**
     * 结点外形相关
     */
    var nodeShapeRelative = (function(){

        return {
            nodeDefaultWidth: 80,
            nodeDefaultHeight: 60,
            LEFT: -1,
            RIGHT: 1,
            nodeXInterval: 50,
            nodeYInterval: 20,
            getSingleNodeHeight: function(node){
                if(node.shape){
                    return node.shape[1].attr('height');
                }
                //如果为新结点则返回默认高度
                else{
                    //@workaround:暂用绝对
                    return this.nodeDefaultHeight;
                }
            },
            getSingleNodeWidth: function(node){
                if(node.shape){
                    return node.shape[1].attr('width');
                }else{
                    return this.nodeDefaultWidth;
                }
            },
            getNodeAreaHeight: function(node){
                //如果结点不是叶结点,则从子结点中累加高度
                if(node.childrenCount() > 0){
                    var height = 0;
                    for(var i in node.children){
                        height += this.getNodeAreaHeight(node.children[i]);
                    }
                    return height;
                }else{
                    return this.getSingleNodeHeight(node) + this.nodeYInterval * 2;
                }
            }


        }
    }());

    return nodeShapeRelative;
});