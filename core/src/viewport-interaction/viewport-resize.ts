import PaperWrapper, { wrapperClassName } from "../paper-wrapper";
import Viewport from "../viewport";

class ViewportResize {
  private readonly resizeObserver: ResizeObserver;
  private readonly wrapperDom: HTMLDivElement;
  public constructor( paperWrapper: PaperWrapper, viewport: Viewport) {
    const wrapperDom = paperWrapper.getWrapperDom();
    const svgDom = paperWrapper.getSvgDom();
    this.wrapperDom = wrapperDom;
    
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target.className.includes(wrapperClassName)) {
          const {
            clientWidth,
            clientHeight,
          } = entry.target;

          svgDom?.setAttribute('width', `${clientWidth}`);
          svgDom?.setAttribute('height', `${clientHeight}`);
          viewport.resize(clientWidth, clientHeight)
          break;
        }
      }
    });

    this.resizeObserver.observe(wrapperDom);
  }

  public clear(): void {
    this.resizeObserver.unobserve(this.wrapperDom);
  }
}

export default ViewportResize;
