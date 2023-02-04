import PaperWrapper from '../../paper-wrapper';
import Viewport from '../../viewport';
import { h, MElement } from '../m-element';

const zoomSpeed = 0.25;

class ViewportScale {
  private readonly viewport: Viewport;
  private readonly el: MElement;
  private readonly scaleLabelEl: MElement;
  public constructor({
    paperWrapper,
    viewport,
  }: {
    paperWrapper: PaperWrapper;
    viewport: Viewport;
  }) {
    this.viewport = viewport;
    const elements = this.element();
    this.el = elements.el;
    this.scaleLabelEl = elements.scaleLabelEl;
    
    const wrapperDom = paperWrapper.getWrapperDom();
    wrapperDom.appendChild(this.el.getDom());

    viewport.on('changeScale', (scale: number) => {
      this.scaleLabelEl.setHtml(this.getScalePercent(scale));
    });

  }

  private element(): {
    el: MElement,
    scaleLabelEl: MElement;
  } {
    const scale = this.viewport.getScale();
    const zoomOutEl = h('div', 'scale-btn').setChild(
      h('div', 'scale-btn-icon zoom-out')
    );

    const zoomInEl = h('div', 'scale-btn').setChild(
      h('div', 'scale-btn-icon zoom-in')
    );

    const scaleLabelEl = h('div', 'scale-label').setChild(this.getScalePercent(scale))

    const el = h('div', 'viewport-scale-controller').setChildren(
      zoomOutEl,
      scaleLabelEl,
      zoomInEl,
    );

    zoomOutEl.addEventListener('click', () => {
      this.viewport.addScale(-zoomSpeed);
    }, false);

    zoomInEl.addEventListener('click', () => {
      this.viewport.addScale(zoomSpeed);
    }, false);

    scaleLabelEl.addEventListener('click', () => {
      this.viewport.setScale(1);
    }, false);

    return {
      el,
      scaleLabelEl,
    };
  }

  private getScalePercent(scale: number): string {
    return `${Math.floor(scale * 100)}%`
  }
}

export default ViewportScale;
