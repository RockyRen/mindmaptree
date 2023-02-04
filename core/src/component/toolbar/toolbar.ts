import { h, MElement } from '../m-element';
import Undo from './undo';
import Redo from './redo';
import AddChild from './add-child';
import AddBrother from './add-brother';
import Edit from './edit';
import Delete from './delete';
import Target from './target';
import Selection from '../../selection/selection';
import DataProxy from '../../data/data-proxy';
import TextEditor from '../../text-editor';
import ToolOperation from '../../tool-operation';
import PaperWrapper from '../../paper-wrapper';
import ViewportInteraction from '../../viewport-interaction/viewport-interaction';

class Toolbar {
  private readonly undo: Undo;
  private readonly redo: Redo;
  private readonly addChildNode: AddChild;
  private readonly addBrotherNode: AddBrother;
  private readonly edit: Edit;
  private readonly delete: Delete;
  private readonly target: Target;

  public constructor({
    paperWrapper,
    toolOperation,
    selection,
    dataProxy,
    textEditor,
    viewportInteraction,
  }: {
    toolOperation: ToolOperation;
    selection: Selection;
    dataProxy: DataProxy;
    textEditor: TextEditor;
    paperWrapper: PaperWrapper;
    viewportInteraction: ViewportInteraction;
  }) {
    this.undo = new Undo({ toolOperation, dataProxy });
    this.redo = new Redo({ toolOperation, dataProxy });
    this.addChildNode = new AddChild({ toolOperation, selection });
    this.addBrotherNode = new AddBrother({ toolOperation, selection });
    this.edit = new Edit({ textEditor, selection, });
    this.delete = new Delete({ toolOperation, textEditor, selection });
    this.target = new Target({ viewportInteraction });

    const items = [
      this.undo.el,
      this.redo.el,
      this.buildDivider(),
      this.addChildNode.el,
      this.addBrotherNode.el,
      this.buildDivider(),
      this.edit.el,
      this.delete.el,
      this.buildDivider(),
      this.target.el,
    ];

    const wrapperDom = paperWrapper.getWrapperDom();

    const el = h('div', 'toolbar');

    items.forEach((item) => {
      el.setChildren(item);
    });

    wrapperDom.appendChild(el.getDom());

    // todo seleciton和dataProxy可能同时触发
    selection.on('select', () => {
      this.setState();
    });

    dataProxy.on('changeData', () => {
      this.setState();
    });
  }

  private buildDivider(): MElement {
    return h('div', 'toolbar-divider');
  }

  private setState(): void {
    this.undo.setState();
    this.redo.setState();
    this.addChildNode.setState();
    this.addBrotherNode.setState();
    this.edit.setState();
    this.delete.setState();
  }
}

export default Toolbar;