/**
 * Created by rockyren on 14/12/24.
 */
define([], function(){
   var  ChildrenRendererFactory = (function(node){
       return {
           createRendererStrategy: function(node) {
               var strategy;
               //如果节点是根节点,则实现第一层节点添加算法
               if(!node.father) {
                    strategy = new RendererStrategy(new FirstRender());
               }
               else {
                    strategy = new RendererStrategy(new NormalRender());
               }
               return strategy;
           }
       }
   }());

   function RendererStrategy(strategy) {
       this.strategy = strategy;
   }

   RendererStrategy.prototype.renderChildren = function(node) {
       this.strategy.doRender(node);
   };

    /**
     * 渲染抽象类
     * @constructor
     */
   function AbstractRender() {
        this._nodeYInterval = 20;
        this._nodeXInterval = 120;

        this.LEFT = -1;
        this.RIGTH = 1;
    }

   AbstractRender.prototype.getSingleNodeHeight = function(node) {

       if(node.shape){
           return node.shape[1].attr('height');

       }
       //如果为新节点则返回默认高度
       else{
           //@workaround:暂用绝对
           return 56;
       }
   };

   AbstractRender.prototype.getNodeAreaHeight = function(node) {
       if(this.childrenCount(node) > 0) {
           var height = 0;
           for(var i in node.children) {
               height += this.getNodeAreaHeight(node.children[i]);
           }

           return height;
       }else{
           return this.getSingleNodeHeight(node) + this._nodeYInterval * 2;
       }
   };

   AbstractRender.prototype.childrenCount = function(obj) {
       var count = 0;
       for(var i in obj.children) {
           count++;
       }

       return count;

   };

   AbstractRender.prototype.commonRender = function(father, children, direction) {
       var hnx = father.shape[1].attr('x');
       var hny = father.shape[1].attr('y') + this.getSingleNodeHeight(father)/2;

       var childrenAreaHeight = 0,     //节点的子节点所占区域的高度
           startY,                     //子节点区域的起始高度
           childX = hnx + direction * this._nodeXInterval,     //子节点x坐标
           childY;                     //子节点的y坐标

       for(var i in children) {
           var child = children[i];
           //节点保存节点高度
           child.areaHeight = this.getNodeAreaHeight(child);
           childrenAreaHeight += child.areaHeight;

       }
       startY = hny - childrenAreaHeight/2;
       for(var i in children) {
           var child = children[i];
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

       }
   };

    /**
     * 第一层子节点渲染
     * @constructor
     */
   function FirstRender() {

   }

   FirstRender.prototype = new AbstractRender();
   FirstRender.prototype.constructor = FirstRender;

   FirstRender.prototype.doRender = function(node) {
       var children = this.getDirectionChildren(node);
       this.commonRender(node, children.leftChildren, this.LEFT);
       this.commonRender(node, children.rightChildren, this.RIGTH);



       /*
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
   };

    FirstRender.prototype.getDirectionChildren = function(node) {
        var leftChildren = {},
            rightChildren = {};
        for(var i in node.children) {
            var child = node.children[i];
            console.log(child.direction, this.RIGTH);
            if(child.direction == this.LEFT) {
                leftChildren[i] = child;
            }else if(child.direction == this.RIGTH) {
                console.log(child);
                rightChildren[i] = child;
            }
        }

        return {
            leftChildren: leftChildren,
            rightChildren: rightChildren
        }

    };




    /**
     * 一般子节点渲染
     * @constructor
     */
   function NormalRender() {

   }
   NormalRender.prototype = new AbstractRender();
   NormalRender.prototype.constructor = NormalRender;

   NormalRender.prototype.doRender = function(node) {
       this.commonRender(node, node.children, node.direction);

       /*
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
   };

   return ChildrenRendererFactory;




});