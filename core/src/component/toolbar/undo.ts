import DataProxy from '../../data/data-proxy';
import ToolOperation from '../../tool-operation';
import { MElement } from '../m-element';
import { createToolbarItem } from './create-toolbar-item';

class Undo {
  public readonly el: MElement;
  public readonly btnEl: MElement;
  private readonly toolOperation: ToolOperation;
  private readonly dataProxy: DataProxy;
  constructor({
    dataProxy,
    toolOperation,
  }: {
    dataProxy: DataProxy;
    toolOperation: ToolOperation;
  }) {
    this.dataProxy = dataProxy;
    this.toolOperation = toolOperation;
    const elements = this.element();
    this.el = elements.el;
    this.btnEl = elements.btnEl;
  }

  public setState(): void {
    if (this.dataProxy.canUndo()) {
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
      iconName: 'undo',
      tipLabel: 'Undo',
    });

    btnEl.addEventListener('click', () => {
      this.toolOperation.undo();
    }, false);

    return {
      el,
      btnEl,
    };
  }
}

export default Undo;
