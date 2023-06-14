import DataHandler from '../../data/data-handler';
import ToolOperation from '../../tool-operation';
import { MElement } from '../m-element';
import { createToolbarItem } from './create-toolbar-item';

class Undo {
  public readonly el: MElement;
  public readonly btnEl: MElement;
  private readonly toolOperation: ToolOperation;
  private readonly dataHandler: DataHandler;
  constructor({
    dataHandler,
    toolOperation,
  }: {
    dataHandler: DataHandler;
    toolOperation: ToolOperation;
  }) {
    this.dataHandler = dataHandler;
    this.toolOperation = toolOperation;
    const elements = this.element();
    this.el = elements.el;
    this.btnEl = elements.btnEl;
  }

  public setState(): void {
    if (this.dataHandler.canUndo()) {
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
