
// 结点外形相关
const nodeShapeRelative = (function () {
  return {
    nodeDefaultWidth: 70,
    nodeDefaultHeight: 38,
    littleNodeDefaultHeight: 26,
    nodeXInterval: 40,
    nodeYInterval: 16,
    getSingleNodeHeight: function (node: any) {
      if (node.shape) {
        return node.shape[1].attr('height');
      }
      //如果为新结点则返回默认高度
      else {
        if (node.isFirstLevelNode()) {
          return this.nodeDefaultHeight;
        }
        //@workaround:如果为第三层或以上层节点
        else {
          return this.littleNodeDefaultHeight;
        }
      }
    },
    getSingleNodeWidth: function (node: any) {
      if (node.shape) {
        return node.shape[1].attr('width');
      } else {
        return this.nodeDefaultWidth;
      }
    },
    getNodeAreaHeight: function (node: any) {
      //如果结点不是叶结点,则从子结点中累加高度
      if (node.childrenCount() > 0) {
        let height = 0;
        for (const i in node.children) {
          height += this.getNodeAreaHeight(node.children[i]);
        }
        return height;
      } else {
        return this.getSingleNodeHeight(node) + this.nodeYInterval * 2;
      }
    }
  }
}());

export default nodeShapeRelative;
