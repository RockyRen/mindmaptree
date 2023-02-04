import TextEditor from '../../text-editor';
import ToolOperation from '../../tool-operation';
import Selection from '../../selection/selection';
import { MElement } from '../m-element';
import { createToolbarItem } from './create-toolbar-item';

class Delete {
  public readonly el: MElement;
  public readonly btnEl: MElement;
  private readonly toolOperation: ToolOperation;
  private readonly textEditor: TextEditor;
  private readonly selection: Selection;
  constructor({
    toolOperation,
    textEditor,
    selection,
  }: {
    toolOperation: ToolOperation;
    textEditor: TextEditor;
    selection: Selection;
  }) {
    this.toolOperation = toolOperation;
    this.textEditor = textEditor;
    this.selection = selection;
    const elements = this.element();
    this.el = elements.el;
    this.btnEl = elements.btnEl;
  }

  public setState(): void {
    const selectNodes = this.selection.getTopNodes();
    if (selectNodes.length > 0) {
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
      iconName: 'delete',
      tipLabel: '删除',
    });

    btnEl.addEventListener('click', () => {
      this.toolOperation.removeNode();
    }, false);

    return {
      el,
      btnEl,
    };
  }
}

export default Delete;
