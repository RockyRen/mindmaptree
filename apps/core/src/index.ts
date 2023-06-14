import * as Y from 'yjs';
import PaperWrapper from './paper-wrapper';
import Tree from './tree/tree';
import NodeCreator from './node/node-creator';
import NodeInteraction from './node-interaction';
import Viewport from './viewport';
import ViewportInteraction from './viewport-interaction/viewport-interaction';
import TextEditor from './text-editor';
import Selection from './selection/selection';
import MultiSelect from './selection/multi-select';
import Keyboard from './keyboard/keyboard';
import { setConfig } from './config';
import ToolOperation from './tool-operation';
import Toolbar from './component/toolbar/toolbar';
import ViewportScale from './component/viewport-scale/viewport-scale';
import SelectionBoundaryMove from './selection/selection-boundary-move';
import DataHandler, { getInitialData } from './data/data-handler';
import AwarenessHandler from './awareness-handler';
import type { Awareness } from "y-protocols/awareness";
import type { DataHandlerEventMap } from './data/data-handler';
import type { NodeDataMap } from './types';
import './index.less';
import './mobile.less';

export interface EventMap {
  data: DataHandlerEventMap['data'];
}

export type EventNames = keyof EventMap;

export interface MindmapTreeOptions {
  container: string | Element;
  data?: NodeDataMap;
  isDebug?: boolean;
  scale?: number;
  ydoc?: Y.Doc;
}

class MindmapTree {
  private readonly paperWrapper: PaperWrapper;
  private readonly viewportInteraction: ViewportInteraction;
  private readonly tree: Tree;
  private readonly keyboard: Keyboard;
  private readonly multiSelect: MultiSelect;
  private readonly nodeCreator: NodeCreator;
  private readonly dataHandler: DataHandler;
  private readonly selection: Selection;
  public constructor({ container, data, isDebug = false, scale, ydoc, }: MindmapTreeOptions) {
    setConfig({ isDebug });
    this.paperWrapper = new PaperWrapper(container);
    const paper = this.paperWrapper.getPaper();
    const viewport = new Viewport(this.paperWrapper, scale);
    this.nodeCreator = new NodeCreator({
      paper,
      viewport,
    });

    const initialData = getInitialData(data);

    this.tree = new Tree({
      viewport,
      data: initialData,
      nodeCreator: this.nodeCreator,
    });
    const root = this.tree.getRoot();

    const selection = new Selection(root);
    this.selection = selection;

    const dataHandler = new DataHandler(selection, initialData, ydoc);
    this.dataHandler = dataHandler;

    dataHandler.on('data', ({ data, preSelectIds }) => {
      this.tree.render(data);
      if (preSelectIds.length > 0) {
        this.selection.selectByIds(preSelectIds);
      }
    });

    const textEditor = new TextEditor({
      viewport,
      selection,
      dataHandler,
      paperWrapper: this.paperWrapper,
    });

    new NodeInteraction({
      nodeCreator: this.nodeCreator,
      selection,
      textEditor,
      dataHandler,
    });

    new SelectionBoundaryMove(selection, viewport);

    this.viewportInteraction = new ViewportInteraction({
      paperWrapper: this.paperWrapper,
      viewport,
      root,
    });

    const toolOperation = new ToolOperation({
      root,
      tree: this.tree,
      selection,
      dataHandler,
    });

    this.multiSelect = new MultiSelect({
      paperWrapper: this.paperWrapper,
      viewport,
      selection,
      toolOperation,
    });

    this.keyboard = new Keyboard({
      toolOperation,
      selection,
      textEditor,
      multiSelect: this.multiSelect,
      viewportInteraction: this.viewportInteraction,
    });

    new Toolbar({
      paperWrapper: this.paperWrapper,
      toolOperation,
      selection,
      dataHandler,
      textEditor,
      viewportInteraction: this.viewportInteraction,
    });

    new ViewportScale({
      paperWrapper: this.paperWrapper,
      viewport,
    });
  }

  public on<T extends EventNames>(eventName: T, callback: EventMap[T]): void {
    if (eventName === 'data') {
      this.dataHandler.on(eventName, callback);
    }
  }

  public clear(): void {
    this.paperWrapper.clear();
    this.nodeCreator.clear();
    this.tree.clear();
    this.viewportInteraction.clear();
    this.multiSelect.clear();
    this.keyboard.clear();
  }

  public bindAwareness(awareness: Awareness): void {
    new AwarenessHandler(awareness, this.selection, this.tree.getRoot(), this.paperWrapper);
  }
}

export default MindmapTree;
