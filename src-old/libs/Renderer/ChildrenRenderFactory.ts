import { forEach } from '../utils';
import nodeShapeRelative from './nodeShapeRelative';

// 子结点重绘的策略工厂
const ChildrenRenderFactory = (function () {
  return {
    createRenderStrategy: function (node: any, drawNode: any) {
      let strategy;
      //如果结点是根结点,则实现第一层结点添加算法
      if (node.checkIsRootNode()) {
        // @ts-ignore
        strategy = new ChildrenRenderStrategy(new FirstRender(drawNode));
      } else if (node.isFirstLevelNode()) {
        // @ts-ignore
        strategy = new ChildrenRenderStrategy(new FirstLevelRender(drawNode));
      } else {
        // @ts-ignoreCc
        strategy = new ChildrenRenderStrategy(new SecondAndMoreRender(drawNode));
      }
      return strategy;

    }
  };
}());

// 子结点重绘策略类
function ChildrenRenderStrategy(strategy: any) {
  // @ts-ignore
  this.strategy = strategy;
}
ChildrenRenderStrategy.prototype.reRenderChildrenNode = function (node: any) {
  this.strategy.doRender(node);
};

// 抽象子结点重绘类
function AbstractRender(drawNode: any) {
  // @ts-ignore
  this.nodeXInterval = 40;
  // @ts-ignore
  this.drawNode = drawNode;
}

AbstractRender.prototype.commonRender = function (father: any, children: any, direction: any) {
  // 获取父结点的中间坐标
  const hfx = father.x + nodeShapeRelative.getSingleNodeWidth(father) / 2;
  const hfy = father.y + nodeShapeRelative.getSingleNodeHeight(father) / 2;

  // 结点的所有子结点所占区域的高度
  let childrenAreaHeight = 0;
  // 子节点区域的起始高度
  let startY: number;
  // 子节点x坐标
  let childX: number;
  // 子节点的y坐标
  let childY;
  let self = this;

  childX = hfx + direction * (this.nodeXInterval + nodeShapeRelative.getSingleNodeWidth(father) / 2);


  forEach(children, function (child: any) {
    // 通过结点的areHeight属性保存结点高度
    child.areaHeight = nodeShapeRelative.getNodeAreaHeight(child);
    childrenAreaHeight += child.areaHeight;
  });

  startY = hfy - childrenAreaHeight / 2;

  forEach(children, function (child: any) {
    // 计算子结点y坐标
    childY = startY + child.areaHeight / 2 - nodeShapeRelative.getSingleNodeHeight(child) / 2;

    // 起始高度累加
    startY += child.areaHeight;

    self._reRenderNode(child, childX, childY, direction);

  });
};
AbstractRender.prototype._reRenderNode = function (node: any, x: number, y: number, direction: number) {
  // 如果节点仍未渲染,则渲染之
  if (!node.shape) {
    node.x = x;
    node.y = y;
    this.drawNode(node);
    // 左边节点需左移一个节点宽度
    if (direction === -1) {
      node.translate(-nodeShapeRelative.getSingleNodeWidth(node), 0);
    }
  }
  //如果节点已经渲染,则y轴平移
  else {
    const dy = y - node.y;
    node.translate(0, dy);
  }
};

AbstractRender.prototype.doRender = function () {
  console.log('该方法应该被覆盖');
};

// 第一层子结点渲染类
function FirstRender(drawNode: any) {
  // @ts-ignore
  this.littleNodeYInterval = 100;
  // @ts-ignore
  this.drawNode = drawNode;
}

// @ts-ignore
FirstRender.prototype = new AbstractRender();
FirstRender.prototype.constructor = FirstRender;

FirstRender.prototype.doRender = function (node: any) {
  const children = this.getDirectionChildren(node);
  if (children.leftCount > 2) {
    this.commonRender(node, children.leftChildren, -1);
  } else {
    this.renderLessThanTwo(node, children.leftChildren, -1);
  }

  if (children.rightCount > 2) {
    this.commonRender(node, children.rightChildren, 1);
  } else {
    this.renderLessThanTwo(node, children.rightChildren, 1);
  }
};

// 当节点少于或等于两个时的渲染方法
FirstRender.prototype.renderLessThanTwo = function (father: any, leftChildren: any, direction: any) {
  const self = this;
  // 1表示第一个节点，-1表示第二个节点
  let countFlag = 1;
  forEach(leftChildren, function (child: any) {
    const hfx = father.x + nodeShapeRelative.getSingleNodeWidth(father) / 2;
    const hfy = father.y + nodeShapeRelative.getSingleNodeHeight(father) / 2;

    const childX = hfx + direction * (self.nodeXInterval + nodeShapeRelative.getSingleNodeWidth(father) / 2);
    let childY = hfy - direction * countFlag * self.littleNodeYInterval;

    // @workaround:如果为1，4象限的节点
    if ((direction == 1 && countFlag == 1) || (direction === -1 && countFlag === -1)) {
      childY -= nodeShapeRelative.getSingleNodeHeight(child);
    }

    self._reRenderNode(child, childX, childY, direction);

    countFlag = -countFlag;
  })
};

// 根据子结点的direction取得左右子结点集合
FirstRender.prototype.getDirectionChildren = function (node: any) {
  const leftChildren: any = {};
  const rightChildren: any = {};
  let leftCount = 0;
  let rightCount = 0;
  forEach(node.children, function (child: any) {
    if (child.direction == -1) {
      leftChildren[child.id] = child;
      leftCount++;
    } else {
      rightChildren[child.id] = child;
      rightCount++;
    }
  });

  return {
    leftChildren: leftChildren,
    rightChildren: rightChildren,
    leftCount: leftCount,
    rightCount: rightCount
  };
};

// 第一层子结点渲染类
function FirstLevelRender(drawNode: any) {
  // @ts-ignore
  this.nodeXInterval = 14;
  // @ts-ignore
  this.drawNode = drawNode;
}

// @ts-ignore
FirstLevelRender.prototype = new AbstractRender();
FirstLevelRender.prototype.constructor = FirstLevelRender;

FirstLevelRender.prototype.doRender = function (node: any) {
  this.commonRender(node, node.children, node.direction);
};

// 第n(n>=2)层子节点渲染类
function SecondAndMoreRender(drawNode: any) {
  // @ts-ignore
  this.nodeXInterval = 14;
  // @ts-ignore
  this.drawNode = drawNode;
}

// @ts-ignore
SecondAndMoreRender.prototype = new AbstractRender();
SecondAndMoreRender.prototype.construct = SecondAndMoreRender;

SecondAndMoreRender.prototype.doRender = function (node: any) {
  this.commonRender(node, node.children, node.direction);
};

export default ChildrenRenderFactory;
