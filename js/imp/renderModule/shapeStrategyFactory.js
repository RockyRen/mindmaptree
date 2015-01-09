/**
 * Created by rockyren on 14/12/25.
 */
define([], function(){

    /**
     * shape策略的工厂
     * 通过options.shapeType采取不同的策略:
     *      selected:被选择样式
     *      unSelected: 取消选择的样式
     *      normal: 默认结点样式
     *      null: 自定义样式，options需设置wrapAttr和fontAttr
     */
    var shapeStrategyFactory = (function(){
        return {
            createStrategy: function(shapeType){
                var strategy;

                if(shapeType == 'normal') {
                    strategy = new shapeStrategy(new normalShape());
                }
                else if(shapeType == 'root'){
                    strategy = new shapeStrategy(new rootShape());
                }
                else if(shapeType == 'selected'){
                    strategy = new shapeStrategy(new selectedShape());
                }
                else if(shapeType == 'unSelected'){
                    strategy = new shapeStrategy(new unSelectedShape());
                }
                else if(!shapeType){
                    strategy = new shapeStrategy(new customShape());
                }
                return strategy;
            }
        }
    }());



    /**
     * 策略类，根据选择实现不同的shape
     */
    function shapeStrategy(strategy, options) {
        this.strategy = strategy;
    }

    shapeStrategy.prototype.setShape = function(node, options){
        this.strategy.doShape(node, options);
    };


    /**
     * 结点默认样式类
     */

    function normalShape(){
        this._nodePadding = 40;
    }
    normalShape.prototype.doShape = function(node, options){
        var shape = node.shape;
        var label = shape[0];
        var rect = shape[1];

        label.attr({
            'font-size': 14
        });
        rect.attr({
            fill: 'white',
            stroke: 'black',
            'stroke-width': 2.5
        });
        var textBox = label.getBBox();
        //得到矩形的长度
        var rectWidth = textBox.width + this._nodePadding;
        var rectHeight = textBox.height + this._nodePadding;

        label.attr({
            x: node.x + rectWidth * 0.5,
            y: node.y + rectHeight * 0.5
        });

        rect.attr({
            width: rectWidth,
            height: rectHeight
        });
    };

    /**
     * 根结点样式类
     */
    function rootShape(){
        this._nodePadding = 40;
    }
    rootShape.prototype.doShape = function(node, options){
        var shape = node.shape;
        var label = shape[0];
        var rect = shape[1];

        label.attr({
            'font-size': 16,
            'font-weight': 'bolder',
            'fill': 'white'
        });
        rect.attr({
            fill: '#00ccff',
            stroke: 'black',
            'stroke-width': 2.5
        });

        var textBox = label.getBBox();
        //得到矩形的长度
        var rectWidth = textBox.width + this._nodePadding;
        var rectHeight = textBox.height + this._nodePadding;

        label.attr({
            x: node.x + rectWidth * 0.5,
            y: node.y + rectHeight * 0.5
        });

        rect.attr({
            width: rectWidth,
            height: rectHeight
        });

    };


    /**
     * 被选择的样式类
     */
    function selectedShape(){}
    selectedShape.prototype.doShape = function(node, options){
        var shape = node.shape;
        shape[1].attr({
            stroke: '#ff0033',
            'stroke-width': 3.5
        });
    };



    /**
     * 取消选择的样式类
     */
    function unSelectedShape(){}
    unSelectedShape.prototype.doShape = function(node, options){
        var shape = node.shape;
        shape[1].attr({
            stroke: '#000',
            'stroke-width': 2.5
        });
    };

    /**
     * 自定义样式类
     */
    function customShape(){}

    customShape.prototype.doShape = function(node,options){
        var shape = node.shape;
        //设置外层shape
        if(options.hasOwnProperty('wrapAttr'))
            shape[1].attr(options.wrapAttr);
        //设置字体shape
        if(options.hasOwnProperty('fontAttr'))
            shape[0].attr(options.fontAttr);
    };

    return shapeStrategyFactory;
});