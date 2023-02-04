import TextEditor from '../../text-editor';
import Selection from '../../selection/selection';
import { MElement } from '../m-element';
import { createToolbarItem } from './create-toolbar-item';

class Edit {
  public readonly el: MElement;
  public readonly btnEl: MElement;
  private readonly textEditor: TextEditor;
  private readonly selection: Selection;
  constructor({
    textEditor,
    selection,
  }: {
    textEditor: TextEditor;
    selection: Selection;
  }) {
    this.textEditor = textEditor;
    this.selection = selection;
    const elements = this.element();
    this.el = elements.el;
    this.btnEl = elements.btnEl;
  }

  public setState(): void {
    const selectNodes = this.selection.getSelectNodes();
    if (selectNodes.length === 1) {
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
      iconName: 'edit',
      tipLabel: '编辑',
    });

    btnEl.addEventListener('click', () => {
      this.textEditor.showBySelectionLabel();
    }, false);

    return {
      el,
      btnEl,
    };
  }
}

export default Edit;
