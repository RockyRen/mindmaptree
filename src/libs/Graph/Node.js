import { forEach } from '../utils';

export default class Node {
    constructor(attr={}, renderer, nodeCount=0) {
        this.renderer = renderer;

        if(attr.hasOwnProperty('id')) {
            this.id = attr.id;
        } else {
            this.id = nodeCount;
        }

        if(attr.hasOwnProperty('x') && attr.hasOwnProperty('y')) {
            this.x = attr.x;
            this.y = attr.y;
        } else {
            this.x = null;
            this.y = null;
        }

        // 是否根节点
        this.isRootNode = !!attr.isRootNode;

        //节点的直接子节点引用集合
        this.children = {};
        //节点的父节点引用
        this.father = null;

        //与父节点的边的引用
        this.connectFather = null;
        //与子节点的边的引用集合
        this.connectChildren = {};

        //节点的文本
        this.label = attr.label || "任务" + this.id;

        //节点的图形,其类型为Raphael的element或set对象
        this.shape = null;

        //判断在根结点左边还是右边的属性
        this.direction = attr.direction || null;

        this.data = attr.data || null;
    }

    checkIsRootNode() {
        return this.isRootNode;
    }

    childrenCount() {
        let count = 0;

        forEach(this.children, (child) => {
            count++;
        });
        return count;
    }
    childrenWithShapeCount() {
        let count = 0;

        forEach(this.children, (child) => {
            if(child.shape) {
                count++;
            }
        });

        return count;
    }
    isFirstLevelNode() {
        return this.father && this.father.isRootNode;
    }
    isSecondMoreNode() {
        return !this.isRootNode && !this.isFirstLevelNode();
    }

    translate(dx, dy) {
        this.x += dx;
        this.y += dy;

        //节点移动渲染
        this.renderer.translateSingleNodeRender(this, dx, dy);


        forEach(this.children, function(child){
            child.translate(dx, dy);
        });
    }
}