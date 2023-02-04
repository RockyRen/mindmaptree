import ViewportInteraction from '../../viewport-interaction/viewport-interaction';
import { MElement } from '../m-element';
import { createToolbarItem } from './create-toolbar-item';

class Target {
  public readonly el: MElement;
  public readonly btnEl: MElement;
  private readonly viewportInteraction: ViewportInteraction;
  constructor({
    viewportInteraction,
  }: {
    viewportInteraction: ViewportInteraction
  }) {
    this.viewportInteraction = viewportInteraction;
    const elements = this.element();
    this.el = elements.el;
    this.btnEl = elements.btnEl;
  }

  private element(): {
    el: MElement;
    btnEl: MElement;
  } {
    const {
      el,
      btnEl,
    } = createToolbarItem({
      iconName: 'target',
      tipLabel: '定位到中间',
      isDisabled: false,
    });

    btnEl.addEventListener('click', () => {
      this.viewportInteraction.translateToCenter();
    }, false);

    return {
      el,
      btnEl,
    };
  }
}

export default Target;
