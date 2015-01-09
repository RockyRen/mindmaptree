/**
 * Created by rockyren on 15/1/9.
 */
/**
 * Created by rockyren on 14/12/22.
 */
define(['imp/renderModule/shapeStrategyFactory', 'imp/renderModule/Drag',
        'imp/renderModule/Toolbar', 'imp/renderModule/nodeShapeRelative',
        'imp/renderModule/ChildrenRenderFactory', 'Raphael'],
    function(shapeStrategyFactory, Drag, Toolbar, nodeShapeRelative, ChildrenRenderFactory){
        /**
         * 渲染类,使用raphael实现,一个渲染对象对一个paper
         * @param string canvas元素
         * @constructor
         */
        function Renderer(canvas, toolbar) {
            this.canvasDom = document.getElementById(canvas);

            this.paper = new Raphael(this.canvasDom);



            //视野框相关变量
            this.scale = 1.0;                 //视野规模
            this.canvasWidth = this.canvasDom.clientWidth || 400;        //视窗宽度
            this.canvasHeight = this.canvasDom.clientHeight || 400;      //视窗高度
            //视野对象:x,y,宽度,高度
            this.viewBox = {
                x: 0,
                y: 0,
                width: this.canvasWidth,
                height: this.canvasHeight
            };


            this.toolbar = Toolbar(toolbar, this.viewBox);
            this._setViewportDrag();

        }

        Renderer.prototype = {
            constructor: Renderer,
            /**
             * 设置svg视野
             * @param x 视野x坐标
             * @param y 视野y坐标
             * @param scale 视野规模
             */
            setViewport: function(x, y, scale){
                this.scale = scale;
                var realScale = 1.0 / this.scale;
                //设置视野最大规模
                if(this.scale > 5){
                    this.scale = 5;
                }
                //设置视野最小规模
                else if(this.scale < 0.2){
                    this.scale = 0.2;
                }

                //设置视野对象
                this.viewBox.x = x;
                this.viewBox.y = y;
                this.viewBox.width = this.canvasWidth * realScale;
                this.viewBox.height = this.canvasHeight * realScale;

                //设置视野
                this.paper.setViewBox(this.viewBox.x,
                    this.viewBox.y,
                    this.viewBox.width,
                    this.viewBox.height);


            },
            /**
             * 创建结点的图形对象
             * @param node
             * @returns {*} 渲染后的图形对象
             */
            drawNode: function(node) {
                var paper = this.paper;
                var label = paper.text(node.x, node.y, node.label);
                //label.attr({'font-size': 14});

                var rect = paper.rect(node.x, node.y, nodeShapeRelative.nodeDefaultWidth, nodeShapeRelative.nodeDefaultHeight, 7);
                //rect.attr({fill: 'white', stroke: 'black', 'stroke-width': 2.5});
                label.toFront();

                node.shape = paper.set().push(label).push(rect);

                this.setShape(node, {
                    shapeType: 'normal'
                });


            },
            /**
             * 设置结点的外形
             * @param node
             * @param options: 可指定shapeType
             */
            setShape: function(node, options) {
                var shapeStrategy = shapeStrategyFactory.createStrategy(options.shapeType);
                shapeStrategy.setShape(node, options);
            },
            /**
             * 移动结点位置
             * @param node
             * @param dx
             * @param dy
             */
            translateSingleNode: function(node, dx, dy){

                if(node.shape){
                    var rect = node.shape[1];
                    var posX = rect.attr('x');
                    var posY = rect.attr('y');

                    rect.attr({
                        x: posX + dx,
                        y: posY + dy
                    });

                    var label = node.shape[0];
                    var labelX = label.attr('x');
                    var labelY = label.attr('y');

                    label.attr({
                        x: labelX + dx,
                        y: labelY + dy
                    });
                }
            },
            /**
             * 创建边的图像对象,如果已存在则删除原边重绘
             * @param source
             * @param target
             */
            drawEdge: function(source, target) {
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

                    target.connectFather.shape[0].remove();
                    target.connectFather.shape = shape;

                }
                return shape;
            },

            setDrag: function(node) {
                var DragHandle = Drag(node, this.toolbar);
                DragHandle.setDrag(node);
            },

            /**
             * 设置结点的direction属性
             * @param node
             */
            setNodeDirection: function(node){
                //如果结点已经设置了x y,则与根结点的x位置作比较
                if(node.x && node.y && !node.isRootNode()){
                    var root = node.getRootNode();
                    if(root.x >= node.x){
                        node.direction = nodeShapeRelative.LEFT;
                    }else{
                        node.direction = nodeShapeRelative.RIGHT;
                    }
                }

                else if(!node.x && !node.y){
                    //如果为第一层结点,则根据左右结点数赋位置值
                    if(node.isFirstLevelNode()){
                        var childrenCount = getRootDirectionNodeCount(node);
                        //如果左边数量大于或等于右边数量,,则设为右
                        if(childrenCount.leftCount >= childrenCount.rightCount) {
                            node.direction = nodeShapeRelative.RIGHT;
                        }else{
                            node.direction = nodeShapeRelative.LEFT;
                        };
                    }
                    //如果为第n层(n>=2)结点,则直接取得第一层结点的direction
                    else if(!node.isFirstLevelNode() && !node.isRootNode()){
                        var firstLevelNode = node.getFirstLevelNode();
                        node.direction = firstLevelNode.direction;
                    }
                }

                //根据direction获取根结点中第一层结点左右数量
                function getRootDirectionNodeCount(node){
                    var root = node.getRootNode();
                    var leftCount = 0,
                        rightCount = 0;
                    for(var i in root.children){
                        var rootChild = root.children[i];
                        if(rootChild.direction == nodeShapeRelative.LEFT){
                            leftCount++;
                        }else if(rootChild.direction == nodeShapeRelative.RIGHT){
                            rightCount++;
                        }
                    }
                    return {
                        leftCount: leftCount,
                        rightCount: rightCount
                    }
                }
            },
            /**
             * 重新设置子结点的位置
             * @param node
             */
            reRenderChildrenNode: function(node){
                var childrenRenderStrategy = ChildrenRenderFactory.createRenderStrategy(node);
                childrenRenderStrategy.reRenderChildrenNode(node);
            },
            resetFrontPosition: function(node, nodeAreaHeight){
                var brother, childY,
                    moveY = nodeAreaHeight / 2,
                    curY = node.y;

                //遍历同级结点
                if(node.father) {
                    for(var i in node.father.children){
                        brother = node.father.children[i];
                        //当同级结点与当前结点direction相同时才上下移动
                        if(brother.direction == node.direction){
                            if(brother != node){
                                childY = brother.y;

                                //如果在curNode上面则向上移动
                                if(childY < curY){
                                    brother.translate(0, -moveY);
                                }else{
                                    brother.translate(0, moveY);
                                }
                            }
                        }
                    }
                    if(node.father){
                        this.resetFrontPosition(node.father, nodeAreaHeight);
                    }
                }
            },
            /**
             * 重新设置文本
             * 设置完文本后原结点和子结点的位置改变
             * @param node
             */
            resetLabel: function(node){
                //取得原来的长度
                var oldWidth = nodeShapeRelative.getSingleNodeWidth(node);


                this.setShape(node, {
                    fontAttr: {
                        text: node.label
                    }
                });


                this.setShape(node, {
                    shapeType: 'normal',
                    x: node.x,
                    y: node.y
                });
                this.setShape(node, {
                    shapeType: 'selected'
                });

                var newWidth = nodeShapeRelative.getSingleNodeWidth(node);
                if(node.direction == nodeShapeRelative.RIGHT){
                    for(var i in node.children){
                        node.children[i].translate(newWidth - oldWidth, 0);
                    }
                }else if(node.direction == nodeShapeRelative.LEFT){
                    node.translate(-(newWidth - oldWidth), 0);
                    this.toolbar.translateToolbar({
                        x: -(newWidth - oldWidth),
                        y: 0
                    });
                }


            },
            setCanvasClick: function(graph) {

                this.canvasDom.addEventListener('mousedown', function(event){
                    if(event.target.nodeName == 'svg'){
                        graph.setSelected(null);
                    }
                });

            },
            _setViewportDrag: function(){
                var dragging = false;
                var lastX = 0;
                var lastY = 0;
                var dX, dY, realScale;
                var selfRef = this;
                this.canvasDom.addEventListener('mousedown', function(event){
                    if(event.target.nodeName != 'svg') return;
                    realScale = 1.0 / selfRef.scale;

                    lastX = event.offsetX;
                    lastY = event.offsetY;
                    dragging = true;
                });
                this.canvasDom.addEventListener('mousemove', function(event){
                    if(event.target.nodeName != 'svg') return;
                    if(dragging){
                        dX = -(event.offsetX - lastX) * realScale;
                        dY = -(event.offsetY - lastY) * realScale;



                        selfRef.viewBox.x += dX;
                        selfRef.viewBox.y += dY;
                        //console.log(selfRef.viewBox);
                        selfRef.setViewport(selfRef.viewBox.x,
                            selfRef.viewBox.y,
                            selfRef.scale);


                        lastX = event.offsetX;
                        lastY = event.offsetY;
                    }
                });
                this.canvasDom.addEventListener('mouseup', function(event){
                    if(event.target.nodeName != 'svg') return;
                    if(dragging){
                        dragging = false;
                    }
                });

            }

        };

        return Renderer;
    });