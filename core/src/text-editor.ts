import Node from './node/node';
import Viewport from './viewport';
import Selection from './selection/selection';
import { fontSize as rootFontSize } from './shape/root-node-shape';
import { fontSize as firstNodeFontSize } from './shape/first-node-shape';
import { fontSize as grandchildFontSize } from './shape/grandchild-node-shape';
import { DepthType } from './helper';
import DataProxy from './data/data-proxy';
import PaperWrapper from './paper-wrapper';

const fontSizeMap = {
  [DepthType.root]: rootFontSize,
  [DepthType.firstLevel]: firstNodeFontSize,
  [DepthType.grandchild]: grandchildFontSize,
};

class TextEditor {
  private readonly editorWrapperDom: HTMLDivElement;
  private readonly editorDom: HTMLDivElement;
  private readonly viewport: Viewport;
  private readonly dataProxy: DataProxy;
  private isShow: boolean = false;
  private node: Node | null = null; // 当前操作的节点，需要看见的时候才算操作
  public constructor({
    viewport,
    selection,
    dataProxy,
    paperWrapper,
  }: {
    viewport: Viewport;
    selection: Selection;
    dataProxy: DataProxy;
    paperWrapper: PaperWrapper;
  }) {
    this.viewport = viewport;
    this.dataProxy = dataProxy;

    const doms = this.initTextEditorElement(paperWrapper);
    this.editorWrapperDom = doms.editorWrapperDom;
    this.editorDom = doms.editorDom;

    selection.on('select', () => {
      const selectNodes = selection.getSelectNodes();

      // 如果被选节点只有一个，且和上一个不一样，设置label，并且focus
      if (selectNodes.length === 1 && this.node?.id !== selectNodes[0].id) {
        console.log('focus & change----');
        this.setLabel();

        this.editorDom.focus();
        this.editorDom.innerText = '';
        this.hide();

        this.node = selectNodes[0];
        this.translate();
      }
      // 当被选节点存在，但是变多选或者不选时，设置label，并且blur
      else if (this.node !== null && (selectNodes.length !== 1 || selectNodes[0].id !== this.node.id)) {
        console.log('blur----');
        this.setLabel();

        this.editorDom.innerText = '';
        this.editorDom.blur();
        this.hide();

        this.node = null;
      }
    });

    this.editorDom.addEventListener('compositionstart', () => {
      if (!this.isShow) this.show();
    });


    this.editorDom.addEventListener('input', (event: Event) => {
      // @ts-ignore
      const inputValue = event.data;
      console.log('input', inputValue, this.isEditableKey(inputValue));
      if (!this.isShow) {
        if (this.isEditableKey(inputValue)) {
          this.show();
        } else {
          this.editorDom.innerText = '';
        }
      }
    });
  }

  public showBySelectionLabel(): void {
    this.show();
    this.editorDom.innerText = this.node?.label || '';

    // @ts-ignore
    document.execCommand('selectAll', false, null);
    // @ts-ignore
    document.getSelection().collapseToEnd();
  }

  public isShowing(): boolean {
    return this.isShow;
  }

  public finishEdit(): void {
    this.setLabel();
    this.editorDom.innerText = '';
    this.hide();
  }

  // todo 名字有问题
  private show(): void {
    if (this.node === null) return;

    console.log('show----', this.node.id);
    const scale = this.viewport.getScale();
    const fontSize = fontSizeMap[this.node.getDepthType()] * scale;
    this.editorWrapperDom.style.zIndex = '3';
    this.editorDom.style.fontSize = `${fontSize}px`;
    this.translate();
    this.editorDom.focus();

    this.isShow = true;
  }

  private hide(): void {
    console.log('hide----');
    this.editorWrapperDom.style.zIndex = '-9999';
    this.isShow = false;
  }

  private initTextEditorElement(paperWrapper: PaperWrapper): {
    editorWrapperDom: HTMLDivElement;
    editorDom: HTMLDivElement;
  } {
    const editorWrapperDom = document.createElement('div');
    editorWrapperDom.className = 'node-edit-text-wrapper';

    const editorDom = document.createElement('div');
    editorDom.className = 'node-edit-text';
    editorDom.setAttribute('contenteditable', 'true');

    const containerDom = paperWrapper.getContainerDom();

    editorWrapperDom.appendChild(editorDom);
    containerDom.appendChild(editorWrapperDom);

    return {
      editorWrapperDom,
      editorDom,
    }
  }

  private isEditableKey(key: string): boolean {
    const editableOtherKeys = ['`', '-', '=', '[', ']', '\\', ';', '\'', ',', '.', '/'];
    return /^[\w\s]$/.test(key) || editableOtherKeys.includes(key);
  }

  private translate() {
    if (this.node === null) {
      return;
    }

    const { cx, cy } = this.node.getBBox();

    const { offsetX, offsetY } = this.viewport.getOffsetPosition(cx, cy);
    const scale = this.viewport.getScale();

    const fontSize = fontSizeMap[this.node.getDepthType()];

    const editorDomHeight = (1.4 * fontSize + 6) * scale;

    this.editorWrapperDom.style.left = `${offsetX - 300}px`;
    this.editorWrapperDom.style.top = `${offsetY - editorDomHeight / 2}px`;
  }

  private setLabel(): void {
    const newLabel = this.editorDom.innerText;
    if (this.node !== null && this.isShow && newLabel !== this.node.label) {
      this.node.setLabel(newLabel);
      this.dataProxy.setData(this.node.id, { label: newLabel }, [this.node.id])
    }
  }
}

export default TextEditor;
