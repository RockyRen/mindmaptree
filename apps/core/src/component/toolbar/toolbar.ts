import Selection from '../../selection/selection';
import DataHandler from '../../data/data-handler';
import TextEditor from '../../text-editor';
import ToolOperation from '../../tool-operation';
import PaperWrapper from '../../paper-wrapper';
import ViewportInteraction from '../../viewport-interaction/viewport-interaction';
import { h, MElement } from '../m-element';
import Undo from './undo';
import Redo from './redo';
import AddChild from './add-child';
import AddBrother from './add-brother';
import Edit from './edit';
import Delete from './delete';
import Target from './target';
import { isMobile } from '../../helper';

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
    dataHandler,
    textEditor,
    viewportInteraction,
  }: {
    toolOperation: ToolOperation;
    selection: Selection;
    dataHandler: DataHandler;
    textEditor: TextEditor;
    paperWrapper: PaperWrapper;
    viewportInteraction: ViewportInteraction;
  }) {
    this.undo = new Undo({ toolOperation, dataHandler });
    this.redo = new Redo({ toolOperation, dataHandler });
    this.addChildNode = new AddChild({ toolOperation, selection });
    this.addBrotherNode = new AddBrother({ toolOperation, selection });
    this.edit = new Edit({ textEditor, selection, });
    this.delete = new Delete({ toolOperation, selection });
    this.target = new Target({ viewportInteraction });

    const emptyEl = h('div');

    const items = [
      this.undo.el,
      this.redo.el,
      this.buildDivider(),
      this.addChildNode.el,
      this.addBrotherNode.el,
      this.buildDivider(),
      isMobile ? emptyEl : this.edit.el,
      this.delete.el,
      this.buildDivider(),
      this.target.el,
    ];

    const wrapperDom = paperWrapper.getWrapperDom();

    const el = h('div', 'toolbar');

    // render toolbar
    items.forEach((item) => {
      el.setChildren(item);
    });

    wrapperDom.appendChild(el.getDom());

    // change toolbar state when select change
    selection.on('select', () => {
      this.setState();
    });

    // change toolbar state when data change
    dataHandler.on('data', () => {
      setTimeout(() => {
        this.setState();
      }, 0);
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
