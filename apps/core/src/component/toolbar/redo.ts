import DataHandler from '../../data/data-handler';
import ToolOperation from '../../tool-operation';
import { MElement } from '../m-element';
import { createToolbarItem } from './create-toolbar-item';

class Redo {
  public readonly el: MElement;
  public readonly btnEl: MElement;
  private readonly dataHandler: DataHandler;
  private readonly toolOperation: ToolOperation;
  constructor({
    toolOperation,
    dataHandler,
  }: {
    toolOperation: ToolOperation;
    dataHandler: DataHandler;
  }) {
    this.toolOperation = toolOperation;
    this.dataHandler = dataHandler;
    const elements = this.element();
    this.el = elements.el;
    this.btnEl = elements.btnEl;
  }

  public setState(): void {
    if (this.dataHandler.canRedo()) {
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
