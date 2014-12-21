/**
 * Created by rockyren on 14/12/21.
 */
define([],function(){
    /**
     * shape策略的工厂
     * 通过options.shapeType采取不同的策略:
     *      selected:被选择样式
     *      normal: 原来的样式
     *      null: 自定义样式，options需设置wrapAttr和fontAttr
     */
    var shapeStrategyFactory = (function(){

        return {
            createStrategy: function(shape, options){
                var strategy;
                if(options.shapeType == 'selected'){
                    strategy = new shapeStrategy(new selectedShape(shape, options));
                }
                else if(options.shapeType == 'normal'){
                    strategy = new shapeStrategy(new normalShape(shape, options));
                }
                else if(!options.shapeType){
                    strategy = new shapeStrategy(new customShape(shape, options));
                }
                return strategy;
            }
        }
    }());

    /**
     * 策略模式，根据选择实现不同的shape
     */
    function shapeStrategy(strategy, options) {
        this.strategy = strategy;
    }

    shapeStrategy.prototype.setShape = function(){
        this.strategy.doShape();
    };


    /**
     * 被选择的样式
     * @param shape
     * @param options
     */
    function selectedShape(shape, options){
        this.shape = shape;
    }
    selectedShape.prototype.doShape = function(){
        this.shape[1].attr({
            stroke: '#ff0033',
            'stroke-width': 3.5
        });
        return this.shape;
    };

    function normalShape(shape, options){
        this.shape = shape;
    }
    normalShape.prototype.doShape = function(){
        this.shape[1].attr({
            stroke: '#000',
            'stroke-width': 2.5
        });
        return this.shape;
    };

    //自定义
    function customShape(shape,options){
        this.shape = shape;
        this.options = options;
    }

    customShape.prototype.doShape = function(){
        //设置外层shape
        if(this.options.hasOwnProperty('wrapAttr'))
            this.shape[1].attr(this.options.wrapAttr);
        //设置字体shape
        if(this.options.hasOwnProperty('fontAttr'))
            this.shape[0].attr(this.options.fontAttr);
    };

    return shapeStrategyFactory;
});