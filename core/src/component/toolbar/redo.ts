import DataProxy from '../../data/data-proxy';
import ToolOperation from '../../tool-operation';
import { MElement } from '../m-element';
import { createToolbarItem } from './create-toolbar-item';

class Redo {
  public readonly el: MElement;
  public readonly btnEl: MElement;
  private readonly dataProxy: DataProxy;
  private readonly toolOperation: ToolOperation;
  constructor({
    toolOperation,
    dataProxy,
  }: {
    toolOperation: ToolOperation;
    dataProxy: DataProxy;
  }) {
    this.toolOperation = toolOperation;
    this.dataProxy = dataProxy;
    const elements = this.element();
    this.el = elements.el;
    this.btnEl = elements.btnEl;
  }

  public setState(): void {
    if (this.dataProxy.canRedo()) {
      this.btnEl.removeClass('disabled');
    } else {
      this.btnEl.addClass('disabled');
    }
  }

  private element(): {
    el: MElement;
    btnEl: MElement;
  } {
    const {
      el,
      btnEl,
    } = createToolbarItem({
      iconName: 'redo',
      tipLabel: 'Redo',
    });

    btnEl.addEventListener('click', () => {
      this.toolOperation.redo();
    }, false);

    return {
      el,
      btnEl,
    };
  }
}

export default Redo;
