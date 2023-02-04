import Node from '../node/node';
import Viewport from '../viewport';
import PaperWrapper from '../paper-wrapper';
import DragViewportHandler from './drag-viewport-handler';
import DragRoot from './drag-root';
import DragBackground from './drag-background';
import ViewportWheel from './viewport-wheel';
import ViewportResize from './viewport-resize';

interface ViewportInteractionOptions {
  paperWrapper: PaperWrapper;
  viewport: Viewport;
  root: Node;
}

const zoomSpeed = 0.25;

// viewport交互类，实际操作中用到
class ViewportInteraction {
  private readonly viewport: Viewport;
  private readonly root: Node;
  private readonly dragRoot: DragRoot;
  private readonly dragBackground: DragBackground;
  private readonly viewportWheel: ViewportWheel;
  private readonly viewportResize: ViewportResize;
  public constructor(options: ViewportInteractionOptions) {
    const {
      paperWrapper,
      viewport,
      root,
    } = options;

    this.viewport = viewport;
    this.root = root;

    const dragResult = this.initDrag(options);
    this.dragRoot = dragResult.dragRoot;
    this.dragBackground = dragResult.dragBackground;

    const wrapperDom = paperWrapper.getWrapperDom();
    this.viewportWheel = new ViewportWheel(viewport, wrapperDom);

    this.viewportResize = new ViewportResize(paperWrapper, viewport);
  }

  public disableBackgroundDrag = (): void => this.dragBackground.disable();

  public enableBackgroundDrag = (): void => this.dragBackground.enable();

  public enableMoveScale = (): void => this.viewportWheel.enableMoveScale();

  public disableMoveScale = (): void => this.viewportWheel.disableMoveScale();

  public zoomIn(): void {
    this.viewport.addScale(zoomSpeed);
  }

  public zoomOut(): void {
    this.viewport.addScale(-zoomSpeed);
  }

  public translateToCenter(): void {
    const rootBBox = this.root.getBBox();
    const viewbox = this.viewport.getViewbox();

    const targetX = rootBBox.cx - viewbox.width / 2;
    const targetY = rootBBox.cy - viewbox.height / 2;

    this.viewport.translateTo(targetX, targetY);
  }

  public clear(): void {
    this.dragBackground.clear();
    this.viewportWheel.clear();
    this.viewportResize.clear();
  }

  private initDrag({
    paperWrapper,
    viewport,
    root,
  }: ViewportInteractionOptions): {
    dragRoot: DragRoot;
    dragBackground: DragBackground;
  } {
    const dragViewportHandler = new DragViewportHandler(viewport);
    const svgDom = paperWrapper.getSvgDom();

    const dragRoot = new DragRoot(root, dragViewportHandler);
    const dragBackground = new DragBackground(svgDom, dragViewportHandler);

    return {
      dragRoot,
      dragBackground,
    };
  }
}

export default ViewportInteraction;
