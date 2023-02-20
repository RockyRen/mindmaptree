
import PaperWrapper from './paper-wrapper';
import Tree from './tree/tree';
import TreeOperation from './tree/tree-operation';
import NodeCreator from './node/node-creator';
import NodeInteraction from './node-interaction';
import Viewport from './viewport';
import ViewportInteraction from './viewport-interaction/viewport-interaction';
import TextEditor from './text-editor';
import Selection from './selection/selection';
import MultiSelect from './selection/multi-select';
import Keyboard from './keyboard/keyboard';
import DataProxy, { getInitData } from './data/data-proxy';
import { setConfig } from './config';
import ToolOperation from './tool-operation';
import Toolbar from './component/toolbar/toolbar';
import ViewportScale from './component/viewport-scale/viewport-scale';
import SelectionBoundaryMove from './selection/selection-boundary-move';
import type { DataProxyEventMap } from './data/data-proxy';
import type { NodeDataMap } from './types';
import './index.less';
import './mobile.less';

export interface EventMap {
  data: DataProxyEventMap['data'];
}

export type EventNames = keyof EventMap;

export interface MindmapTreeOptions {
  container: string | Element;
  data?: NodeDataMap;
  isDebug?: boolean;
  scale?: number;
}

class MindmapTree {
  private readonly paperWrapper: PaperWrapper;
  private readonly viewportInteraction: ViewportInteraction;
  private readonly tree: Tree;
  private readonly keyboard: Keyboard;
  private readonly multiSelect: MultiSelect;
  private readonly nodeCreator: NodeCreator;
  private readonly dataProxy: DataProxy;
  public constructor({
    container,
    data,
    isDebug = false,
    scale,
  }: MindmapTreeOptions) {
    setConfig({ isDebug });
    this.paperWrapper = new PaperWrapper(container);
    const paper = this.paperWrapper.getPaper();
    const viewport = new Viewport(this.paperWrapper, scale);
    this.nodeCreator = new NodeCreator({
      paper,
      viewport,
    });
    const initData = getInitData(data);

    // render tree and create root
    this.tree = new Tree({
      viewport,
      data: initData,
      nodeCreator: this.nodeCreator,
    });
    const root = this.tree.getRoot();

    const selection = new Selection();

    const dataProxy = new DataProxy({
      data: initData,
      selection,
      root,
    });
    this.dataProxy = dataProxy;

    const treeOperation = new TreeOperation({
      root,
      selection,
      dataProxy,
      nodeCreator: this.nodeCreator,
    });

    new SelectionBoundaryMove(selection, viewport);

    const textEditor = new TextEditor({
      viewport,
      selection,
      dataProxy,
      paperWrapper: this.paperWrapper,
    });

    new NodeInteraction({
      nodeCreator: this.nodeCreator,
      selection,
      textEditor,
      dataProxy,
      treeOperation,
    });

    this.viewportInteraction = new ViewportInteraction({
      paperWrapper: this.paperWrapper,
      viewport,
      root,
    });

    const toolOperation = new ToolOperation({
      root,
      tree: this.tree,
      selection,
      dataProxy,
      treeOperation,
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
      dataProxy,
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
      this.dataProxy.on(eventName, callback);
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
}

export default MindmapTree;
