// @ts-nocheck
import Raphael, { RaphaelPaper } from 'raphael';

declare module "raphael" {
  // todo
  interface RaphaelSet {
    nodeShape: any;
    selectedShape: any;
    unSelectedShape: any;
    overlapShape: any;
    unOverlapShape: any;
    setLabel: any;
    dragNodeOpacityShape: any;
    opacityShape: any;
    unOpacityShape: any;
  }
}

// 将label和rect设置为合适的位置
function setNodePosition(label: any, rect: any, nodeX: number, nodeY: number, nodePadding: any) {
  let textBox = label.getBBox();
  let rectWidth = textBox.width + nodePadding.width;
  let rectHeight = textBox.height + nodePadding.height;

  label.attr({
    x: nodeX + rectWidth * 0.5,
    y: nodeY + rectHeight * 0.5
  });
  rect.attr({
    width: rectWidth,
    height: rectHeight
  })
}

// 设置根结点的外形
function setRootShape(shape: any, nodeX: number, nodeY: number, text: string, mindmapType: any): void {
  let label = shape[0];
  let rect = shape[1];


  label.attr({
    'font-size': 25,
    'fill': 'white',
    'text': text
  });

  rect.attr({
    'rootAndFirstStroke': null
  });

  if (mindmapType === 'desktop') {
    rect.attr({
      'fill': '#428bca'
    });
  } else if (mindmapType === 'taskMore') {
    rect.attr({
      'fill': '#64d4a5'
    });
  }

  let rootNodepadding = {
    width: 42,
    height: 24
  };
  setNodePosition(label, rect, nodeX, nodeY, rootNodepadding);
};

// 设置第一层节点的外形
function setFirstLevelShape(shape: any, nodeX: number, nodeY: number, text: string): void {
  let label = shape[0];
  let rect = shape[1];

  label.attr({
    'font-size': 16,
    'text': text
  });

  rect.attr({
    'fill': 'white',
    'rootAndFirstStroke': null
  });

  let firstLevelPadding = {
    width: 40,
    height: 20
  };

  setNodePosition(label, rect, nodeX, nodeY, firstLevelPadding);
};

// 设置n>=2层节点的外形
function setSecondMoreShape(shape: any, nodeX: number, nodeY: number, text: string) {
  let label = shape[0];
  let rect = shape[1];

  label.attr({
    'font-size': 15,
    'text': text
  });

  rect.attr({
    'secondMoreStroke': null
  });

  let secondMorePadding = {
    width: 10,
    height: 10
  };

  setNodePosition(label, rect, nodeX, nodeY, secondMorePadding);
};

// 根绝节点的类型，设置节点的外形
Raphael.st.nodeShape = function (node: any, mindmapType: any) {
  mindmapType = mindmapType || 'desktop';
  if (node.checkIsRootNode()) {
    setRootShape(this, node.x, node.y, node.label, mindmapType);
  } else if (node.isFirstLevelNode()) {
    setFirstLevelShape(this, node.x, node.y, node.label);
  } else {
    setSecondMoreShape(this, node.x, node.y, node.label);
  }
};

// 被选择的外形
Raphael.st.selectedShape = function (node: any) {
  this[1].attr({
    stroke: '#ff0033',
    'stroke-width': 2.5

  });
  this.attr({
    'opacity': 1
  });

  this[0].toFront();
};

// 取消选择的外形：根据节点的类型不同而改变取消选择的外形
Raphael.st.unSelectedShape = function (node) {
  if (node.isSecondMoreNode()) {
    this[1].attr({
      'secondMoreStroke': null
    })
  } else {
    //@workaround:暂时被选择的样式
    this[1].attr({
      'rootAndFirstStroke': null
    })
  }
};

// 重叠时节点的外形
Raphael.st.overlapShape = function (node) {
  this[1].attr({
    stroke: 'blue'
  })
};

// 取消重叠时，节点的外形：设置根据节点的类型不同而不同
Raphael.st.unOverlapShape = function (node) {
  if (node.isSecondMoreNode()) {
    this[1].attr({
      'secondMoreStroke': null
    })
  } else {
    this[1].attr({
      'rootAndFirstStroke': null
    });
  }
};

Raphael.st.setLabel = function (node) {
  this[0].attr({
    'text': node.label
  })
};

// 透明样式：用于拖动节点时的透明显示
Raphael.st.dragNodeOpacityShape = function (node) {
  Raphael.st.unSelectedShape.call(this, node);

  this.attr({
    opacity: 0.4
  });
  this.toFront();

};

Raphael.st.opacityShape = function () {
  this.attr({
    opacity: 0.5
  })
};


Raphael.st.unOpacityShape = function () {
  this.attr({
    opacity: 1
  })
};

export default {
  init: function (paper: RaphaelPaper<'SVG'>) {
    // 设置默认的属性
    // 默认的根结点和第一层节点的外框笔触样式
    paper.customAttributes.rootAndFirstStroke = function () {
      return {
        'stroke': '#808080',
        'stroke-width': 1
      }
    };

    // 默认的n>=2层节点的外框笔触样式
    paper.customAttributes.secondMoreStroke = function () {
      return {
        'stroke': 'none'
      }
    };
  }
}
