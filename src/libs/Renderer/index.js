import Raphael from 'raphael';
import shapeCustomAttr from './shapeCustomAttr';
import Viewport from './Viewport';
import nodeShapeRelative from './nodeShapeRelative';
import ChildrenRenderFactory from './ChildrenRenderFactory';
import EdgeDraw from './EdgeDraw';
import Drag from './Drag';
import { LEFT, RIGHT } from '../constants';
import { forEach } from '../utils';



export default class Renderer {
    constructor(options, graph) {
        this.graph = graph;

        this.canvasDom = document.getElementById(options.canvasId);
        this.paper = new Raphael(this.canvasDom);


        this.canvasClickCb = options.canvasClickCb;
        this.nodeClickCb = options.nodeClickCb;

        // 视野设置
        this.viewportHandle = Viewport(this.canvasDom, this.paper);
        this.viewportHandle.setViewportDrag();

        shapeCustomAttr.init(this.paper);

        // svg点击事件:如果点击的是canvas,取消selected
        this.setCanvasClick();
    }

    /**
     * 新增节点时的渲染
     * @param node
     */
    addNodeRender(node) {
        // 节点渲染
        if(node.x && node.y) {
            this.drawNode(node); 
        }
        // 如果没有设置x,y.则按照父节点的位置设置之
        else {
            this._reRenderChildrenNode(node.father);
            //向上递归移动父节点的同级节点,只有一个点时不用移动
            if(node.father && node.father.childrenCount() > 1) {
                this._resetBrotherPosition(node.father, nodeShapeRelative.getNodeAreaHeight(node));
            }
        }

        // 边渲染
        if(node.connectFather){
            this._drawEdge(node.connectFather);
        }

        // 设置拖动
        this._setDrag(node);

        node.shape.mousedown(() => {
            this.nodeClickCb && this.nodeClickCb(node.label);
        });
    }

    getCanvasWidth() {
        return this.canvasDom.clientWidth;
    }

    /**
     * 删除节点渲染
     * 需要先断开父节点的children和connectChildren连接才能重新调整当前节点层的节点
     * @param node
     */
    removeNodeRender(node) {
        this._reRenderChildrenNode(node.father);
        if(node.father){
            if(node.father.childrenCount() > 0 || node.childrenCount() > 1){
                this._resetBrotherPosition(node.father, -nodeShapeRelative.getNodeAreaHeight(node));
            }

        }
        this.removeNodeAndChildrenShape(node);
    }

    /**
     * 移动节点的渲染: 节点移动渲染(通过设置attr的x和y属性),边重绘
     * @param node
     * @param dx
     * @param dy
     */
    translateSingleNodeRender(node, dx, dy) {
        if(node.shape){
            let rect = node.shape[1];
            let posX = rect.attr('x');
            let posY = rect.attr('y');
            rect.attr({ x: posX + dx,  y: posY + dy} );

            let label = node.shape[0];
            let labelX = label.attr('x');
            let labelY = label.attr('y');
            label.attr( {x: labelX + dx, y: labelY + dy} );
        }


        //移动节点后,边重画
        if(node.shape && node.connectFather){
            this._drawEdge(node.connectFather);
        }
    }

    /**
     * 选择节点时的渲染
     * @param node 被选中的节点
     * @param oldSelected: 之前被选中的节点
     */
    setSelectedRender(node, oldSelected) {
        if(node && node.shape){
            node.shape.selectedShape(node);
        }
        if(oldSelected && oldSelected.shape){
            oldSelected.shape.unSelectedShape(oldSelected);

        }
    }

    /**
     * 节点文本设置渲染
     * @param node
     */
    setLabelRender(node) {
        //取得原来的长度
        let oldWidth = nodeShapeRelative.getSingleNodeWidth(node);

        //设置文本的shape
        node.shape.nodeShape(node);

        if(this.graph.selected){
            this.graph.selected.shape.selectedShape(node);
        }

        let newWidth = nodeShapeRelative.getSingleNodeWidth(node);
        let gap = newWidth - oldWidth;

        //如果改变label的节点为右方向节点,则只向右移动该节点的子节点
        if(node.direction === RIGHT){
            forEach(node.children, function(child){
                child.translate(gap, 0);
            });

            //右节点的边需要重画
            if(node.shape && node.connectFather){
                this._drawEdge(node.connectFather);
            }

        }
        //如果改变label的节点为左方向节点,则向左移动该节点(translate回递归)和toolbar
        else if(node.direction === LEFT){
            node.translate(-gap, 0);
        }
        //如果节点为根结点
        else if(node.checkIsRootNode()){
            node.translate(-gap/2, 0);
            forEach(node.children, function(child){
                if(child.direction === 1){
                    child.translate(gap, 0);
                } else if(child.direction === -1){
                    child.translate(-gap/2, 0);
                }
            });
        }
    }


    /**
     * 根结点渲染
     * @param node
     */
    rootNodeRender(rootNode) {
        let oldWidth = nodeShapeRelative.getSingleNodeWidth(rootNode);

        rootNode.shape.nodeShape(rootNode);
        let newWidth = nodeShapeRelative.getSingleNodeWidth(rootNode);
        let gap = newWidth - oldWidth;

        rootNode.translate(-gap/2, 0);

        forEach(rootNode.children, (child) => {
            if(child.direction === RIGHT) {
                child.translate(gap, 0);
            }
        });
    }

    /**
     * 创建node的shape
     * @param node
     * @private
     */
    drawNode(node) { 
        // 创建node的shape对象
        let paper = this.paper;
        // 已设置node的x和y时才能渲染节点
        let label = paper.text(node.x, node.y, node.label);
        let textBox = label.getBBox();
        // 得到矩形的长度
        let rectWidth = textBox.width;
        let rectHeight = textBox.height;

        let rect = paper.rect(node.x, node.y,
            nodeShapeRelative.nodeDefaultWidth,
            nodeShapeRelative.nodeDefaultHeight, 4)
            .data('id', node.id);
        label.toFront();


        node.shape = paper.set().push(label).push(rect);

        node.shape.nodeShape(node);
    }

    /**
     * 点击画布时,取消graph的选择
     */
    setCanvasClick() {
        this.canvasDom.addEventListener('mousedown', (event) => {
            if(event.target.nodeName === 'svg'){
                this.graph.setSelected(null);
                this.canvasClickCb && this.canvasClickCb();
                // todo 填空取消 
            }
        });
    }

    setParentRender(node) {

        var childrenWithShapeCount1 = node.father.childrenWithShapeCount();

        this._reRenderChildrenNode(node.father);
        var childrenWithShapeCount2 = node.father.childrenWithShapeCount();

        //向上递归移动父节点的同级节点,只有一个点时不用移动
        if(node.father && node.father.childrenCount() > 1) {
            if(childrenWithShapeCount2 - childrenWithShapeCount1 <= 1){
                this._resetBrotherPosition(node.father, nodeShapeRelative.getNodeAreaHeight(node));
            }
        }

        if(node.connectFather){
            this._drawEdge(node.connectFather);
        }
        
        //设置拖动
        this._setDrag(node);

        forEach(node.children, (child) => {
            this.setParentRender(child);
        });

    }

    /**
     * 创建edge的shape,如果已存在则删除原边重绘(重新设置edge的shape)
     * @param edge 边对象
     */
    _drawEdge(edge) {
        let edgeDraw = EdgeDraw(edge);
        edgeDraw.drawEdge();
    }

    /**
     * 重新设置当前节点的子节点的位置
     * @param node 当前节点
     * @private
     */
    _reRenderChildrenNode(node) {
        let childrenRenderStrategy = ChildrenRenderFactory.createRenderStrategy(node, this.drawNode.bind(this));
        childrenRenderStrategy.reRenderChildrenNode(node);
    }

    /**
     * 调整当前节点的兄弟节点的位置
     * @params node 当前节点
     * @params nodeAreaHeight 需要调整的高度(一般为最初改变的节点的高度的一半)
     */
    _resetBrotherPosition(node, nodeAreaHeight) {
        let brother,  //同级节点
            brotherY,   //兄弟节点的高度
            curY = node.y,  //当前节点的高度
            moveY = nodeAreaHeight / 2; //需要移动的高度

        //移动兄弟节点
        if(node.father) {
            forEach(node.father.children, function(brother){
                //当同级结点与当前结点direction相同时才上下移动
                if(brother.direction === node.direction){
                    if(brother !== node){
                        brotherY = brother.y;
                        //如果兄弟节点在当前节点的上面,则向上移动
                        if(brotherY < curY){
                            brother.translate(0, -moveY);
                        }
                        //否则,向下移动
                        else {
                            brother.translate(0, moveY);
                        }
                    }
                }
            });
        }
    }

    /**
     * 递归删除节点的shape
     * @param node
     * @private
     */
    removeNodeAndChildrenShape(node) {
        //删除节点和边的shape
        if(node.shape){
            node.shape.remove();
            node.shape = null;
        }
        if(node.connectFather.shape){
            node.connectFather.shape.remove();
            node.connectFather = null;
        }

        forEach(node.children, (child) => {
            this.removeNodeAndChildrenShape(child);
        });
    }

    /**
     * 设置node的拖动
     * @param node
     * @private
     */
    _setDrag(node) {
        let DragHandle = Drag(node, {
            viewportHandle: this.viewportHandle,
            paper: this.paper,
            graph: this.graph
        });

        DragHandle.setDrag();
    }


}