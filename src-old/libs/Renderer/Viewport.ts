// 画布视野设置模块
// @param aCanvasDom 画布的dom对象
// @param aPaper 画布的paper对象
const Viewport = function (aCanvasDom: any, aPaper: any) {
  const canvasDom = aCanvasDom;
  const paper = aPaper;
  const scale = 1.0;    //规模默认为1.0
  const canvasWidth = canvasDom.clientWidth || 400;        //视窗宽度
  const canvasHeight = canvasDom.clientHeight || 400;      //视窗高度
  const viewBox = {
    x: 0,
    y: 0,
    width: canvasWidth,
    height: canvasHeight
  };

  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let dX;
  let dY;
  let realScale: number;

  // 设置svg视野
  // @param x 视野x坐标
  // @param y 视野y坐标
  // @param aScale 视野规模
  function _setViewport(x: number, y: number, scale: number) {
    const realScale = 1.0 / scale;
    if (scale > 5) {
      scale = 5;
    }
    //设置视野最小规模
    if (scale < 0.2) {
      scale = 0.2;
    }

    //设置视野对象
    viewBox.x = x;
    viewBox.y = y;
    viewBox.width = canvasWidth * realScale;
    viewBox.height = canvasHeight * realScale;

    //设置视野
    paper.setViewBox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
  }

  function mousedownHandle(event: any) {
    realScale = 1.0 / scale;

    lastX = event.layerX;
    lastY = event.layerY;
    dragging = true;
  }

  function mousemoveHandle(event: any) {
    if (dragging) {
      dX = -(event.layerX - lastX) * realScale;
      dY = -(event.layerY - lastY) * realScale;

      viewBox.x += dX;
      viewBox.y += dY;

      _setViewport(viewBox.x, viewBox.y, scale);

      lastX = event.layerX;
      lastY = event.layerY;
    }
  }

  function mouseupHandle(event: any) {
    if (dragging) {
      dragging = false;
    }
  }

  // 画布视野移动设置
  function setViewportDrag() {
    //添加画布的鼠标点击事件
    canvasDom.addEventListener('mousedown', function (event: any) {
      if (event.target.nodeName !== 'svg') { return };
      mousedownHandle(event);
    });

    //添加画布的鼠标移动事件
    canvasDom.addEventListener('mousemove', function (event: any) {
      if (event.target.nodeName !== 'svg') { return };
      mousemoveHandle(event);
    });

    //添加画布的鼠标释放事件
    canvasDom.addEventListener('mouseup', function (event: any) {
      if (event.target.nodeName !== 'svg') { return };
      mouseupHandle(event);
    });
  }

  return {
    isDragging: () => dragging,
    setViewportDrag: setViewportDrag,
    getViewbox: () => viewBox,
    mousedownHandle: mousedownHandle,
    mouseupHandle: mouseupHandle,
    mousemoveHandle: mousemoveHandle
  };
};

export default Viewport;
